# Nura Academy — VPS Deployment Documentation

**Domain:** nuraacademy.id  
**Stack:** Next.js · Bun · PostgreSQL · Nginx · Systemd · PM2  
**OS:** Ubuntu (VPS)

---

## Table of Contents

1. [System Preparation](#1-system-preparation)
2. [Swap Space](#2-swap-space)
3. [Firewall (UFW)](#3-firewall-ufw)
4. [PostgreSQL Setup](#4-postgresql-setup)
5. [Bun Runtime](#5-bun-runtime)
6. [Application Deployment](#6-application-deployment)
7. [Database Initialization](#7-database-initialization)
8. [Systemd Service](#8-systemd-service)
9. [Nginx Configuration](#9-nginx-configuration)
10. [SSL Certificate (Let's Encrypt)](#10-ssl-certificate-lets-encrypt)
11. [Automated Database Backup](#11-automated-database-backup)
12. [Useful Commands](#12-useful-commands)

---

## 1. System Preparation

Update and upgrade all system packages before doing anything else.

```bash
sudo apt update -y && sudo apt upgrade -y
```

---

## 2. Swap Space

The VPS has limited RAM. A 2 GB swap file prevents OOM kills during builds.

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap persistent across reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Verify: `htop` → check Swp row.

---

## 3. Firewall (UFW)

Allow only the necessary ports, then enable the firewall.

```bash
sudo ufw allow OpenSSH       # SSH access (port 22)
sudo ufw allow 'Nginx Full'  # HTTP (80) + HTTPS (443)
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 3000           # Block direct access to Next.js port
sudo ufw allow 5432/tcp      # PostgreSQL — dibuka untuk akses eksternal (lihat catatan)
sudo ufw enable
```

**Firewall rules aktif:**

| # | Port | Action | Keterangan |
|---|------|--------|-----------|
| 1 | OpenSSH | ALLOW | SSH access |
| 2 | 3000 | DENY | Next.js diblokir, traffic lewat Nginx |
| 3 | 80 | ALLOW | HTTP (redirect ke HTTPS) |
| 4 | 443 | ALLOW | HTTPS |
| 5 | 5432/tcp | ALLOW | PostgreSQL (sengaja dibuka untuk akses eksternal) |

> **Catatan Port 5432:** Port PostgreSQL dibuka secara intentional untuk memungkinkan koneksi dari tool eksternal seperti TablePlus atau DBeaver. Pastikan user database menggunakan password yang kuat dan akses dibatasi hanya untuk user/IP yang diperlukan via `pg_hba.conf`.

---

## 4. PostgreSQL Setup

### Install & Start

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Create Database and User

```bash
sudo -u postgres psql
```

Inside psql:

```sql
CREATE USER nura_user WITH PASSWORD 'your_password';
CREATE DATABASE nura_db OWNER nura_user;
GRANT ALL PRIVILEGES ON DATABASE nura_db TO nura_user;
\q
```

### Connection String

```
postgresql://nura_user:your_password@localhost:5432/nura_db
```

### Configuration Files

| File | Purpose |
|------|---------|
| `/etc/postgresql/16/main/postgresql.conf` | Server tuning — `listen_addresses = '*'` (menerima koneksi dari semua IP) |
| `/etc/postgresql/16/main/pg_hba.conf` | Client authentication rules |

After editing either file:

```bash
sudo systemctl restart postgresql
```

---

## 5. Bun Runtime

```bash
sudo apt install unzip
curl -fsSL https://bun.com/install | bash
# Reload shell or source ~/.bashrc
bun --version
```

Bun is installed per-user under `~/.bun/bin/bun`. Reference it as `/home/nura/.bun/bin/bun` in service files.

---

## 6. Application Deployment

### Create App Directory

```bash
sudo mkdir -p /var/www/my-app
sudo chown $USER:$USER /var/www/my-app
cd /var/www/my-app
```

### Clone Repository

```bash
git clone https://github.com/Nuraacademy/Nuraacademy
cd Nuraacademy/
```

> Files were later reorganised to live directly under `/var/www/my-app/` (no sub-folder):
>
> ```bash
> mv Nuraacademy/* ./
> mv Nuraacademy/.env ./
> mv Nuraacademy/.git ./
> mv Nuraacademy/.gitignore ./
> mv Nuraacademy/.next/ ./
> ```

### Environment Variables

```bash
nano /var/www/my-app/.env
```

Minimum required variables:

```env
DATABASE_URL=postgresql://nura_user:your_password@localhost:5432/nura_db
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=https://nuraacademy.id
# ... other app-specific variables
```

### Install Dependencies & Build

```bash
cd /var/www/my-app
bun install
bun run build
```

---

## 7. Database Initialization

Run these in order after the database and `.env` are configured.

```bash
# Generate Prisma client
bunx prisma generate

# Push schema to database
bunx prisma db push

# Seed roles
bun run prisma/seed-roles.ts

# Seed initial data
bun run prisma/seed.ts
```

### Applying Pending Migrations (if needed)

If migrations are out of sync, resolve them manually:

```bash
/home/nura/.bun/bin/bun x prisma migrate resolve --applied <migration_name>
```

Example:

```bash
/home/nura/.bun/bin/bun x prisma migrate resolve --applied 20260305140406
```

---

## 8. Systemd Service

Managing the app as a systemd service ensures it starts on boot and restarts on failure.

### Service File

```bash
sudo nano /etc/systemd/system/nura.service
```

```ini
[Unit]
Description=Nura Academy Next.js App
After=network.target

[Service]
Type=simple
User=nura
WorkingDirectory=/var/www/my-app
ExecStart=/home/nura/.bun/bin/bun run start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

### Enable & Start

```bash
sudo systemctl daemon-reload
sudo systemctl enable nura
sudo systemctl start nura
sudo systemctl status nura
```

### Common Service Commands

```bash
sudo systemctl restart nura       # Restart after code changes
sudo systemctl stop nura          # Stop the service
sudo systemctl status nura        # Check current state
journalctl -u nura.service -f     # Live logs
journalctl -u nura.service -n 50  # Last 50 log lines
journalctl -u nura.service -p err # Errors only
```

---

## 9. Nginx Configuration

Nginx acts as a reverse proxy, forwarding traffic ke app di port 3000.

> **Penting:** Setup Nginx dengan port 80 dulu. Jangan tulis config 443 secara manual — blok SSL akan ditambahkan otomatis oleh Certbot di step 10.

### Install

```bash
sudo apt install nginx
```

### Site Configuration (HTTP only — sebelum Certbot)

```bash
sudo nano /etc/nginx/sites-available/my-app
```

```nginx
server {
    listen 80;
    server_name nuraacademy.id;
    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/my-app /etc/nginx/sites-enabled/
sudo nginx -t                  # Harus menampilkan "syntax is ok"
sudo systemctl restart nginx
```

Lanjut ke step 10 untuk mengaktifkan HTTPS.

---

## 10. SSL Certificate (Let's Encrypt)

Certbot memverifikasi kepemilikan domain melalui `http://nuraacademy.id/.well-known/acme-challenge/` — karena itu Nginx **harus sudah berjalan di port 80** sebelum langkah ini.

### Install Certbot

```bash
sudo apt install -y python3-certbot-nginx
```

### Obtain Certificate

```bash
sudo certbot --nginx -d nuraacademy.id
```

Certbot akan otomatis:
- Menerbitkan SSL certificate
- Menambahkan blok `listen 443 ssl` ke config Nginx
- Menambahkan redirect HTTP → HTTPS
- Menjadwalkan auto-renewal via cron

### Hasil akhir config Nginx (setelah Certbot)

File `/etc/nginx/sites-available/my-app` akan berubah menjadi:

```nginx
server {
    server_name nuraacademy.id;
    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/nuraacademy.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nuraacademy.id/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = nuraacademy.id) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name nuraacademy.id;
    return 404; # managed by Certbot
}
```

Verifikasi Nginx setelah Certbot selesai:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 11. Automated Database Backup

Backups are streamed directly to Google Drive using `pg_dump` and `rclone`.

### Install & Configure rclone

```bash
sudo apt install rclone
rclone config    # Follow prompts to add a "gdrive" remote
```

Verify:

```bash
rclone lsd gdrive:
```

### Backup Script

```bash
nano ~/auto_backup.sh
chmod +x ~/auto_backup.sh
```

```bash
#!/bin/bash

# Variabel
DB_URI="postgresql://nura_user:your_password@localhost:5432/nura_db"
BACKUP_DIR="$HOME/backups"
TIMESTAMP=$(date +%Y-%m-%d_%H%M)
FILENAME="nura_db_$TIMESTAMP.dump"
REMOTE_NAME="gdrive"
REMOTE_FOLDER="DatabaseBackup"

# Buat folder lokal jika belum ada
mkdir -p "$BACKUP_DIR"

# 1. Jalankan Dump Database
echo "Sedang memproses backup..."
pg_dump -d "$DB_URI" -F c -f "$BACKUP_DIR/$FILENAME"

# 2. Upload ke Google Drive
if [ $? -eq 0 ]; then
    echo "Backup berhasil, mengunggah ke Google Drive..."
    rclone copy "$BACKUP_DIR/$FILENAME" "$REMOTE_NAME:$REMOTE_FOLDER"

    # 3. Hapus file lokal yang lebih lama dari 7 hari agar disk tidak penuh
    find "$BACKUP_DIR" -type f -name "*.dump" -mtime +7 -delete

    echo "Selesai! File diunggah ke folder: $REMOTE_FOLDER"
else
    echo "Gagal melakukan backup database."
    exit 1
fi
```

### Schedule with Cron

```bash
crontab -e
```

Example — daily backup at 2 AM:

```
0 2 * * * /home/nura/auto_backup.sh >> /home/nura/backup.log 2>&1
```

### Manual Backup (one-off)

```bash
pg_dump -d "postgresql://nura_user:your_password@localhost:5432/nura_db" \
  -F c | rclone rcat gdrive:DatabaseBackup/manual_backup.dump
```

---

## 12. Useful Commands

### Deploying Updates

```bash
cd /var/www/my-app
git pull
bun install
bun run build
sudo systemctl restart nura
```

### Check if App is Running

```bash
sudo systemctl status nura
curl http://localhost:3000
```

### View Firewall Rules

```bash
sudo ufw status numbered
```

### Connect to Database

```bash
psql "postgresql://nura_user:your_password@localhost:5432/nura_db"
```

### Monitor Resources

```bash
htop
sudo dmesg | grep -i 'killed process'   # Check for OOM kills
```

---

*Documentation generated from deployment history on nuraacademy.id VPS.*