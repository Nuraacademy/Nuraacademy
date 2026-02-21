'use client';

interface FooterProps {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    x?: string;
}

export default function Footer({ instagram, facebook, linkedin, x } : FooterProps) {
    return (
        <main className="bg-[#042940] text-white py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
                    {/* Logo & Description */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div>
                                <h3 className="font-bold text-xl mb-4">Nura Academy</h3>
                                <p className="text-blue-200 text-sm leading-relaxed">
                                    Menara Tinggi Kav. 12, 
                                </p>
                                <p className="text-blue-200 text-sm leading-relaxed">
                                    Pasar Lama, Kota Jakarta Selatan
                                </p>
                                <p className="text-blue-200 text-sm leading-relaxed">
                                    Daerah Khusus Ibukota Jakarta 12340
                                </p>
                            </div>
                        </div>
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
                                !!facebook && (
                                    <a 
                                        href={facebook.startsWith('http') ? facebook : `https://${facebook}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        <img 
                                            src="/icons/Facebook.svg" 
                                            alt="Facebook" 
                                            className="w-6 h-6 hover:opacity-80 transition-all"
                                        />
                                    </a>
                                )
                            }
                            {
                                !!linkedin && (
                                    <a 
                                        href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        <img 
                                            src="/icons/Linkedin.svg" 
                                            alt="Linkedin" 
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

                    {/* Menu Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                        <div>
                            <h4 className="font-semibold mb-4">Bootcamp Specialist</h4>
                            <ul className="space-y-2 text-sm">
                            <li><a href="/bootcamps" className="hover:text-blue-300 transition-colors">UI/UX Design Specialist</a></li>
                            <li><a href="/bootcamps" className="hover:text-blue-300 transition-colors">Fullstack Web Develpoment</a></li>
                            <li><a href="/bootcamps" className="hover:text-blue-300 transition-colors">Data Science & AI</a></li>
                            <li><a href="/bootcamps" className="hover:text-blue-300 transition-colors">Digital Marketing & Strategy</a></li>
                            <li><a href="/bootcamps" className="hover:text-blue-300 transition-colors">Product Management</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm">
                            <li><a href="/blogs" className="hover:text-blue-300 transition-colors">Blog & Articles</a></li>
                            <li><a href="/discussions" className="hover:text-blue-300 transition-colors">Discussion Forum</a></li>
                            <li><a href="/classes" className="hover:text-blue-300 transition-colors">Free Modules</a></li>
                            <li><a href="/" className="hover:text-blue-300 transition-colors">Help Center</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                            <li><a href="/" className="hover:text-blue-300 transition-colors">About</a></li>
                            <li><a href="/privacy" className="hover:text-blue-300 transition-colors">Privacy Policy</a></li>
                            <li><a href="/terms" className="hover:text-blue-300 transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="border-t border-blue-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-blue-200">© 2026 Nura Academy. All rights reserved.</p>
                
                </div>
            </div>
        </main>
    );
}
