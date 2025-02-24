import { useEffect, useState } from "react";
import { useAgent } from "@/hooks/use-agent";
import { usePlaygroundState } from "@/hooks/use-playground-state";
import { useConnection } from "@/hooks/use-connection";
import { AlertCircle, Star } from "lucide-react";
import { Dial } from "@/components/ui/dial";

const testAssessment = {
  "technical_skills": {
    "skills": [
      {
        "name": "Web Development",
        "score": 4,
        "evidence": "The candidate mentioned building multiple web applications and websites, indicating hands-on experience."
      },
      {
        "name": "React",
        "score": 4,
        "evidence": "The candidate specifically noted using React in their web applications."
      },
      {
        "name": "Node.js",
        "score": 4,
        "evidence": "The candidate highlighted their use of Node.js in application development."
      },
      {
        "name": "Express",
        "score": 4,
        "evidence": "The candidate included Express as part of their technology stack."
      },
      {
        "name": "SQL",
        "score": 3,
        "evidence": "The candidate mentioned SQL, suggesting familiarity but with less emphasis on expertise."
      },
      {
        "name": "AWS",
        "score": 4,
        "evidence": "The candidate indicated deploying applications on AWS, showcasing cloud experience."
      },
      {
        "name": "Railway",
        "score": 3,
        "evidence": "The candidate mentioned using Railway occasionally, suggesting some level of experience."
      }
    ],
    "evidence": "The candidate demonstrated a solid technical foundation, particularly in web application development using various frameworks and cloud services."
  },
  "communication": {
    "clarity": {
      "score": 3,
      "evidence": "The candidate's responses were at times straightforward but lacked detail, especially during follow-up questions."
    },
    "confidence": {
      "score": 3,
      "evidence": "The candidate displayed uncertainty at points, particularly when prompted about primary responsibilities."
    },
    "control": {
      "score": 2,
      "evidence": "The candidate struggled to maintain control of the conversation and often needed prompting."
    },
    "certainty": {
      "score": 3,
      "evidence": "While some responses were definitive, there were also moments of hesitation that affected the overall certainty."
    },
    "overall": {
      "score": 2.75,
      "evidence": "The candidate showed moments of clarity and confidence but also struggled with maintaining control and certainty in their responses."
    }
  },
  "soft_skills": {
    "teamwork": {
      "score": 2,
      "evidence": "There was a lack of specific examples related to teamwork in the provided transcript."
    },
    "leadership": {
      "score": 3,
      "evidence": "The candidate's role as CTO implies leadership, but specific examples of leadership actions were not discussed."
    },
    "engagement": {
      "score": 2,
      "evidence": "The candidate seemed somewhat disengaged when responding to the interviewer, particularly when discussing responsibilities."
    },
    "initiative": {
      "score": 2,
      "evidence": "The candidate did not provide examples of taking initiative or suggesting new ideas."
    },
    "adaptability": {
      "score": 3,
      "evidence": "The experience with both code and no-code solutions suggests some adaptability."
    },
    "self_awareness": {
      "score": 2,
      "evidence": "The candidate did not demonstrate strong self-awareness or reflection on personal strengths and weaknesses."
    }
  },
  "interview_completeness": {
    "questions_answered": {
      "score": 3,
      "evidence": "Evaluation of whether the candidate answered all or most of the expected questions"
    },
    "thoroughness": {
      "score": 3,
      "evidence": "Assessment of the detail and depth provided in the candidate's responses"
    },
    "coverage": {
      "score": 3,
      "evidence": "Analysis of how well the candidate covered the relevant topics during the interview"
    },
  },
  "best_response": {
    "response": "As CTO of Voltaire Labs, I've built multiple web applications, websites in code and no code.",
    "explanation": "This response stood out due to its directness and relevance, showcasing the candidate's technical expertise and experience in a leadership role.",
    "evidence": "The candidate's mention of diverse web applications indicates a broad skill set and adaptability in technology use."
  },
  "overall_summary": {
    "summary": "The candidate has a solid technical foundation in web development and experience with various technologies, particularly as a CTO. However, their communication skills, including clarity and control, require improvement. Soft skills such as teamwork and engagement were underrepresented, suggesting a potential gap in collaborative experiences.",
    "evidence": "The candidate's technical skills were evident, but their communication challenges and lack of detailed soft skill examples indicate areas for development before fitting seamlessly in a collaborative, leadership role."
  }
}

export function TranscriptAnalysis() {
  const { displayTranscriptions } = useAgent();
  const { pgState, dispatch, helpers } = usePlaygroundState(); // Access playground state
  const [transcript, setTranscript] = useState<string>("");
  const [assessment, setAssessment] = useState<any>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [lastWordThreshold, setLastWordThreshold] = useState<number>(0);
  const [softError, setSoftError] = useState<string | null>(null); // Handle soft errors
  const { disconnect } = useConnection();
  const [callEnded, setCallEnded] = useState(false); // State to manage call end alert

  const selectedPreset = helpers.getSelectedPreset(pgState);

  const instructions = pgState.instructions; // Fetch instructions from the playground state

  // Count the number of words in a given text
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  // Build the structured transcript showing who said what
  const buildTranscript = (transcriptions: any[]) => {
    return transcriptions
      .map(({ segment, participant }: any) => {
        const speaker = !participant.isAgent ? "The Candidate said" : "The Interviewer said";
        return `${speaker}: "${segment.text.trim()}"\n`;
      })
      .join(" ");
  };

  // Fetch transcript data and update word count
  useEffect(() => {
    if (displayTranscriptions.length > 0) {
      const structuredTranscript = buildTranscript(displayTranscriptions);
      setTranscript(structuredTranscript);

      const totalWordCount = countWords(structuredTranscript);
      setWordCount(totalWordCount);
    }
    // Check if the agent said "goodbye"
    const agentSaidGoodbye = displayTranscriptions.some(
      ({ segment, participant }: any) => participant.isAgent && segment.text.toLowerCase().includes("goodbye")
    );

    if (agentSaidGoodbye) {
      setTimeout(() => {
        setCallEnded(true); // Set call ended state to true
        disconnect(); // Call the disconnect hook
      }, 1000); // 5-second delay
    }
  }, [displayTranscriptions]);

  // Trigger analysis based on word thresholds
  useEffect(() => {
    if (wordCount >= 20 && wordCount - lastWordThreshold >= 10) {
      fetchResults(transcript, instructions); // Pass instructions to the API call
      setLastWordThreshold(wordCount); // Update the threshold after each analysis
    }
  }, [wordCount]);

  const fetchResults = async (transcript: string, instructions: string) => {
    console.log("Sending transcript and instructions to /results: ", { transcript, instructions });

    try {
      const response = await fetch("/api/cv-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript, instructions }), // Include instructions in the API call
      });

      // const response = testAssessment;

      // console.log("API Response Status: ", response.status);

      const data = await response.json();
      // const data = response;
      // Handle incomplete JSON response gracefully
      if (!data || !data.overall_summary) {
        setSoftError("Incomplete data received from the analysis API.");
        return; // Don't update the assessment if it's incomplete
      }

      // if (data.prospect_said_goodbye) {
      //   setTimeout(() => {
      //     setCallEnded(true); // Set call ended state to true
      //     disconnect(); // Call the disconnect hook if end_the_call is true
      //   }, 1000); // 5-second delay
      // }

      console.log("Assessment Data: ", data);
      setAssessment(data);
      setSoftError(null); // Reset the soft error if data is good
    } catch (err) {
      console.error("Error fetching assessment results: ", err);
      setSoftError("An error occurred while fetching analysis. Retrying...");
      setError("Error fetching assessment results");
    }
  };

  return (
    <div className="p-4 overflow-scroll">
      <h2 className="text-xl font-semibold mb-4">Realtime Report</h2>

      {callEnded && (
        <div className="alert alert-warning flex items-center mb-4">
          <AlertCircle className="mr-2" />
          <span>Yikes, They ended the call... 😬💀</span>
        </div>
      )}

      {softError && <div className="text-yellow-600">{softError}</div>} {/* Soft error */}

      {error && <div className="text-red-500">{error}</div>}

      {assessment && (
      <div className="assessment-report p-6 space-y-8">

        {/* Interview Completeness   */}
        <section>
          <h3 className="text-l pt-3 font-bold mb-4">Interview Completeness</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(assessment.interview_completeness).map(([key, item]: any) => (
              <div key={key} className="relative" title={item.evidence}>
                <Dial value={item.score} label={key.charAt(0).toUpperCase() + key.slice(1)} tooltip={item.evidence} color="blue" />
              </div>
            ))}
          </div>
        </section>
      
      {/* Technical Skills Section */}
      <section>
        <h3 className="text-l pt-3 font-bold mb-4">Technical Skills</h3>
        <p className="mt-1 text-sm pb-4 text-gray-600">{assessment.technical_skills.evidence}</p>
        <div className="grid grid-cols-3 gap-4">
          {assessment.technical_skills.skills.map((skill, index) => (
            <div key={index} className="relative" title={skill.evidence}>
              <Dial value={skill.score} label={skill.name} tooltip={skill.evidence} />
            </div>
          ))}
        </div>
      </section>
      
      {/* Communication Section */}
      <section>
        <h3 className="text-l pt-3 font-bold mb-4">Communication</h3>
        <p className="mt-1 text-sm text-gray-600 pb-4">{assessment.communication.overall.evidence}</p>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(assessment.communication).map(([key, item]) => (
            <div key={key} className="relative" title={item.evidence}>
              <Dial value={item.score} label={key.charAt(0).toUpperCase() + key.slice(1)} tooltip={item.evidence} color="green" />
            </div>
          ))}
        </div>
      </section>
      
      {/* Soft Skills Section */}
      <section>
        <h3 className="text-l pt-3 font-bold mb-4">Soft Skills</h3>
        <p className="mt-1 text-sm pb-4 text-gray-600">{assessment.soft_skills.evidence}</p>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(assessment.soft_skills).map(([key, item]) => (
            <div key={key} className="relative" title={item.evidence}>
              <Dial value={item.score} label={key.charAt(0).toUpperCase() + key.slice(1)} tooltip={item.evidence} color="purple" />
            </div>
          ))}
        </div>
      </section>
      
      {/* Best Response Section */}
      <section>
        <h3 className="text-l pt-3 font-bold mb-4 flex items-center">
          <Star className="text-yellow-500 mr-2" />
          Best Response
        </h3>
        <div className="mb-4 border p-4 rounded">
          <p className="font-bold">Response:</p>
          <p className="mt-1">{assessment.best_response.response}</p>
          <p className="font-bold mt-2">Explanation:</p>
          <p className="mt-1">{assessment.best_response.explanation}</p>
        </div>
      </section>
      
      {/* Overall Summary Section */}
      <section>
        <h3 className="text-l pt-3 font-bold mb-4">Overall Summary</h3>
          <p className="mt-1">{assessment.overall_summary.summary}</p>
        </section>
      </div>
      )}
      {/* {!assessment && !error && <div>Loading assessment...</div>} */}
      {wordCount < 20 && <div>Keep talking to generate a detailed analysis...</div>}
    </div>
  );
}