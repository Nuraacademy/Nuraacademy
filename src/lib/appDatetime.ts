/**
 * Zona waktu operasional untuk jadwal kelas / timeline (Indonesia).
 * Bisa dioverride lewat APP_TIMEZONE atau NEXT_PUBLIC_APP_TIMEZONE (IANA, mis. Asia/Jakarta).
 */
export function getAppTimeZone(): string {
    return (
        process.env.APP_TIMEZONE ||
        process.env.NEXT_PUBLIC_APP_TIMEZONE ||
        "Asia/Jakarta"
    );
}

const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000;

/**
 * Awal hari kalender di zona aplikasi (instant UTC).
 * Untuk Asia/Jakarta memakai offset tetap +7 (tanpa DST).
 */
export function startOfAppDay(now: Date = new Date()): Date {
    const tz = getAppTimeZone();
    const ymd = now.toLocaleDateString("en-CA", { timeZone: tz });
    const [y, m, d] = ymd.split("-").map(Number);
    if (tz === "Asia/Jakarta") {
        return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0) - JAKARTA_OFFSET_MS);
    }
    const s = new Date(now);
    s.setHours(0, 0, 0, 0);
    return s;
}

/**
 * Akhir hari kalender di zona aplikasi (instant UTC).
 */
export function endOfAppDay(now: Date = new Date()): Date {
    const tz = getAppTimeZone();
    const ymd = now.toLocaleDateString("en-CA", { timeZone: tz });
    const [y, m, d] = ymd.split("-").map(Number);
    if (tz === "Asia/Jakarta") {
        return new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999) - JAKARTA_OFFSET_MS);
    }
    const e = new Date(now);
    e.setHours(23, 59, 59, 999);
    return e;
}

function toDate(input: Date | string | null | undefined): Date | null {
    if (input == null) return null;
    const d = input instanceof Date ? input : new Date(input);
    return Number.isNaN(d.getTime()) ? null : d;
}

/** Tanggal saja untuk ditampilkan pengguna (id-ID, zona aplikasi). */
export function formatAppDate(
    input: Date | string | null | undefined,
    fallback = "TBA"
): string {
    const d = toDate(input);
    if (!d) return fallback;
    return d.toLocaleDateString("id-ID", {
        timeZone: getAppTimeZone(),
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

/** Tanggal + jam untuk ditampilkan pengguna (id-ID, zona aplikasi). */
export function formatAppDateTime(
    input: Date | string | null | undefined,
    fallback = "TBA"
): string {
    const d = toDate(input);
    if (!d) return fallback;
    return d.toLocaleString("id-ID", {
        timeZone: getAppTimeZone(),
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
