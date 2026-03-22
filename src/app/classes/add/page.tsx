import SidebarWrapper from "../sidebar_wrapper"
import Image from "next/image"
import AddClassClient from "./AddClassClient"
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb"

export default function AddClassPage() {
    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-white  pb-16">
            <SidebarWrapper />

            {/* Background */}
            <Image
                src="/background/OvalBGLeft.svg"
                alt=""
                className="absolute top-0 left-0 z-10 w-auto h-[30rem] pointer-events-none opacity-60"
                width={500}
                height={500}
            />
            <Image
                src="/background/OvalBGRight.svg"
                alt=""
                className="absolute bottom-0 right-0 z-10 w-auto h-[30rem] pointer-events-none opacity-60"
                width={500}
                height={500}
            />

            {/* Form */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-8">
                <Breadcrumb
                    items={[
                        { label: "Home", href: "/classes" },
                        { label: "Class", href: "/classes" },
                        { label: "Add Class", href: "/classes/add" },
                    ]}
                />
                <AddClassClient />
            </div>
        </main>
    )
}
