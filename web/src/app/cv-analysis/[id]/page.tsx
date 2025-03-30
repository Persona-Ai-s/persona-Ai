"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Dial } from "@/components/ui/dial";
import dynamic from 'next/dynamic';
import { useParams } from "next/navigation";

// Dynamically import FileViewer with no SSR
const FileViewer = dynamic(() => import('react-file-viewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[800px] bg-gray-100">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
    </div>
  )
});

export default function CVAnalysisById() {
  const params = useParams();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/cv-analysis/${params.id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch CV analysis");
        }

        const result = await response.json();
        if (!result.fileUrl) {
          throw new Error("No file URL provided");
        }
        setAnalysis(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAnalysis();
    }
  }, [params.id]);

  const onError = (error: Error) => {
    console.error('Error loading file:', error);
    setFileError(`Error loading file: ${error.message}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="flex h-12 items-center px-4 border-b bg-white">
        <Link 
          href="/cv-analysis"
          className="flex items-center text-sm font-semibold hover:opacity-70 transition-all duration-250"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to CV Analysis
        </Link>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column: File viewer */}
          {analysis?.fileUrl && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">CV Document</h2>
              <div className="border rounded-lg overflow-hidden">
                {fileError ? (
                  <div className="p-4 text-red-500">{fileError}</div>
                ) : (
                  <div style={{ height: '800px' }}>
                    <FileViewer
                      fileType="pdf"
                      filePath={analysis.fileUrl}
                      onError={onError}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right column: Analysis */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              {/* Demographic Estimates */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Profile Overview</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-600">Estimated Age Range</h3>
                    <p className="text-2xl font-bold">{analysis?.demographic_estimates?.estimated_age_range}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-600">Years of Experience</h3>
                    <p className="text-2xl font-bold">{analysis?.demographic_estimates?.total_experience_years}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-600">Career Stage</h3>
                    <p className="text-2xl font-bold">{analysis?.demographic_estimates?.career_stage}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-600">Industry Exposure</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {analysis?.demographic_estimates?.industry_exposure.map((industry: string) => (
                        <span key={industry} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Potential Indicators */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Future Potential</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {analysis?.potential_indicators && Object.entries(analysis.potential_indicators).map(([key, value]: [string, any]) => (
                    <div key={key} className="relative" title={value.evidence}>
                      <Dial
                        value={value.score}
                        label={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        tooltip={value.evidence}
                        color="indigo"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Technical Skills */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Technical Skills</h2>
                <p className="text-gray-600 mb-4">{analysis?.technical_skills?.overall_assessment}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysis?.technical_skills?.skills.map((skill: any, index: number) => (
                    <div key={index} className="relative" title={skill.evidence}>
                      <Dial
                        value={skill.score}
                        label={skill.name}
                        tooltip={skill.evidence}
                        color="blue"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Overall Profile */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Overall Assessment</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="relative" title="CV Presentation">
                    <Dial
                      value={analysis?.overall_profile?.cv_presentation_score}
                      label="CV Presentation"
                      tooltip="Quality of CV presentation and formatting"
                      color="blue"
                    />
                  </div>
                  <div className="relative" title="Technical Proficiency">
                    <Dial
                      value={analysis?.overall_profile?.technical_proficiency_score}
                      label="Technical Proficiency"
                      tooltip="Overall technical skill level"
                      color="purple"
                    />
                  </div>
                  <div className="relative" title="Experience Relevance">
                    <Dial
                      value={analysis?.overall_profile?.experience_relevance_score}
                      label="Experience Relevance"
                      tooltip="Relevance of experience to current market"
                      color="green"
                    />
                  </div>
                  <div className="relative" title="Career Progression">
                    <Dial
                      value={analysis?.overall_profile?.career_progression_score}
                      label="Career Progression"
                      tooltip="Career growth and advancement"
                      color="blue"
                    />
                  </div>
                </div>
                <p className="text-gray-600">{analysis?.overall_profile?.summary}</p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 