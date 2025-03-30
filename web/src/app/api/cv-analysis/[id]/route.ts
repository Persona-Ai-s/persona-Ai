import { OpenAI } from "openai";
import { minioClient, BUCKET_NAME } from "@/lib/minio";
import { CV_ANALYSIS_PROMPT, CV_ANALYSIS_SCHEMA } from "@/lib/cv-analysis-schema";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Add .pdf extension to the ID if it's not present
    const fileId = params.id.endsWith('.pdf') ? params.id : `${params.id}.pdf`;
    
    // Get the file data from Minio
    let fileData: Buffer;
    try {
      const dataStream = await minioClient.getObject(BUCKET_NAME, fileId);
      
      // Convert stream to buffer
      const chunks: Buffer[] = [];
      for await (const chunk of dataStream) {
        chunks.push(chunk);
      }
      fileData = Buffer.concat(chunks);
    } catch (error) {
      console.error("Error fetching file from Minio:", error);
      return new Response(JSON.stringify({ 
        error: "CV not found",
        details: error instanceof Error ? error.message : "Unknown error"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get a temporary URL for the PDF viewer
    const fileUrl = await minioClient.presignedGetObject(BUCKET_NAME, fileId, 24 * 60 * 60);

    // Convert to base64 for OpenAI
    const base64Pdf = `data:application/pdf;base64,${fileData.toString('base64')}`;

    // Initialize OpenAI
    const openai = new OpenAI();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: CV_ANALYSIS_PROMPT
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this CV and provide a detailed assessment in the specified JSON format."
            },
            {
              type: "file",
              file: {
                file_data: base64Pdf,
                filename: fileId
              }
            }
          ]
        }
      ],
      temperature: 0.2,
      response_format: CV_ANALYSIS_SCHEMA
    });

    const assessment = completion.choices[0].message.content?.trim();
    let response;
    try {
      response = assessment && JSON.parse(assessment);
      response.fileUrl = fileUrl;
    } catch (error) {
      console.error("Error parsing JSON response from OpenAI API", error);
      response = {
        error: "Failed to parse JSON response from OpenAI API",
        raw_response: assessment,
      };
    }

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error analyzing CV:", error);
    return new Response(
      JSON.stringify({ error: "Failed to analyze CV" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
} 