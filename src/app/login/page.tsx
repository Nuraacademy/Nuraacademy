"use client"

import { useState } from "react";
import { NuraButton } from "@/components/ui/button/button";
import { NuraTextInput } from "@/components/ui/input/text_input";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function LoginPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Login form data:", {
            identifier,
            password,
        });
    };

    return (
        <main className="min-h-screen w-full bg-white flex items-stretch">
            {/* Left form panel */}
            <section className="w-full md:w-1/2 flex items-center justify-center px-4 md:px-10 py-10">
                <div className="w-full max-w-md bg-white rounded-none md:rounded-[32px] shadow-none px-4 md:px-10 py-8 md:py-12">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <img
                            src="/logo/logo_nura.png"
                            alt="Nura Academy"
                            className="h-10"
                            onClick={() => router.push('/')}
                        />
                    </div>

                    <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
                        Welcome to Nura
                    </h2>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <NuraTextInput
                                label="Username or Email"
                                placeholder="Username or Email"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                            />
                        </div>

                        <div>
                            <NuraTextInput
                                label="Password"
                                placeholder="Password"
                                variant="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-center pt-2">
                            <NuraButton
                                label="Get Started"
                                type="submit"
                                className="w-full rounded-full bg-black text-white py-2 text-sm font-medium hover:bg-gray-900 transition-colors"
                            />
                        </div>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            Don't have an account?{" "}
                            <a href="/register" className="font-semibold text-black">
                                Register
                            </a>
                        </p>
                    </form>
                </div>
            </section>

            {/* Right image panel */}
            <section className="relative hidden md:flex w-1/2 items-center justify-center overflow-hidden">
                <img
                    src="/background/LoginBG.svg"
                    alt="Login background"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="relative z-10 max-w-md px-10 text-white text-center">
                    <h1 className="text-4xl font-semibold mb-4">Hello Learner!</h1>
                    <p className="text-base leading-relaxed">
                        Let's grow together with Nura Academy<br />learning journey.
                    </p>
                </div>
            </section>
        </main>
    );
}
