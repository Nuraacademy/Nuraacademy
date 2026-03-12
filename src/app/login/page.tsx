"use client"

import { useState } from "react";
import { NuraButton } from "@/components/ui/button/button";
import { NuraTextInput } from "@/components/ui/input/text_input";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/app/actions/auth";
import { toast } from "sonner";
import Image from "next/image";

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

    return (
        <main className="min-h-screen w-full bg-white flex items-stretch">
            {/* Left form panel */}
            <section className="w-full md:w-1/2 flex items-center justify-center px-4 md:px-10 py-10">
                <div className="w-full max-w-md bg-white rounded-none md:rounded-[32px] shadow-none px-4 md:px-10 py-8 md:py-12">
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

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <NuraTextInput
                                label="Username or Email"
                                placeholder="Username or Email"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                disabled={isLoading}
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
                            />
                        </div>

                        <div className="flex items-center justify-center pt-2">
                            <NuraButton
                                label="Get Started"
                                type="submit"
                                isLoading={isLoading}
                                className="w-full rounded-full bg-black text-white py-2 text-sm font-medium hover:bg-gray-900 transition-colors"
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
                    <h1 className="text-4xl font-semibold mb-4">Hello Learner!</h1>
                    <p className="text-base leading-relaxed">
                        Let's grow together with Nura Academy<br />learning journey.
                    </p>
                </div>
            </section>
        </main>
    );
}
