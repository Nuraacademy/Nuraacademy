"use client"

import { useRouter, usePathname } from 'next/navigation';
import { NuraButton } from '../button/button';
import { getSession, handleLogout } from '@/app/actions/auth';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Header({ initialIsLoggedIn = false }: { initialIsLoggedIn?: boolean }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
    const [isLoading, setIsLoading] = useState(false);

    // Sync state with prop if it changes (e.g., after a server-side redirect/refresh)
    useEffect(() => {
        setIsLoggedIn(initialIsLoggedIn);
    }, [initialIsLoggedIn]);

    useEffect(() => {
        const checkSession = async () => {
            const userId = await getSession();
            setIsLoggedIn(!!userId);
        };
        checkSession();
    }, [pathname]); // Re-check on every navigation

    const onLogout = async () => {
        await handleLogout();
        setIsLoggedIn(false);
        router.refresh();
    };

    const onLogin = async () => {
        router.push('/login');
    };

    return (
        <main className="sticky top-0 h-16 flex justify-between text-center items-center bg-white px-4 md:px-16 py-2 z-50 shadow-sm">
            <Image
                src="/logo/logo_nura.png"
                alt="Nura Academy"
                width={80}
                height={40}
                className="cursor-pointer object-contain"
                onClick={() => router.push('/')}
            />
            <div className="flex justify-between items-center gap-8">
                <div className="flex justify-center items-center gap-4 bg-white">
                    <button
                        className="flex justify-center items-center gap-2 w-32 h-12 rounded-lg hover:bg-gray-100 transition-colors px-4 text-s text-black bg-white"
                        onClick={() => router.push('/classes')}
                    >
                        <Image
                            src="/icons/Home.svg"
                            alt="Home"
                            width={24}
                            height={24}
                        />
                        Home
                    </button>
                    <button
                        className="flex justify-center items-center gap-2 w-32 h-12 rounded-lg hover:bg-gray-100 transition-colors px-4 text-s text-black bg-white"
                        onClick={() => router.push('/discussions')}
                    >
                        <Image
                            src="/icons/Forums.svg"
                            alt="Forums"
                            width={24}
                            height={24}
                        />
                        Forums
                    </button>
                    <button
                        className="flex justify-center items-center gap-2 w-32 h-12 rounded-lg hover:bg-gray-100 transition-colors px-4 text-s text-black bg-white"
                        onClick={() => router.push('/blogs')}
                    >
                        <Image
                            src="/icons/Blogs.svg"
                            alt="Blogs"
                            width={24}
                            height={24}
                        />
                        Blogs
                    </button>
                </div>

                {!isLoading && (
                    <div className="flex justify-end items-center gap-4 bg-white">
                        {isLoggedIn ? (
                            <>
                                <Image
                                    src="/icons/Notifications.svg"
                                    alt="Notifications"
                                    width={24}
                                    height={24}
                                    className="cursor-pointer"
                                />
                                <Image
                                    src="/icons/Profile.svg"
                                    alt="Profile"
                                    width={24}
                                    height={24}
                                    className="cursor-pointer"
                                />
                                <NuraButton
                                    label="Logout"
                                    variant="medium"
                                    onClick={onLogout}
                                />
                            </>
                        ) : (
                            <NuraButton
                                label="Sign In"
                                variant="medium"
                                onClick={onLogin}
                            />
                        )}
                    </div>
                )}
            </div>

        </main>
    )

}