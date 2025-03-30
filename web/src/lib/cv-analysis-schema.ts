export const CV_ANALYSIS_PROMPT = `You are an expert CV analyzer. Analyze the CV and provide detailed insights about the candidate's profile, including technical skills, experience, potential, and demographic estimates. Be objective and evidence-based in your assessment.`;

export const CV_ANALYSIS_SCHEMA = {
  type: "json_schema",
  json_schema: {
    name: "cv_analysis",
    strict: true,
    schema: {
      type: "object",
      properties: {
        technical_skills: {
          type: "object",
          properties: {
            overall_assessment: { type: "string" },
            skills: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  score: { type: "number" },
                  evidence: { type: "string" }
                },
                required: ["name", "score", "evidence"],
                additionalProperties: false
              }
            }
          },
          required: ["overall_assessment", "skills"],
          additionalProperties: false
        },
        professional_experience: {
          type: "object",
          properties: {
            summary: { type: "string" },
            key_achievements: { type: "array", items: { type: "string" } }
          },
          required: ["summary", "key_achievements"],
          additionalProperties: false
        },
        demographic_estimates: {
          type: "object",
          properties: {
            estimated_age_range: { type: "string" },
            total_experience_years: { type: "number" },
            career_stage: { type: "string" },
            industry_exposure: { type: "array", items: { type: "string" } }
          },
          required: ["estimated_age_range", "total_experience_years", "career_stage", "industry_exposure"],
          additionalProperties: false
        },
        potential_indicators: {
          type: "object",
          properties: {
            leadership_potential: {
              type: "object",
              properties: {
                score: { type: "number" },
                evidence: { type: "string" }
              },
              required: ["score", "evidence"],
              additionalProperties: false
            },
            technical_growth_potential: {
              type: "object",
              properties: {
                score: { type: "number" },
                evidence: { type: "string" }
              },
              required: ["score", "evidence"],
              additionalProperties: false
            },
            entrepreneurial_potential: {
              type: "object",
              properties: {
                score: { type: "number" },
                evidence: { type: "string" }
              },
              required: ["score", "evidence"],
              additionalProperties: false
            }
          },
          required: ["leadership_potential", "technical_growth_potential", "entrepreneurial_potential"],
          additionalProperties: false
        },
        overall_profile: {
          type: "object",
          properties: {
            cv_presentation_score: { type: "number" },
            technical_proficiency_score: { type: "number" },
            experience_relevance_score: { type: "number" },
            career_progression_score: { type: "number" },
            summary: { type: "string" }
          },
          required: ["cv_presentation_score", "technical_proficiency_score", "experience_relevance_score", "career_progression_score", "summary"],
          additionalProperties: false
        }
      },
      required: ["technical_skills", "professional_experience", "demographic_estimates", "potential_indicators", "overall_profile"],
      additionalProperties: false
    }
  }
} as const; 