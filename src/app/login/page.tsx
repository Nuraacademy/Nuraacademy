"use client"

import { useState } from "react";
import { NuraButton } from "@/components/ui/button/button";
import { NuraTextInput } from "@/components/ui/input/text_input";
import { useRouter } from "next/navigation";
import { handleLogin, handleGoogleLogin } from "@/app/actions/auth";
import { toast } from "sonner";
import Image from "next/image";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export const dynamic = "force-dynamic";

export default function LoginPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("identifier", identifier);
            formData.append("password", password);

            const result = await handleLogin(formData);

            if (result.success) {
                toast.success("Login successful!");
                router.push("/classes");
            } else {
                toast.error(result.error || "Login failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setIsLoading(true);
        try {
            if (credentialResponse.credential) {
                const result = await handleGoogleLogin(credentialResponse.credential);
                if (result.success) {
                    toast.success("Login successful!");
                    router.push("/classes");
                } else {
                    toast.error(result.error || "Google login failed");
                }
            }
        } catch (error) {
            toast.error("An unexpected error occurred during Google login");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
            <main className="min-h-screen w-full bg-white flex items-stretch">
            {/* Left form panel */}
            <section className="w-full md:w-1/2 flex items-center justify-center px-4 md:px-10 py-10">
                <div className="w-full max-w-md bg-white rounded-none md:rounded-xl shadow-none px-4 md:px-10 py-8 md:py-12">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <Image
                            src="/logo/logo_nura.png"
                            alt="Nura Academy"
                            width={120}
                            height={40}
                            className="cursor-pointer object-contain"
                            onClick={() => router.push('/')}
                        />
                    </div>

                    <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
                        Welcome to Nura
                    </h2>

                    <div className="flex justify-center mb-6">
                        <div className="w-full h-[40px] [&>div]:w-full [&>div>div]:w-full [&>div>div]:flex [&>div>div]:justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => {
                                    toast.error("Google Login Failed");
                                }}
                                width="100%"
                                shape="pill"
                                text="signin_with"
                            />
                        </div>
                    </div>

                    <div className="relative flex items-center py-2 mb-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">or</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <NuraTextInput
                                label="Username or Email"
                                placeholder="Username or Email"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                disabled={isLoading}
                                id="username"
                            />
                        </div>

                        <div>
                            <NuraTextInput
                                label="Password"
                                placeholder="Password"
                                variant="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                id="password"
                            />
                        </div>

                        <div className="flex items-center justify-center pt-2">
                            <NuraButton
                                label="Get Started"
                                type="submit"
                                isLoading={isLoading}
                                className="w-full rounded-full bg-black text-white py-2 text-sm font-medium hover:bg-gray-900 transition-colors"
                                id="login-btn"
                            />
                        </div>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            Don't have an account?{" "}
                            <a href="/register" className="font-semibold text-black hover:underline">
                                Register
                            </a>
                        </p>
                    </form>
                </div>
            </section>

            {/* Right image panel */}
            <section className="relative hidden md:flex w-1/2 items-center justify-center overflow-hidden">
                <Image
                    src="/background/LoginBG.svg"
                    alt="Login background"
                    fill
                    priority
                    className="object-cover"
                />

                <div className="relative z-10 max-w-md px-10 text-white text-center">
                    <h1 className="text-4xl font-semibold mb-4">Hello Everyone!</h1>
                    <p className="text-base leading-relaxed">
                        Let's grow together with Nura Academy<br />learning journey.
                    </p>
                </div>
            </section>
            </main>
        </GoogleOAuthProvider>
    );
}
