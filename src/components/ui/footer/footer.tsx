'use client';

interface FooterProps {
    variant?: "default" | "minimal";
    instagram?: string;
    youtube?: string;
    x?: string;
}

export default function Footer({ variant = "default", instagram, youtube, x } : FooterProps) {
    return (
        <main className={`bg-[#042940] text-white ${variant === "minimal" ? "py-4" : "py-12"} px-4 md:px-8 z-10`}>
            {variant === "default" ? (
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        {/* Company Information Column */}
                        <div>
                            <h3 className="font-bold text-xl mb-4">Nura Academy</h3>
                            <p className="text-white text-sm leading-relaxed mb-4">
                                Menara Tinggi Kav. 12, Pasar Lama, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12340
                            </p>
                            <p className="text-white text-sm mb-4">
                                Contact Number: +62 811-2233-4455
                            </p>
                            <div className="flex gap-4">
                                {
                                    !!instagram && (
                                        <a 
                                            href={instagram.startsWith('http') ? instagram : `https://${instagram}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            <img 
                                                src="/icons/Instagram.svg" 
                                                alt="Instagram" 
                                                className="w-6 h-6 hover:opacity-80 transition-all"
                                            />
                                        </a>
                                    )
                                }
                                {
                                    !!youtube && (
                                        <a 
                                            href={youtube.startsWith('http') ? youtube : `https://${youtube}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            <img 
                                                src="/icons/Youtube.svg" 
                                                alt="Youtube" 
                                                className="w-6 h-6 hover:opacity-80 transition-all"
                                            />
                                        </a>
                                    )
                                }
                                {
                                    !!x && (
                                        <a 
                                            href={x.startsWith('http') ? x : `https://${x}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            <img 
                                                src="/icons/X.svg" 
                                                alt="X" 
                                                className="w-6 h-6 hover:opacity-80 transition-all"
                                            />
                                        </a>
                                    )
                                }
                            </div>
                        </div>

                        {/* Data Classes Column */}
                        <div>
                            <h4 className="font-semibold mb-4">Data</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="/classes" className="text-white hover:text-blue-300 transition-colors">Class One</a></li>
                                <li><a href="/classes" className="text-white hover:text-blue-300 transition-colors">Class Two</a></li>
                                <li><a href="/classes" className="text-white hover:text-blue-300 transition-colors">Class Three</a></li>
                                <li><a href="/classes" className="text-white hover:text-blue-300 transition-colors">Class Four</a></li>
                            </ul>
                        </div>

                        {/* Software Engineer Classes Column */}
                        <div>
                            <h4 className="font-semibold mb-4">Software Engineer</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="/classes" className="text-white hover:text-blue-300 transition-colors">Class Five</a></li>
                                <li><a href="/classes" className="text-white hover:text-blue-300 transition-colors">Class Six</a></li>
                                <li><a href="/classes" className="text-white hover:text-blue-300 transition-colors">Class Seven</a></li>
                                <li><a href="/classes" className="text-white hover:text-blue-300 transition-colors">Class Eight</a></li>
                            </ul>
                        </div>

                        {/* UI/UX Classes Column */}
                        <div>
                            <h4 className="font-semibold mb-4">UI/UX</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="/classes" className="text-white hover:text-blue-300 transition-colors">Class Nine</a></li>
                                <li><a href="/classes" className="text-white hover:text-blue-300 transition-colors">Class Ten</a></li>
                                <li><a href="/classes" className="text-white hover:text-blue-300 transition-colors">Class Eleven</a></li>
                                <li><a href="/classes" className="text-white hover:text-blue-300 transition-colors">Class Twelve</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Separator Line */}
                    <div className="border-t border-gray-400 mb-6"></div>

                    {/* Bottom Row - Copyright */}
                    <div className="pt-4">
                        <p className="text-sm text-white">© 2026 PT Nura Academy. All Rights Reserved.</p>
                    </div>
                </div>
            ): (
                <div className="max-w-7xl mx-auto">
                    <div className="border-t border-blue-200/40 pt-4 flex items-center justify-between gap-4">
                        <p className="text-xs md:text-sm text-blue-100">
                            © 2026 PT Nura Academy. All Rights Reserved.
                        </p>

                        <div className="flex items-center gap-4">
                            {
                                !!instagram && (
                                    <a 
                                        href={instagram.startsWith('http') ? instagram : `https://${instagram}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        <img 
                                            src="/icons/Instagram.svg" 
                                            alt="Instagram" 
                                            className="w-7 h-7 rounded-md hover:bg-white transition-colors p-1.5"
                                        />
                                    </a>
                                )
                            }
                            {
                                !!youtube && (
                                    <a 
                                        href={youtube.startsWith('http') ? youtube : `https://${youtube}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        <img 
                                            src="/icons/YouTube.svg" 
                                            alt="Youtube" 
                                            className="w-7 h-7 rounded-md hover:bg-white transition-colors p-1.5"
                                        />
                                    </a>
                                )
                            }
                            {
                                !!x && (
                                    <a 
                                        href={x.startsWith('http') ? x : `https://${x}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        <img 
                                            src="/icons/X.svg" 
                                            alt="X" 
                                            className="w-7 h-7 rounded-md hover:bg-white transition-colors p-1.5"
                                        />
                                    </a>
                                )
                            }
                        </div>
                    </div>
                </div>
            )
            }
        </main>
    );
}
