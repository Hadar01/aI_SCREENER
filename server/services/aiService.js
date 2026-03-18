/**
 * ─── AI Service ─────────────────────────────────────────────────────────────────
 *
 * Abstracts the LLM call behind a unified interface.
 * Supports both Google Gemini and OpenAI — configured via AI_PROVIDER env var.
 *
 * The core prompt is provider-agnostic: we build it here, then route to the
 * correct API. Both providers return a structured JSON analysis object.
 */

// ─── System Prompt ──────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are "ScreenerAI", an expert technical recruiter and resume analyst.
Your job is to evaluate a candidate's resume against a given job description (or general industry standards if no JD is provided).

You MUST return ONLY a valid JSON object with the following structure — no markdown, no explanation, no code fences, JUST the raw JSON:

{
  "match_score": <integer 0-100>,
  "missing_skills": [<string>, ...],
  "strengths": [<string>, ...],
  "experience_level": "<junior|mid|senior|lead|executive>",
  "recommendation": "<strong_yes|yes|maybe|no|strong_no>",
  "summary": "<2-4 sentence professional assessment>"
}

Scoring rubric:
- 90-100: Near-perfect match — exceeds most requirements
- 75-89:  Strong match — meets core requirements, minor gaps
- 60-74:  Moderate match — meets some requirements, notable gaps
- 40-59:  Weak match — significant skill gaps
- 0-39:   Poor match — fundamental misalignment

Rules:
1. Be objective and evidence-based. Only cite skills that are explicitly absent from the resume.
2. "missing_skills" should list 3-8 specific, actionable skills the candidate lacks.
3. "strengths" should list 3-6 concrete strengths evidenced in the resume.
4. "experience_level" is inferred from years of experience, role progression, and project complexity.
5. "summary" must be professional, concise, and suitable for sharing with a hiring manager.
6. If the resume text is garbled or too short (<50 words), return match_score: 0 and explain in the summary.`;

// ─── Build the user-facing prompt ───────────────────────────────────────────────

function buildUserPrompt(resumeText, jobTitle, jobDescription) {
  let prompt = `## RESUME TEXT\n\n${resumeText}\n\n`;

  if (jobTitle) {
    prompt += `## TARGET ROLE\n\n${jobTitle}\n\n`;
  }

  if (jobDescription) {
    prompt += `## JOB DESCRIPTION\n\n${jobDescription}\n\n`;
  } else {
    prompt += `## JOB DESCRIPTION\n\nNo specific job description provided. Evaluate the resume against general industry standards for ${jobTitle || "a software engineering role"}.\n\n`;
  }

  prompt += `Now analyze this resume and return the JSON result.`;
  return prompt;
}

// ─── Gemini Provider ────────────────────────────────────────────────────────────

async function callGemini(resumeText, jobTitle, jobDescription) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const userPrompt = buildUserPrompt(resumeText, jobTitle, jobDescription);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();

  // Extract text from Gemini response
  const rawText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  return parseAIResponse(rawText);
}

// ─── OpenAI Provider ────────────────────────────────────────────────────────────

async function callOpenAI(resumeText, jobTitle, jobDescription) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set in environment variables");
  }

  const url = "https://api.openai.com/v1/chat/completions";

  const userPrompt = buildUserPrompt(resumeText, jobTitle, jobDescription);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content || "";

  return parseAIResponse(rawText);
}

// ─── Response Parser & Validator ────────────────────────────────────────────────

function parseAIResponse(rawText) {
  let cleaned = rawText.trim();

  // Strip markdown code fences if the LLM wraps them anyway
  cleaned = cleaned
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse AI response:", cleaned);
    throw new Error(
      `AI returned invalid JSON: ${err.message}. Raw: ${cleaned.substring(0, 300)}`
    );
  }

  // Validate and sanitize
  return {
    match_score: clamp(parseInt(parsed.match_score, 10) || 0, 0, 100),
    missing_skills: ensureStringArray(parsed.missing_skills),
    strengths: ensureStringArray(parsed.strengths),
    experience_level: validateEnum(
      parsed.experience_level,
      ["junior", "mid", "senior", "lead", "executive"],
      null
    ),
    recommendation: validateEnum(
      parsed.recommendation,
      ["strong_yes", "yes", "maybe", "no", "strong_no"],
      null
    ),
    summary:
      typeof parsed.summary === "string"
        ? parsed.summary.trim()
        : "Analysis completed but no summary was generated.",
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function ensureStringArray(val) {
  if (!Array.isArray(val)) return [];
  return val
    .filter((item) => typeof item === "string")
    .map((s) => s.trim())
    .filter(Boolean);
}

function validateEnum(val, allowed, fallback) {
  if (typeof val === "string" && allowed.includes(val.toLowerCase())) {
    return val.toLowerCase();
  }
  return fallback;
}

// ─── Public Interface ───────────────────────────────────────────────────────────

/**
 * Analyze a resume using the configured AI provider.
 *
 * @param {string} resumeText    – Extracted plain text from the PDF
 * @param {string} jobTitle      – Target job title (optional)
 * @param {string} jobDescription – Full JD text (optional)
 * @returns {Promise<object>}    – Structured analysis object
 */
async function analyzeResume(resumeText, jobTitle = "", jobDescription = "") {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

  console.log(`🤖 Analyzing resume with provider: ${provider}`);

  switch (provider) {
    case "gemini":
      return callGemini(resumeText, jobTitle, jobDescription);
    case "openai":
      return callOpenAI(resumeText, jobTitle, jobDescription);
    default:
      throw new Error(
        `Unsupported AI_PROVIDER: "${provider}". Use "gemini" or "openai".`
      );
  }
}

module.exports = {
  analyzeResume,
  // Exported for testing
  SYSTEM_PROMPT,
  buildUserPrompt,
  parseAIResponse,
};
