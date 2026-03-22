import SidebarWrapper from "../sidebar_wrapper"
import Image from "next/image"
import AddClassClient from "./AddClassClient"
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb"

export default function AddClassPage() {
    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-white  pb-16">
            <SidebarWrapper />

            {/* Background Images */}
            <img
                src="/background/OvalBGLeft.svg"
                alt="Background"
                className="absolute h-[40rem] object-cover top-0 left-0"
            />
            <img
                src="/background/OvalBGRight.svg"
                alt="Background"
                className="absolute h-[40rem] object-cover bottom-0 right-0"
            />

            {/* Form */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-8">
                <Breadcrumb
                    items={[
                        { label: "Home", href: "/" },
                        { label: "Class", href: "/classes" },
                        { label: "Add Class", href: "/classes/add" },
                    ]}
                />
                <AddClassClient />
            </div>
        </main>
    )
}
