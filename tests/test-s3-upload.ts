import { uploadToSupabase } from "../src/lib/storage";

async function runTest() {
    console.log("--- Starting S3 Upload Test ---");
    
    // Create a dummy file
    const content = "Hello, this is a test upload to Supabase S3!";
    const blob = new Blob([content], { type: "text/plain" });
    // Simulate a File object in Bun
    const file = new File([blob], "test-upload.txt", { type: "text/plain" });

    console.log("Uploading file: test-upload.txt");
    const result = await uploadToSupabase(file, "feedback");

    if (result.success) {
        console.log("✅ TEST SUCCESSFUL!");
        console.log("Public URL:", result.url);
    } else {
        console.log("❌ TEST FAILED!");
        console.log("Error:", result.error);
    }
    
    console.log("--- End of Test ---");
}

runTest();
