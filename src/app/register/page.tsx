"use client"

import { useState } from "react";
import { NuraButton } from "@/components/ui/button/button";
import { NuraTextInput } from "@/components/ui/input/text_input";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Register form data:", {
      fullName,
      username,
      email,
      password,
      whatsapp,
    });
  };

  return (
    <main className="min-h-screen w-full bg-white flex items-stretch">
      {/* Left image panel */}
      <section className="relative hidden md:flex w-1/2 items-center justify-center overflow-hidden">
        <img
          src="/background/RegisterBG.svg"
          alt="Register background"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="relative z-10 max-w-md px-10 text-white text-center">
          <h1 className="text-4xl font-semibold mb-4">New Here?</h1>
          <p className="text-base leading-relaxed">
            Enter your personal information and start learning with us!
          </p>
        </div>
      </section>

      {/* Right form panel */}
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
            Create Your Account
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <NuraTextInput
                label="Full Name"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <NuraTextInput
                label="Username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <NuraTextInput
                label="Email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <div>
              <NuraTextInput
                label="WhatsApp"
                placeholder="WhatsApp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-center">
              <NuraButton
                label="Create Account"
                type="submit"
                className="w-full rounded-full bg-black text-white py-2 text-sm font-medium hover:bg-gray-900 transition-colors"
              />
            </div>

            <p className="text-center text-xs text-gray-500 mt-4">
              Already have an account?{" "}
              <a href="/login" className="underline">
                Login
              </a>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}