"use client"

import { Search } from "lucide-react";
import { NuraTextInput } from "../ui/input/text_input";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function SearchInput({ defaultValue }: { defaultValue: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleSearch = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set("q", value);
        } else {
            params.delete("q");
        }

        startTransition(() => {
            router.push(`/classes?${params.toString()}`);
        });
    };

    return (
        <NuraTextInput
            placeholder="Search class"
            defaultValue={defaultValue}
            onChange={(e) => handleSearch(e.target.value)}
            icon={<Search strokeWidth={1.5} className={isPending ? "animate-pulse" : ""} />}
        />
    );
}
