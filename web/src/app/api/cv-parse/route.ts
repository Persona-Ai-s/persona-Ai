import { OpenAI } from "openai";
import { minioClient, BUCKET_NAME, initializeBucket } from "@/lib/minio";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;
    
    if (!pdfFile) {
      return new Response(JSON.stringify({ error: "No PDF file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Initialize Minio bucket
    await initializeBucket();

    // Convert File to Buffer for Minio
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const fileExtension = pdfFile.name.split('.').pop();
    const fileId = `${randomUUID()}.${fileExtension}`;

    // Upload to Minio
    await minioClient.putObject(BUCKET_NAME, fileId, buffer, {
      'Content-Type': 'application/pdf',
      'original-name': pdfFile.name,
    });

    // Get the file URL (for future reference)
    const fileUrl = await minioClient.presignedGetObject(BUCKET_NAME, fileId, 24 * 60 * 60);

    return new Response(JSON.stringify({ 
      fileId,
      fileUrl,
      message: "File uploaded successfully" 
    }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error uploading file:", error);
    return new Response(
      JSON.stringify({ error: "Failed to upload file" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
