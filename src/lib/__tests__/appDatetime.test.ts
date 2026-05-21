import { describe, test, expect, beforeAll } from 'bun:test';
import {
    getAppTimeZone,
    startOfAppDay,
    endOfAppDay,
    formatAppDate,
    formatAppDateTime,
    formatAppDateLong,
    formatAppDateTimeLong,
    formatAppTime,
} from '../appDatetime';

/**
 * Tujuan dari test ini:
 * - Memastikan rendering tanggal/jam timeline dan placement test KONSISTEN lintas TZ browser.
 *   Bug awalnya: helper `toLocaleString` dipanggil tanpa option `timeZone`, sehingga hasil render
 *   ikut TZ user. Akibatnya jam placement test bisa terlihat berbeda antara user di TZ Jakarta
 *   vs user di TZ lain (mis. WITA, UTC, dst).
 * - Test ini memverifikasi bahwa formatter selalu menghasilkan string yang dihitung di
 *   zona aplikasi (default Asia/Jakarta), terlepas dari TZ runtime.
 */

beforeAll(() => {
    // Default app timezone — pastikan tidak di-override oleh env saat menjalankan test.
    delete process.env.APP_TIMEZONE;
    delete process.env.NEXT_PUBLIC_APP_TIMEZONE;
});

describe('getAppTimeZone', () => {
    test('default ke Asia/Jakarta jika tidak ada env override', () => {
        expect(getAppTimeZone()).toBe('Asia/Jakarta');
    });

    test('memakai APP_TIMEZONE jika di-set', () => {
        process.env.APP_TIMEZONE = 'Asia/Singapore';
        expect(getAppTimeZone()).toBe('Asia/Singapore');
        delete process.env.APP_TIMEZONE;
    });

    test('memakai NEXT_PUBLIC_APP_TIMEZONE sebagai fallback', () => {
        process.env.NEXT_PUBLIC_APP_TIMEZONE = 'Asia/Makassar';
        expect(getAppTimeZone()).toBe('Asia/Makassar');
        delete process.env.NEXT_PUBLIC_APP_TIMEZONE;
    });
});

describe('startOfAppDay & endOfAppDay (Asia/Jakarta)', () => {
    test('startOfAppDay menghasilkan 00:00 WIB (= 17:00 UTC hari sebelumnya)', () => {
        // 2026-05-21 14:30 UTC = 2026-05-21 21:30 WIB → start of day WIB = 2026-05-20 17:00 UTC
        const ref = new Date('2026-05-21T14:30:00.000Z');
        const start = startOfAppDay(ref);
        expect(start.toISOString()).toBe('2026-05-20T17:00:00.000Z');
    });

    test('endOfAppDay menghasilkan 23:59:59.999 WIB (= 16:59:59.999 UTC esok harinya)', () => {
        const ref = new Date('2026-05-21T14:30:00.000Z');
        const end = endOfAppDay(ref);
        expect(end.toISOString()).toBe('2026-05-21T16:59:59.999Z');
    });

    test('startOfAppDay konsisten ketika input pre-midnight UTC tetapi sudah esok hari di Jakarta', () => {
        // 2026-05-21 18:00 UTC = 2026-05-22 01:00 WIB → start of day WIB = 2026-05-21 17:00 UTC
        const ref = new Date('2026-05-21T18:00:00.000Z');
        const start = startOfAppDay(ref);
        expect(start.toISOString()).toBe('2026-05-21T17:00:00.000Z');
    });
});

describe('formatAppDate', () => {
    test('memformat tanggal di TZ Jakarta', () => {
        // 2026-05-21 03:00 UTC = 2026-05-21 10:00 WIB
        const result = formatAppDate(new Date('2026-05-21T03:00:00.000Z'));
        expect(result).toBe('21 Mei 2026');
    });

    test('memberi tanggal yang sama walaupun jam UTC berbeda (sebelum vs sesudah midnight UTC, tapi masih hari yang sama di Jakarta)', () => {
        // Kasus klasik bug: kalau formatter pakai TZ UTC, tanggal akan beda; kalau pakai
        // TZ Jakarta, dua-duanya seharusnya "21 Mei 2026" karena keduanya = 21 Mei di WIB.
        const a = formatAppDate(new Date('2026-05-20T17:30:00.000Z')); // 2026-05-21 00:30 WIB
        const b = formatAppDate(new Date('2026-05-21T16:30:00.000Z')); // 2026-05-21 23:30 WIB
        expect(a).toBe('21 Mei 2026');
        expect(b).toBe('21 Mei 2026');
    });

    test('mengembalikan fallback ketika input null/undefined', () => {
        expect(formatAppDate(null)).toBe('TBA');
        expect(formatAppDate(undefined)).toBe('TBA');
        expect(formatAppDate(null, '-')).toBe('-');
    });

    test('mengembalikan fallback ketika input invalid', () => {
        expect(formatAppDate('not-a-date')).toBe('TBA');
    });

    test('menerima ISO string', () => {
        expect(formatAppDate('2026-05-21T03:00:00.000Z')).toBe('21 Mei 2026');
    });
});

describe('formatAppDateTime', () => {
    test('memformat tanggal + jam di TZ Jakarta', () => {
        // 2026-05-21 03:00 UTC = 2026-05-21 10:00 WIB
        const result = formatAppDateTime(new Date('2026-05-21T03:00:00.000Z'));
        // Format Indonesia: dd/mm/yyyy hh.mm (ID locale memakai titik sebagai pemisah jam)
        expect(result).toContain('21/05/2026');
        expect(result).toContain('10');
    });

    test('jam Jakarta 00:00 (= 17:00 UTC hari sebelumnya)', () => {
        const result = formatAppDateTime(new Date('2026-05-20T17:00:00.000Z'));
        expect(result).toContain('21/05/2026');
        expect(result).toContain('00');
    });
});

describe('formatAppDateLong', () => {
    test('format panjang dengan weekday di TZ Jakarta', () => {
        // 2026-05-21 03:00 UTC = 2026-05-21 (Kamis) 10:00 WIB
        const result = formatAppDateLong(new Date('2026-05-21T03:00:00.000Z'));
        expect(result).toContain('Kamis');
        expect(result).toContain('Mei');
        expect(result).toContain('2026');
    });
});

describe('formatAppDateTimeLong', () => {
    test('format panjang dengan weekday + jam di TZ Jakarta', () => {
        const result = formatAppDateTimeLong(new Date('2026-05-21T03:00:00.000Z'));
        expect(result).toContain('Kamis');
        expect(result).toContain('Mei');
        expect(result).toContain('2026');
        expect(result).toContain('10');
    });
});

describe('formatAppTime', () => {
    test('mengembalikan jam:menit di TZ Jakarta', () => {
        // 03:00 UTC = 10:00 WIB
        expect(formatAppTime(new Date('2026-05-21T03:00:00.000Z'))).toBe('10.00');
    });

    test('mengembalikan fallback ketika null', () => {
        expect(formatAppTime(null)).toBe('--:--');
    });
});

describe('regression — placement test rendering konsisten lintas TZ browser', () => {
    /**
     * Skenario bug awal:
     * Admin (TZ Jakarta) men-set placement test dimulai 21 Mei 2026 jam 09:00 WIB.
     * Disimpan ke DB sebagai 2026-05-21T02:00:00.000Z.
     *
     * User di TZ +07 (Jakarta) melihat: 21 Mei 2026, 09.00 ✓
     * User di TZ +08 (WITA) sebelumnya melihat: 21 Mei 2026, 10.00 ✗ (geser 1 jam)
     * User di TZ +00 (UTC) sebelumnya melihat: 21 Mei 2026, 02.00 ✗ (geser banyak)
     *
     * Setelah fix, semua user harus melihat hasil yang sama (= zona aplikasi):
     * 21 Mei 2026, 09.00.
     */
    test('semua TZ browser menghasilkan tanggal yang identik', () => {
        const placementStart = new Date('2026-05-21T02:00:00.000Z');

        // Helper memang selalu memakai TZ aplikasi, jadi hasilnya tidak boleh
        // berubah meskipun process.env.TZ di-mock berbeda. Kita verifikasi
        // string hasilnya saja.
        const dateStr = formatAppDate(placementStart);
        const timeStr = formatAppTime(placementStart);

        expect(dateStr).toBe('21 Mei 2026');
        expect(timeStr).toBe('09.00');
    });

    test('endDate placement test di tengah malam WIB tetap muncul di tanggal yang benar', () => {
        // Admin set "Placement Test Ends" pada 21 Mei 2026 jam 23:59 WIB.
        // Disimpan sebagai 2026-05-21T16:59:00.000Z.
        const placementEnd = new Date('2026-05-21T16:59:00.000Z');

        // Bug lama: di TZ UTC akan tampil "21 Mei 2026 16.59"
        // atau di TZ +08 akan tampil "22 Mei 2026 00.59" → user salah lihat tanggal!
        // Setelah fix, harus konsisten "21 Mei 2026 23.59" untuk semua user.
        expect(formatAppDate(placementEnd)).toBe('21 Mei 2026');
        expect(formatAppTime(placementEnd)).toBe('23.59');
    });
});
