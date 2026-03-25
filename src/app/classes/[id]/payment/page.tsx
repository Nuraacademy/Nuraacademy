"use client"

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { getClassDetails } from "@/app/actions/classes";
import { handleEnrollment } from "@/app/actions/enrollment";
import { hasPermission } from "@/lib/rbac";
import { NuraButton } from "@/components/ui/button/button";
import Link from "next/link";
import { toast } from "sonner";

interface PaymentPageProps {
    params: Promise<{ id: string }>;
}

export default function PaymentPage({ params }: PaymentPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { id } = use(params);

    const [classData, setClassData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        getClassDetails(parseInt(id)).then(async result => {
            const canPay = await hasPermission("Enrollment", "PAYMENT_GATEWAY");
            if (!canPay) {
                toast.error("You do not have permission to access the payment gateway.");
                router.replace(`/classes/${id}/overview`);
                return;
            }

            if (result.success && result.class) {
                setClassData(result.class);
            }
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        });
    }, [id]);

    const handlePay = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            const profession = searchParams.get("profession");
            const yoe = searchParams.get("yoe");
            const workField = searchParams.get("workField");
            const educationField = searchParams.get("educationField");
            const jobIndustry = searchParams.get("jobIndustry");
            const finalExpectations = searchParams.get("finalExpectations");
            const cvUrl = searchParams.get("cvUrl");
            const objectivesStr = searchParams.get("objectives");
            const selectedObjectives = objectivesStr ? JSON.parse(objectivesStr) : [];

            const result = await handleEnrollment(parseInt(id), {
                profession,
                yoe,
                workField,
                educationField,
                jobIndustry,
                finalExpectations,
                selectedObjectives,
                cvUrl,
            });

            if (result.success) {
                router.push(`/classes/${id}/overview?enrolled=true`);
            } else {
                setError(result.error || "Failed to complete enrollment");
                setIsSubmitting(false);
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-4 border-[#D9F55C] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!classData) {
        return <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">Class not found</div>;
    }

    const imageUrl = classData.imgUrl || "https://www.lackawanna.edu/wp-content/uploads/2024/08/male-tutor-teaching-university-students-in-classro-2023-11-27-05-16-59-utc.webp";

    return (
        <main className="min-h-screen bg-white  text-gray-800 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#A8BDB8] opacity-60 rounded-full blur-[100px] pointer-events-none -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D9F55C] opacity-40 rounded-full blur-[100px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 relative z-10">
                {/* Breadcrumb */}
                <div className="mb-8 font-medium">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/classes" },
                            { label: classData.title, href: `/classes/${id}/overview` },
                            { label: "Payment Class", href: `/classes/${id}/payment` },
                        ]}
                    />
                </div>

                {/* Page Title */}
                <h1 className="text-2xl font-medium mb-8">Payment Information</h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
                        {error}
                    </div>
                )}

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* My Item Card - Left Column */}
                    <div className="lg:col-span-8 bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-56 h-40 shrink-0 rounded-2xl overflow-hidden">
                            <img
                                src={imageUrl}
                                alt={classData.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-grow">
                            <h2 className="text-md font-semibold text-gray-400 mb-2 whitespace-nowrap">My Item</h2>
                            <h3 className="text-xl font-medium mb-6">{classData.title}</h3>

                            <div className="grid grid-cols-2 gap-8 text-sm">
                                <div className="flex flex-col gap-2">
                                    <p className="font-semibold text-gray-900">Methods</p>
                                    <p className="text-gray-700">{classData.methods || "Flipped blended classroom"}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="font-semibold text-gray-900">Schedules</p>
                                    <p className="text-gray-700">
                                        {classData.startDate ? new Date(classData.startDate).toLocaleDateString("id-ID") : "TBA"} - {classData.endDate ? new Date(classData.endDate).toLocaleDateString("id-ID") : "TBA"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Price Detail Card - Right Column */}
                    <div className="lg:col-span-4 bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100">
                        <h2 className="text-xl font-medium mb-6">Price Detail</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-700 font-medium">Original Price</span>
                                <span className="text-gray-900 font-medium">Rp0,00</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-700 font-medium">Discount</span>
                                <span className="text-gray-900 font-medium text-right">Rp0,00</span>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                                <span className="text-gray-700 font-medium">Total</span>
                                <span className="text-gray-900 font-medium">Rp0,00</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-12 flex justify-end items-center gap-10">
                    <button onClick={() => router.back()} className="text-gray-900 font-medium hover:underline">
                        Back
                    </button>
                    <NuraButton
                        label={isSubmitting ? "Processing..." : "Pay"}
                        variant="primary"
                        className="w-40 bg-[#D9F55C] hover:bg-[#c8e44a] text-black font-medium h-12 rounded-[1rem]"
                        onClick={handlePay}
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                    />
                </div>
            </div>
        </main>
    );
}
