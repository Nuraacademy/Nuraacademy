"use client";

import { useState } from "react";
import { NuraButton } from "@/components/ui/button/button";
import { NuraTextInput } from "@/components/ui/input/text_input";
import { useRouter } from "next/navigation";
import { handleRegister } from "@/app/actions/auth";
import { toast } from "sonner";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("whatsapp", whatsapp);

      const result = await handleRegister(formData);

      if (result.success) {
        toast.success("Account created successfully!");
        router.push("/classes");
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-white flex items-stretch">
      {/* Left image panel */}
      <section className="relative hidden md:flex w-1/2 items-center justify-center overflow-hidden">
        <Image
          src="/background/RegisterBG.svg"
          alt="Register background"
          fill
          priority
          className="object-cover"
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
            <Image
              src="/logo/logo_nura.png"
              alt="Nura Academy"
              width={120}
              height={40}
              className="h-10 cursor-pointer object-contain"
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
                disabled={isLoading}
              />
            </div>

            <div>
              <NuraTextInput
                label="Username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <NuraTextInput
                label="Email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <div>
              <NuraTextInput
                label="WhatsApp"
                placeholder="WhatsApp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-center">
              <NuraButton
                label="Create Account"
                type="submit"
                isLoading={isLoading}
                className="w-full rounded-full bg-black text-white py-2 text-sm font-medium hover:bg-gray-900 transition-colors"
              />
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="flex items-center justify-center">
              <NuraButton
                label="Register by SSO"
                type="button"
                variant="secondary"
                onClick={() => {
                  toast.success("Logged in via SSO");
                  router.push("/classes");
                }}
                className="w-full rounded-full py-2 text-sm font-medium"
              />
            </div>

            <p className="text-center text-xs text-gray-500 mt-4">
              Already have an account?{" "}
              <a href="/login" className="underline hover:decoration-2">
                Login
              </a>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}