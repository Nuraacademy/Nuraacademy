
export type BaseSession = {
    id: string;
    title: string;
    time: string;
    referenceMaterials: {
        name: string;
        description: string;
    }[];
    footerButtons: {
        label: string;
        variant: string;
        href: string;
    }[];
};

export type AsynchronousSession = BaseSession & {
    type: "Asynchronous";
    video: {
        title: string;
        url: string;
    };
};

export type SynchronousSession = BaseSession & {
    type: "Synchronous";
    zoom: {
        link: string;
        status: string;
    };
    presence: {
        label: string;
        href: string;
    };
    recording?: {
        title: string;
        url: string;
    };
};

export type AssignmentSession = BaseSession & {
    type: "Assignment";
};

export type Session = AsynchronousSession | SynchronousSession | AssignmentSession;

export const SESSION_DATA: {
    classTitle: string;
    courseTitle: string;
    sessions: Record<string, Session>;
} = {
    classTitle: "Foundation to Data Analytics",
    courseTitle: "Introduction to Programming",
    sessions: {
        "1": {
            id: "1",
            title: "Python Video Session",
            type: "Asynchronous" as const,
            time: "Saturday, 02 May 2026, 19:00",
            video: {
                title: "How I'd Learn Python",
                url: "https://www.youtube.com/embed/EHOnDDP9tvA"
            },
            referenceMaterials: [
                {
                    name: "Introduction to Python.pptx",
                    description: "Pada sesi ini, silahkan diskusikan materi dengan grup Anda dan kerjakan group summary tertera!"
                }
            ],
            footerButtons: [
                { label: "Group Summary", variant: "primary", href: "#" }
            ]
        },
        "2": {
            id: "2",
            title: "Zoom Session",
            type: "Synchronous" as const,
            time: "Saturday, 02 May 2026, 19:00",
            referenceMaterials: [
                {
                    name: "Coffee Shop.csv",
                    description: "Pada sesi ini, Anda diminta untuk mengikuti practice programming menggunakan python. Download dataset tertera untuk dapat mengikuti sesi!"
                }
            ],
            zoom: {
                link: "https://zoom.us/join?=abc45ghj89",
                status: "Scheduled"
            },
            recording: {
                title: "Python Programming",
                url: "https://www.youtube.com/embed/EHOnDDP9tvA"
            },
            presence: {
                label: "Lihat daftar hadir",
                href: "#"
            },
            footerButtons: [
                { label: "Pre-test", variant: "primary", href: "#" },
                { label: "Post-test", variant: "primary", href: "#" }
            ]
        }
    }
};
