import { useEffect, useState } from "react";
import { useAgent } from "@/hooks/use-agent";
import { usePlaygroundState } from "@/hooks/use-playground-state";
import { useConnection } from "@/hooks/use-connection";
import { AlertCircle } from "lucide-react";
import { PersonaIdReport } from "@/components/persona-id-report";
import { Big5Report } from "@/components/big-5-report";

export function TranscriptAnalysis() {
  const { displayTranscriptions } = useAgent();
  const { pgState, helpers } = usePlaygroundState();
  const [transcript, setTranscript] = useState<string>("");
  const [assessment, setAssessment] = useState<any>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [softError, setSoftError] = useState<string | null>(null);
  const [callEnded, setCallEnded] = useState(false);
  const [lastWordThreshold, setLastWordThreshold] = useState<number>(0);

  const { disconnect } = useConnection();
  const selectedPreset = helpers.getSelectedPreset(pgState);
  const instructions = pgState.instructions;

  // Helper: count words
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  // Helper: build transcript
  const buildTranscript = (transcriptions: any[]) => {
    return transcriptions
      .filter(({ segment, participant }: any) => segment.text.trim() !== "")
      .map(({ segment, participant }: any) => {
        const speaker = !participant.isAgent ? "The Candidate said" : "The Interviewer asked";
        return `${speaker}: "${segment.text.trim()}"\n`;
      })
      .join(" ")
  };

  // Populate transcript + manage call end
  useEffect(() => {
    if (displayTranscriptions.length > 0) {
      const structuredTranscript = buildTranscript(displayTranscriptions);
      setTranscript(structuredTranscript);

      const totalWordCount = countWords(structuredTranscript);
      setWordCount(totalWordCount);
    }

    // If the agent said "goodbye," end call
    const agentSaidGoodbye = displayTranscriptions.some(
      ({ segment, participant }: any) =>
        participant.isAgent && segment.text.toLowerCase().includes("goodbye")
    );

    if (agentSaidGoodbye) {
      setTimeout(() => {
        setCallEnded(true);
        disconnect();
      }, 1000);
    }
  }, [displayTranscriptions, disconnect]);

  // Decide which endpoint to call
  const endpoint = selectedPreset?.id === "big5" ? "/api/big5" : "/api/persona-id";

  // Trigger analysis at word threshold
  useEffect(() => {
    if (wordCount >= 30 && wordCount - lastWordThreshold >= 10) {
      fetchResults(transcript, instructions);
      setLastWordThreshold(wordCount);
    }
  }, [wordCount]);

  // Fetch data from appropriate endpoint
  const fetchResults = async (transcript: string, instructions: string) => {
    console.log("Sending transcript and instructions to: ", endpoint, {
      transcript,
      instructions,
    });

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript, instructions }),
      });

      const data = await response.json();
      if (!data) {
        setSoftError("Incomplete data received from the analysis API.");
        return;
      }

      setAssessment(data);
      setSoftError(null);
    } catch (err) {
      console.error("Error fetching assessment results: ", err);
      setSoftError("An error occurred while fetching analysis. Retrying...");
      setError("Error fetching assessment results");
    }
  };

    // // Return early if preset is not recognized
  if (selectedPreset?.id !== "persona-id" && selectedPreset?.id !== "big5") {
    return (
      <div>
        <h3>Realtime Report is not available for this preset. Coming soon!</h3>
      </div>
    );
  }

  // Render
  return (
    <div className="p-4 overflow-scroll">
      <h2 className="text-xl font-semibold mb-4">Realtime Report</h2>

      {callEnded && (
        <div className="alert alert-warning flex items-center mb-4">
          <AlertCircle className="mr-2" />
          <span>Yikes, They ended the call... 😬💀</span>
        </div>
      )}
      {softError && <div className="text-yellow-600">{softError}</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Conditionally render based on the preset */}
      {assessment && selectedPreset?.id === "persona-id" && (
        <PersonaIdReport assessment={assessment} />
      )}

      {assessment && selectedPreset?.id === "big5" && (
        <Big5Report assessment={assessment} />
      )}

      {wordCount < 20 && (
        <div>Keep talking to generate a detailed analysis...</div>
      )}
    </div>
  );
}