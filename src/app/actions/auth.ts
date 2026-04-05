"use server"

import { loginUser, registerUser } from "@/controllers/userController";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";

const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

const loginAttempts = new Map<string, { count: number, lockUntil: number }>();

export async function handleLogin(formData: FormData) {
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    if (!identifier || !password) {
        return { success: false, error: "Please provide both identifier and password" };
    }

    const now = Date.now();
    const attempt = loginAttempts.get(identifier);

    if (attempt && attempt.lockUntil > now) {
        return { success: false, error: "Account locked. Try again in 15 mins." };
    }

    try {
        const user = await loginUser(identifier, password);

        // Reset attempts on successful login
        loginAttempts.delete(identifier);

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

        return { success: true, role: user.role?.name || 'Learner' };
    } catch (error: any) {
        // Record failed attempt
        const count = (attempt?.count || 0) + 1;
        if (count >= 5) {
            loginAttempts.set(identifier, { count, lockUntil: now + 15 * 60 * 1000 });
            return { success: false, error: "Account locked. Try again in 15 mins." };
        } else {
            loginAttempts.set(identifier, { count, lockUntil: 0 });
        }

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { success: false, error: "Invalid email format" };
    }

    if (password.length < 8) {
        return { success: false, error: "Password must be at least 8 characters long" };
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

export async function handleGoogleLogin(idToken: string) {
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return { success: false, error: "Invalid Google token" };
        }

        const email = payload.email;
        let user = await prisma.user.findUnique({ 
            where: { email },
            include: { role: true }
        }) as any;

        if (!user) {
            const baseUsername = payload.name ? payload.name.replace(/\s+/g, '').toLowerCase() : email.split('@')[0];
            const randomSuffix = Math.floor(Math.random() * 10000).toString();
            const username = `${baseUsername}${randomSuffix}`;
            const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
            
            // Hash the random password properly.
            const hashedPassword = bcrypt.hashSync(randomPassword, 10);

            const defaultRole = await prisma.role.findUnique({ where: { name: 'Learner' } });

            user = await prisma.user.create({
                data: {
                    email,
                    username,
                    name: payload.name || "Google User",
                    password: hashedPassword,
                    roleId: defaultRole?.id || null,
                },
                include: { role: true }
            });
        }

        const cookieStore = await cookies();
        cookieStore.set("user_id", user.id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        return { success: true, role: user.role?.name || 'Learner' };
    } catch (error: any) {
        console.error("Google Auth Error:", error);
        return { success: false, error: error.message || "Failed to authenticate with Google" };
    }
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
