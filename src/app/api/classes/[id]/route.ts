import { NextResponse } from "next/server";
import { getClassDetails } from "@/controllers/classController";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const classDetails = await getClassDetails(id);
        if (!classDetails) {
            return NextResponse.json({ error: "Class not found" }, { status: 404 });
        }
        return NextResponse.json(classDetails);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
