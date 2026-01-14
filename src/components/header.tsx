"use client"

import { useRouter } from 'next/navigation';

export default function Header({ title, is_logged_in }: { title: string, is_logged_in: boolean }) {
    const router = useRouter();
    return (
        <main className="sticky top-0 flex justify-between text-center items-center bg-white px-16 py-2 z-10 shadow-sm">
            <h1 className="text-2xl font-medium text-black text-left">
                {title}
            </h1>
            <div className="flex justify-end items-center gap-4 bg-white">
                <button 
                    className="flex justify-center items-center gap-2 w-32 h-12 rounded-lg hover:bg-gray-100 transition-colors px-4 text-s text-black bg-white" 
                    onClick={() => router.push('/classes')}
                >
                    <img 
                        src="/icons/Classes.svg" 
                        alt="Classes" 
                        className="w-6 h-6"
                    />
                    Classes
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

            <div className="relative w-64">
                <input 
                    type="text" 
                    placeholder="Search Classes" 
                    className="w-full h-12 pl-4 pr-4 py-2 text-s text-black bg-white rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
                <img 
                    src="/icons/Search.svg" 
                    alt="Search" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
                />
            </div>
            {   
                is_logged_in ? (
                    <div className="flex justify-end items-center">
                        <button className="bg-black text-white px-4 py-1 rounded-lg hover:bg-gray-800">
                            Sign In
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-end items-center gap-4 bg-white">
                        <img 
                            src="/icons/Notifications.svg"
                            alt="Notifications"
                            className="w-8 h-8"
                        />
                        <img 
                            src="/icons/Profile.svg"
                            alt="Profile"
                            className="w-8 h-8"
                        />
                    </div>
                )
            }
        </main>
    )
    
}