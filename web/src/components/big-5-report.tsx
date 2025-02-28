import { Dial } from "@/components/ui/dial";

interface Big5ReportProps {
  assessment: any;
}

export function Big5Report({ assessment }: Big5ReportProps) {
    if (!assessment || !assessment.Openness) {
        return <div>Loading...</div>;
    }   
  return (
    <div className="assessment-report p-6 space-y-8">
      <section>
        <h3 className="text-l pt-3 font-bold mb-4">Big Five Traits</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Openness */}
          <div className="relative" title={assessment.Openness.evidence}>
            <Dial
              value={assessment.Openness.score}
              label="Openness"
              tooltip={assessment.Openness.evidence}
              color="blue"
            />
            <p className="text-sm text-gray-600 mt-1">
              {assessment.Openness.meaning}
            </p>
          </div>

          {/* Conscientiousness */}
          <div className="relative" title={assessment.Conscientiousness.evidence}>
            <Dial
              value={assessment.Conscientiousness.score}
              label="Conscientiousness"
              tooltip={assessment.Conscientiousness.evidence}
              color="green"
            />
            <p className="text-sm text-gray-600 mt-1">
              {assessment.Conscientiousness.meaning}
            </p>
          </div>

          {/* Extraversion */}
          <div className="relative" title={assessment.Extraversion.evidence}>
            <Dial
              value={assessment.Extraversion.score}
              label="Extraversion"
              tooltip={assessment.Extraversion.evidence}
              color="purple"
            />
            <p className="text-sm text-gray-600 mt-1">
              {assessment.Extraversion.meaning}
            </p>
          </div>

          {/* Agreeableness */}
          <div className="relative" title={assessment.Agreeableness.evidence}>
            <Dial
              value={assessment.Agreeableness.score}
              label="Agreeableness"
              tooltip={assessment.Agreeableness.evidence}
              color="orange"
            />
            <p className="text-sm text-gray-600 mt-1">
              {assessment.Agreeableness.meaning}
            </p>
          </div>

          {/* Neuroticism */}
          <div className="relative" title={assessment.Neuroticism.evidence}>
            <Dial
              value={assessment.Neuroticism.score}
              label="Neuroticism"
              tooltip={assessment.Neuroticism.evidence}
              color="red"
            />
            <p className="text-sm text-gray-600 mt-1">
              {assessment.Neuroticism.meaning}
            </p>
          </div>
        </div>
      </section>

      {/* Trait Combinations */}
      {Array.isArray(assessment.combinations) && assessment.combinations.length > 0 && (
        <section>
          <h3 className="text-l pt-3 font-bold mb-4">Trait Combinations</h3>
          {assessment.combinations.map((combo: any, idx: number) => (
            <div key={idx} className="mb-3">
              <h4 className="font-semibold">{combo.title}</h4>
              <p className="text-sm text-gray-600">{combo.explanation}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}