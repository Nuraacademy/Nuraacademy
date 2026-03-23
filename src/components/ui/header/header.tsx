"use client"

import { useRouter, usePathname } from 'next/navigation';
import { NuraButton } from '../button/button';
import { getSession, getFullSession, handleLogout } from '@/app/actions/auth';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { NotificationDropdown } from './notification_dropdown';

export default function Header({ initialIsLoggedIn = false }: { initialIsLoggedIn?: boolean }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [userData, setUserData] = useState<{ username: string; role: string; name?: string | null } | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getInitials = (name?: string | null, username?: string) => {
        const displayName = name || username || 'User';
        return displayName
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Sync state with prop if it changes (e.g., after a server-side redirect/refresh)
    useEffect(() => {
        setIsLoggedIn(initialIsLoggedIn);
    }, [initialIsLoggedIn]);

    useEffect(() => {
        const checkSession = async () => {
            const session = await getFullSession();
            setIsLoggedIn(!!session);
            if (session) {
                setUserData({
                    username: session.username,
                    role: session.role,
                    name: session.name
                });
            } else {
                setUserData(null);
            }
        };
        checkSession();
    }, [pathname]); // Re-check and update data on every navigation

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

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
                        className="flex justify-center items-center gap-2 w-32 h-12 rounded-xl hover:bg-gray-100 transition-colors px-4 text-s text-black bg-white"
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
                        className="flex justify-center items-center gap-2 w-32 h-12 rounded-xl hover:bg-gray-100 transition-colors px-4 text-s text-black bg-white"
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
                        className="flex justify-center items-center gap-2 w-32 h-12 rounded-xl hover:bg-gray-100 transition-colors px-4 text-s text-black bg-white"
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
                                <NotificationDropdown />
                                <div className="relative" ref={dropdownRef}>
                                    <Image
                                        src="/icons/Profile.svg"
                                        alt="Profile"
                                        width={24}
                                        height={24}
                                        className="cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => {
                                            setShowDropdown(!showDropdown);
                                        }}
                                    />
                                    {showDropdown && (
                                        <div className="absolute right-0 mt-6 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-4 pb-4 mb-3 border-b border-gray-50 flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg shadow-sm">
                                                    {getInitials(userData?.username, userData?.name)}
                                                </div>
                                                <div className="flex flex-col truncate">
                                                    <p className="text-start text-sm font-semibold text-gray-900 truncate">
                                                        {userData?.name || 'Username'}
                                                    </p>
                                                    <p className="text-start text-xs text-gray-500">
                                                        @{userData?.username || 'Username'}
                                                    </p>
                                                    <p className="text-start text-xs text-gray-500">
                                                        {userData?.role || 'Role'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="px-2 pb-2 mb-2 border-b border-gray-50">
                                                <button
                                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2"
                                                    onClick={() => {
                                                        router.push('/users/me');
                                                        setShowDropdown(false);
                                                    }}
                                                >
                                                    <Image src="/icons/Profile.svg" alt="Profile" width={16} height={16} className="opacity-70" />
                                                    My Profile
                                                </button>
                                            </div>
                                            {userData?.role !== 'Learner' && <div className="px-2 pb-2 mb-2 border-b border-gray-50">
                                                <button
                                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2"
                                                    onClick={() => {
                                                        router.push('/admin');
                                                        setShowDropdown(false);
                                                    }}
                                                >
                                                    <Image src="/icons/Profile.svg" alt="Profile" width={16} height={16} className="opacity-70" />
                                                    Admin
                                                </button>
                                            </div>}
                                            <div className="px-2">
                                                <button
                                                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
                                                    onClick={onLogout}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
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