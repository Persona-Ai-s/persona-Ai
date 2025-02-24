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
  You are tasked with assessing a candidate’s interview where they walk through their CV. Focus solely on evaluating the candidate’s performance in terms of their technical expertise, communication abilities, soft skills, and overall presentation. Use the transcript below and the provided instructions to generate a detailed JSON report.
  You should ask for their experience in at least 3 different roles (if the have any).
  Once you the candidate has exhausted his experience on his CV You should ask for open ended questions. 
  **Transcript**: 
  ${transcript}

  **Assessment Criteria**:
  Please provide a JSON report that evaluates the following aspects:

  - **Technical Skills**:
    List all technical skills & Qualifications mentioned by the candidate. For each skill, provide a score out of 10 along with evidence from the transcript. Include an overall evidence field summarizing the candidate's technical proficiency. high scores demostrate strong application of the skill.

  - **Communication**:
    Evaluate the candidate on the following sub-criteria, each rated out of 10 with supporting evidence:
    - Clarity
    - Confidence
    - Control
    - Certainty  
    Also include an overall aggregated rating with evidence.

  - **Soft Skills**:
    Evaluate the following soft skills, each with a rating out of 10 and evidence:
    - Teamwork
    - Leadership
    - Engagement
    - Initiative
    - Adaptability
    - Self-awareness (the candidate's ability to recognize strengths and weaknesses)

  - **Best Response**:
    Highlight the candidate’s best response from the interview. Include the response, an explanation of why it stands out, and evidence (transcript excerpts) to support your evaluation.

  - **Overall Summary**:
    Provide a brief overall assessment of the candidate, summarizing technical competencies, soft skills, and potential fit for the role, along with supporting evidence.

    When providing evidence in the JSON format, provide only direct quotes from the transcript from the candidate.

  **Return the report in the following JSON format**:
  {
    "technical_skills": {
      "skills": [
        {
          "name": "skill name",
          "score": "score out of 10",
          "evidence": "specific examples or projects mentioned demonstrating proficiency in this skill"
        }
        // ... additional skills
      ],
      "evidence": "Consolidated evidence from projects, examples, and case studies discussed during the interview"
    },
    "communication": {
      "clarity": {
        "score": "rating out of 10",
        "evidence": "Specific transcript excerpts where the candidate’s clarity was evident"
      },
      "confidence": {
        "score": "rating out of 10",
        "evidence": "Observations from tone, pace, and assertive language in the transcript"
      },
      "control": {
        "score": "rating out of 10",
        "evidence": "Instances where the candidate effectively redirected or refocused the conversation"
      },
      "certainty": {
        "score": "rating out of 10",
        "evidence": "Examples of definitive language or strong assertions within their responses"
      },
      "overall": {
        "score": "aggregated communication rating out of 10",
        "evidence": "A summary of the key communication moments drawn from the interview"
      }
    },
    "soft_skills": {
      "teamwork": {
        "score": "rating out of 10",
        "evidence": "Cited experiences or scenarios where teamwork was highlighted in the transcript"
      },
      "leadership": {
        "score": "rating out of 10",
        "evidence": "Specific examples from prior roles or projects demonstrating leadership"
      },
      "engagement": {
        "score": "rating out of 10",
        "evidence": "Notable moments of active engagement from the transcript"
      },
      "initiative": {
        "score": "rating out of 10",
        "evidence": "Instances where the candidate proposed new ideas or volunteered for extra responsibilities"
      },
      "adaptability": {
        "score": "rating out of 10",
        "evidence": "Examples of pivoting strategies or rapid learning mentioned in the interview"
      },
      "self_awareness": {
        "score": "rating out of 10",
        "evidence": "Direct quotes or transcript examples indicating self-awareness and reflective thinking"
      }
    },
    "interview_completeness": {
      "questions_answered": {
        "score": "rating out of 10",
        "evidence": "Evaluation of whether the candidate answered all or most of the expected questions"
      },
      "thoroughness": {
        "score": "rating out of 10",
        "evidence": "Assessment of the detail and depth provided in the candidate's responses"
      },
      "coverage": {
        "score": "rating out of 10",
        "evidence": "Analysis of how well the candidate covered the relevant topics during the interview"
      },
    }, 
    "best_response": {
      "response": "Highlighted candidate response",
      "explanation": "Why this response stood out (e.g., clarity, depth, relevance, demonstration of key skills)",
    },
    "overall_summary": {
      "summary": "A brief overall assessment of the candidate, summarizing technical competencies, soft skills, and potential fit for the role",
    }
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