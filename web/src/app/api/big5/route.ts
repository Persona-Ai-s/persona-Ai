import { OpenAI } from "openai";


export async function POST(request: Request) {
  const { transcript, instructions }: { transcript: string; instructions: string } = await request.json();
  const openaiAPIKey = process.env.OPENAI_API_KEY;

  if (!openaiAPIKey) {
    throw new Error("OPENAI_API_KEY must be set");
  }

  // Initialize OpenAI client
  const openai = new OpenAI();

// Create the prompt for assessing the interview based on the candidate's CV walkthrough
const prompt = `
  You are tasked with analyzing a transcript in which an individual completes a Big Five (OCEAN) personality test. Focus solely on evaluating the candidate’s responses with respect to the five major personality dimensions—Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism—as well as notable combinations of these traits. Use the transcript below and the provided instructions to generate a detailed JSON report.

  The transcript is a conversation between an interviewer and a candidate. where the interviewer is saying statements and the candidate is answering below the statement.

  **Transcript**:
  ${transcript}

  **Assessment Criteria**:
  Please produce a JSON report that includes:

  - **Openness**:
    - "score": a rating out of 10
    - "evidence": use a direct quote from the transcript
    - "meaning": a concise explanation of how this trait may influence real-life behavior or decisions

  - **Conscientiousness**:
    - "score": a rating out of 10
    - "evidence": use a direct quote from the transcript
    - "meaning": a brief statement on how high or low conscientiousness might manifest in practical settings

  - **Extraversion**:
    - "score": a rating out of 10
    - "evidence": use a direct quote from the transcript
    - "meaning": a short explanation of what this level of extraversion could imply day to day

  - **Agreeableness**:
    - "score": a rating out of 10
    - "evidence": use a direct quote from the transcript
    - "meaning": a short explanation of what this level of agreeableness could imply day to day

  - **Neuroticism**:
    - "score": a rating out of 10
    - "evidence": use a direct quote from the transcript
    - "meaning": a short explanation of what this level of neuroticism could imply day to day

  - **combinations**: 
    Provide an array of objects, each describing notable pairings or interactions between two (or more) of the Big Five traits as observed in the transcript. For each combination:
      - "title": a descriptive label (e.g., "Openness and Conscientiousness")
      - "explanation": a brief discussion of how these traits might interact to influence the individual’s behavior, strengths, or challenges

  **Return the report in the following JSON format**:
  {
    "Openness": {
      "score": "score out of 10",
      "evidence": "direct quote(s) from the transcript",
      "meaning": "real-life implication(s) of this trait level"
    },
    "Conscientiousness": {
      "score": "score out of 10",
      "evidence": "direct quote(s) from the transcript",
      "meaning": "real-life implication(s) of this trait level"
    },
    "Extraversion": {
      "score": "score out of 10",
      "evidence": "direct quote(s) from the transcript",
      "meaning": "real-life implication(s) of this trait level"
    },
    "Agreeableness": {
      "score": "score out of 10",
      "evidence": "direct quote(s) from the transcript",
      "meaning": "real-life implication(s) of this trait level"
    },
    "Neuroticism": {
      "score": "score out of 10",
      "evidence": "direct quote(s) from the transcript",
      "meaning": "real-life implication(s) of this trait level"
    },
    "combinations": [
      {
        "title": "Combination Title",
        "explanation": "Short analysis of how these traits combine and potentially impact the individual's behavior"
      }
      // ... additional combination objects
    ]
  }

  Please ensure your response is strictly in the JSON format specified above.
`;

  console.log("transcript", transcript);
  // console.log("instructions", instructions);

  try {
    // Call OpenAI API with the generated prompt
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        { role: "system", content: "Provide a detailed assessment of the conversation." },
      ],
      // max_tokens: 2000, // Adjust token limit if needed
      temperature: 0.2,
    });

    const assessment = completion.choices[0].message.content?.trim();
    console.log("assessment", assessment);

    let response;
    try {
      response = assessment && JSON.parse(assessment);
    } catch (error) {
      console.error("Error during OpenAI API call", error);
      response = {
        error: "Failed to parse JSON response from OpenAI API",
        raw_response: assessment,
      };
    }

    // Return the JSON report as a response
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("Error during OpenAI API call", error);
    return new Response(JSON.stringify({ error: "Failed to generate report" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}