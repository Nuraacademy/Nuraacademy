"use server"

import { loginUser, registerUser } from "@/controllers/userController";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function handleLogin(formData: FormData) {
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    if (!identifier || !password) {
        return { success: false, error: "Please provide both identifier and password" };
    }

    try {
        const user = await loginUser(identifier, password);

        // Simple session implementation using cookies
        // In a production app, use a proper session token/JWT
        const cookieStore = await cookies();
        cookieStore.set("user_id", user.id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to login" };
    }
}

export async function handleRegister(formData: FormData) {
    const fullName = formData.get("fullName") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const whatsapp = formData.get("whatsapp") as string;

    if (!fullName || !username || !email || !password) {
        return { success: false, error: "Please fill in all required fields" };
    }

    try {
        const user = await registerUser({
            fullName,
            username,
            email,
            password,
            whatsapp: whatsapp || "",
        });

        const cookieStore = await cookies();
        cookieStore.set("user_id", user.id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        return { success: true };
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, error: "Email or Username already exists" };
        }
        return { success: false, error: error.message || "Failed to register" };
    }
}

export async function handleLogout() {
    const cookieStore = await cookies();
    cookieStore.delete("user_id");
    redirect("/login");
}

export async function getSession() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;
    return userId ? parseInt(userId) : null;
}

export async function getFullSession() {
    const userId = await getSession();
    if (!userId) return null;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true }
    });

    if (!user) return null;

    return {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role?.name || 'Member'
    };
}
