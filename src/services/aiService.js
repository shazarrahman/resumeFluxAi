const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * Analyze a resume using Groq AI
 * @param {string} resumeText - The extracted resume text
 * @param {string} jobDescription - Optional job description for matching
 * @returns {Promise<Object>} - Analysis result
 */
const analyzeResume = async (resumeText, jobDescription = '') => {
  let prompt;

  if (jobDescription && jobDescription.trim()) {
    // Job description matching mode
    prompt = `Compare this resume against this job description.
Resume:
${resumeText}

Job Description:
${jobDescription}

Return a JSON object with these exact fields:
{
  "matchScore": number (0-100),
  "matchedSkills": array of strings,
  "missingSkills": array of strings,
  "suggestions": array of strings,
  "summary": string (one paragraph)
}`;
  } else {
    // General analysis mode
    prompt = `Analyze this resume and return a JSON object with these exact fields:
{
  "score": number (0-100),
  "strengths": array of strings (3 things done well),
  "improvements": array of strings (5 specific bullet point improvements),
  "missingKeywords": array of strings,
  "summary": string (one paragraph overall assessment)
}

Resume:
${resumeText}`;
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
      max_tokens: 2048,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return result;
  } catch (error) {
    console.error('AI Analysis error:', error);
    throw new Error('Failed to analyze resume with AI');
  }
};

/**
 * Generate interview questions based on resume and job
 * @param {string} resumeText - Resume text
 * @param {string} jobDescription - Job description
 * @returns {Promise<Object>} - Interview prep data
 */
const generateInterviewPrep = async (resumeText, jobDescription = '') => {
  const prompt = `Based on this resume and job description, generate interview preparation materials.

Resume:
${resumeText}

${jobDescription ? `Job Description:\n${jobDescription}\n` : ''}

Return a JSON object with:
{
  "questions": array of 10 likely interview questions,
  "importantTopics": array of 5 topics the candidate should study
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: 'json_object' }
    });

    return JSON.parse(completion.choices[0]?.message?.content || '{}');
  } catch (error) {
    console.error('Interview prep error:', error);
    throw new Error('Failed to generate interview prep');
  }
};

/**
 * Rewrite a resume bullet point in STAR format
 * @param {string} bullet - Original bullet point
 * @returns {Promise<string>} - Rewritten bullet
 */
const rewriteBullet = async (bullet) => {
  const prompt = `Rewrite this resume bullet point using the STAR format (Situation, Task, Action, Result).
Make it more impactful and professional.

Original: ${bullet}

Return just the rewritten bullet point, no extra text.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 256
    });

    return completion.choices[0]?.message?.content?.trim() || bullet;
  } catch (error) {
    console.error('Bullet rewrite error:', error);
    throw new Error('Failed to rewrite bullet point');
  }
};

module.exports = {
  analyzeResume,
  generateInterviewPrep,
  rewriteBullet
};
