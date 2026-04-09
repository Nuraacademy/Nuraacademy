/**
 * Standard date formatting for Nuraacademy
 * Uses Asia/Jakarta timezone (WIB, UTC+7) by default to ensure consistency
 * between Server and Client components.
 */
export const formatDate = (date: Date | string | number | null | undefined): string => {
    if (!date) return "-";
    
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return "-";

        return new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Jakarta'
        }).format(d).replace('pukul', '').trim();
    } catch (error) {
        console.error("Error formatting date:", error);
        return "-";
    }
};

/**
 * Format date only (no time)
 */
export const formatDateOnly = (date: Date | string | number | null | undefined): string => {
    if (!date) return "-";
    
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return "-";

        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'Asia/Jakarta'
        }).format(d);
    } catch (error) {
        console.error("Error formatting date:", error);
        return "-";
    }
};
