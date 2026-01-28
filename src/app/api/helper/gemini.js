// const { GoogleGenAI } = require("@google/genai");
import { GoogleGenAI } from "@google/genai";

// import { GoogleGenAI } from "@google/genai";

// Configure the SDK with your Gemini API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const config = {
  responseMimeType: "application/json",
  systemInstruction:
    "You are an expert in evaluating documents in the governement sector. You have to ensure that the documents are compliant with the latest regulations and standards. Evalauate the document against international standards and Philippine Laws, ensure that the document complies with these standards. Use ISO Standards, DICT Guidelines for Government IT Infrastructure and RA 12009 (New Government Procurement Act), whichever is appropriate. If there was budget involved, check the budget compliance as well and whether they add up. Provide a detailed report highlighting key aspects, potential issues, and recommendations for improvement. Include an explanation to your analysis. Provide references to relevant regulations where applicable.",
  responseSchema: {
    type: "object",
    properties: {
      document_name: {
        type: "string",
        description: "The name of the document being evaluated.",
      },
      summary: {
        type: "string",
        description: "A brief summary of the document.",
      },
      key_points: {
        type: "array",
        description: "List of key points from the document.",
        items: { type: "string" },
      },
      potential_issues: {
        type: "object",
        // required: ["compliance_issues", "security_concerns"],
        properties: {
          compliance_issues: {
            type: "array",
            description: "Array of compliance issues found in the document.",
            items: {
              type: "object",
              required: ["excerpt", "location", "explanation"],
              properties: {
                excerpt: {
                  type: "string",
                  description:
                    "Exact phrase from the document highlighting the issue.",
                },
                location: {
                  type: "string",
                  description:
                    "Location in the document where the issue was found. [section, page].",
                },
                explanation: {
                  type: "string",
                  description: "Explanation of why this is a compliance issue.",
                },
              },
            },
          },
          security_concerns: {
            type: "array",
            description: "Array of security concerns found in the document.",
            items: {
              type: "object",
              required: ["excerpt", "location", "explanation"],
              properties: {
                excerpt: {
                  type: "string",
                  description:
                    "Exact phrase from the document highlighting the issue.",
                },
                location: {
                  type: "string",
                  description:
                    "Location in the document where the issue was found. [section, page]",
                },
                explanation: {
                  type: "string",
                  description: "Explanation of why this is a security concern.",
                },
              },
            },
          },
        },
      },
      recommendations: {
        type: "array",
        description: "Recommendations for improvement.",
        items: { type: "string" },
      },
      references: {
        type: "array",
        description: "References to relevant regulations.",
        items: { type: "string" },
      },
    },
    required: [
      "document_name",
      "summary",
      "key_points",
      "potential_issues",
      "recommendations",
      "references",
    ],
  },
};

async function generateAIReport(documentBase64) {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: [
      { text: "Provide a detailed report on this document." },
      { inlineData: { mimeType: "application/pdf", data: documentBase64 } },
    ],
    config: config,
  });

  const text = result.text;
  const response = JSON.parse(text);

  return response;
}

export { generateAIReport };
