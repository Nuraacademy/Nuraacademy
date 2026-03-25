import { getFullSession } from "@/app/actions/auth";
import { getUserById } from "@/controllers/userController";
import { notFound, redirect } from "next/navigation";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";

export default async function MyProfilePage() {
    const session = await getFullSession();

    if (!session) {
        redirect("/login");
    }

    const user = await getUserById(session.id);

    if (!user) {
        notFound();
    }

    const initials = (user.name || user.username)
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="min-h-screen bg-[#F9F9EE] px-4 md:px-16 py-8 md:py-12 space-y-8 ">
            <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-white/50 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#1C3A37] to-[#2D5A56] flex items-center justify-center text-white font-black text-4xl shadow-xl border-4 border-white">
                        {initials}
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-3xl md:text-4xl font-black text-[#1C3A37] font-merriweather">
                            {user.name || user.username}
                        </h1>
                        <p className="text-[#8BB730] font-medium text-lg uppercase tracking-wider">
                            {user.role?.name || 'Member'}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                            <span className="bg-[#F9F9EE] px-4 py-1.5 rounded-full text-xs font-medium text-[#1C3A37] border border-[#1C3A37]/5">
                                @{user.username}
                            </span>
                            <span className="bg-[#F9F9EE] px-4 py-1.5 rounded-full text-xs font-medium text-[#1C3A37] border border-[#1C3A37]/5">
                                {user.email}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-100 pt-12">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Contact Information</h2>
                            <div className="space-y-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-medium text-gray-400 uppercase">WhatsApp</span>
                                    <span className="text-sm font-medium text-[#1C3A37]">{user.whatsapp || '-'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-medium text-gray-400 uppercase">Email Address</span>
                                    <span className="text-sm font-medium text-[#1C3A37]">{user.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Account Details</h2>
                            <div className="space-y-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-medium text-gray-400 uppercase">Joined Since</span>
                                    <span className="text-sm font-medium text-[#1C3A37]">
                                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-medium text-gray-400 uppercase">Role Status</span>
                                    <span className="text-sm font-medium text-[#1C3A37] border-l-4 border-[#DAEE49] pl-3 py-1 bg-gray-50/50 rounded-r-lg">
                                        Active {user.role?.name || 'Member'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
