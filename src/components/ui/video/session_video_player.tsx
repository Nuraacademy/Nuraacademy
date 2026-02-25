"use client"

type SessionVideoPlayerProps = {
    title: string;
    url: string;
};

export function SessionVideoPlayer({ title, url }: SessionVideoPlayerProps) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold text-gray-900">Video: {title}</h2>
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
                <iframe
                    width="100%"
                    height="100%"
                    src={url}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen>
                </iframe>
            </div>
        </div>
    );
}

