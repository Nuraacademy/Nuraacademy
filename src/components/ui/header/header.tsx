"use client"

import { useRouter } from 'next/navigation';
import { NuraButton } from '../button/button';

export default function Header({ is_logged_in }: { is_logged_in: boolean }) {
    const router = useRouter();
    return (
        <main className="sticky top-0 flex justify-between text-center items-center bg-white px-16 py-2 z-10 shadow-sm">
            <img
                src="/logo/logo_nura.png"
                alt="Nura Academy"
                className="h-10"
                onClick={() => router.push('/')}
            />
            <div className="flex justify-between items-center gap-8">
                <div className="flex justify-center items-center gap-4 bg-white">
                    <button 
                        className="flex justify-center items-center gap-2 w-32 h-12 rounded-lg hover:bg-gray-100 transition-colors px-4 text-s text-black bg-white" 
                        onClick={() => router.push('/classes')}
                    >
                        <img 
                            src="/icons/Home.svg" 
                            alt="Home" 
                            className="w-6 h-6"
                        />
                        Home
                    </button>
                    <button 
                        className="flex justify-center items-center gap-2 w-32 h-12 rounded-lg hover:bg-gray-100 transition-colors px-4 text-s text-black bg-white" 
                        onClick={() => router.push('/discussions')}
                    >
                        <img 
                            src="/icons/Forums.svg" 
                            alt="Forums" 
                            className="w-6 h-6"
                        />
                        Forums
                    </button>
                    <button 
                        className="flex justify-center items-center gap-2 w-32 h-12 rounded-lg hover:bg-gray-100 transition-colors px-4 text-s text-black bg-white" 
                        onClick={() => router.push('/blogs')}
                    >
                        <img 
                            src="/icons/Blogs.svg" 
                            alt="Blogs" 
                            className="w-6 h-6"
                        />
                        Blogs
                    </button>
                </div>

                {   
                    is_logged_in ? (
                        <div className="flex justify-end items-center">
                            <NuraButton
                                label="Sign In"
                                variant="medium"
                                onClick={() => router.push('/login')}
                            />
                        </div>
                    ) : (
                        <div className="flex justify-end items-center gap-4 bg-white">
                            <img 
                                src="/icons/Notifications.svg"
                                alt="Notifications"
                                className="w-6 h-6"
                            />
                            <img 
                                src="/icons/Profile.svg"
                                alt="Profile"
                                className="w-6 h-6"
                            />
                        </div>
                    )
                }
            </div>
            
        </main>
    )
    
}