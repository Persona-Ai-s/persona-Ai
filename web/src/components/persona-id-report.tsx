import { Dial } from "@/components/ui/dial";
import { Star } from "lucide-react";

interface PersonaIdReportProps {
  assessment: any;
}

export function PersonaIdReport({ assessment }: PersonaIdReportProps) {
  if (!assessment || !assessment.interview_completeness) {
    return <div>Loading...</div>;
  }
  return (
    <div className="assessment-report p-6 space-y-8">
      {/* Interview Completeness */}
      <section>
        <h3 className="text-l pt-3 font-bold mb-4">Interview Completeness</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(assessment.interview_completeness).map(([key, item]: any) => (
            <div key={key} className="relative" title={item.evidence}>
              <Dial
                value={item.score}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                tooltip={item.evidence}
                color="blue"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Technical Skills */}
      <section>
        <h3 className="text-l pt-3 font-bold mb-4">Technical Skills</h3>
        <p className="mt-1 text-sm pb-4 text-gray-600">
          {assessment.technical_skills.evidence}
        </p>
        <div className="grid grid-cols-3 gap-4">
          {assessment.technical_skills.skills.map((skill: any, index: number) => (
            <div key={index} className="relative" title={skill.evidence}>
              <Dial value={skill.score} label={skill.name} tooltip={skill.evidence} />
            </div>
          ))}
        </div>
      </section>

      {/* Communication */}
      <section>
        <h3 className="text-l pt-3 font-bold mb-4">Communication</h3>
        <p className="mt-1 text-sm text-gray-600 pb-4">
          {assessment.communication.overall.evidence}
        </p>
        <div className="grid grid-cols-3 gap-4">
          {/* Exclude the "overall" key to display individual sub-criteria */}
          {Object.entries(assessment.communication).map(([key, item]: any) => (
            key !== "overall" && (
              <div key={key} className="relative" title={item.evidence}>
                <Dial
                  value={item.score}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  tooltip={item.evidence}
                  color="green"
                />
              </div>
            )
          ))}
        </div>
      </section>

      {/* Soft Skills */}
      <section>
        <h3 className="text-l pt-3 font-bold mb-4">Soft Skills</h3>
        {/* Optional: if there's a separate 'evidence' field */}
        {assessment.soft_skills.evidence && (
          <p className="mt-1 text-sm pb-4 text-gray-600">
            {assessment.soft_skills.evidence}
          </p>
        )}
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(assessment.soft_skills).map(([key, item]: any) => (
            key !== "evidence" && (
              <div key={key} className="relative" title={item.evidence}>
                <Dial
                  value={item.score}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  tooltip={item.evidence}
                  color="purple"
                />
              </div>
            )
          ))}
        </div>
      </section>

      {/* Best Response */}
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

      {/* Overall Summary */}
      <section>
        <h3 className="text-l pt-3 font-bold mb-4">Overall Summary</h3>
        <p className="mt-1">{assessment.overall_summary.summary}</p>
      </section>
    </div>
  );
}