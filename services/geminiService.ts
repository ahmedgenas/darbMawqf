import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FineRecord } from "../types";

// Define the expected JSON structure for the AI
const responseSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      fineNumber: {
        type: Type.STRING,
        description: "The fine number (usually 10 digits)",
      },
      plateNumber: {
        type: Type.STRING,
        description: "Vehicle plate number (e.g., A-1234)",
      },
      fineDate: {
        type: Type.STRING,
        description: "Date of the fine (DD/MM/YYYY)",
      },
      fineType: {
        type: Type.STRING,
        description: "Description of the fine in Arabic only. Capture the full Arabic text.",
      },
      fineTypeEn: {
        type: Type.STRING,
        description: "Description of the fine in English only. Capture the English text corresponding to the fine type.",
      },
      fineAmount: {
        type: Type.NUMBER,
        description: "The monetary amount of the fine",
      },
      referenceNo: {
        type: Type.STRING,
        description: "The reference number (No column)",
      },
    },
    required: ["fineNumber", "plateNumber", "fineDate", "fineType", "fineTypeEn", "fineAmount"],
  },
};

export const extractDataFromPdf = async (
  base64Data: string,
  mimeType: string
): Promise<FineRecord[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze this document and extract all parking fine records. 
            The document contains mixed Arabic and English text. 
            Extract the data into a JSON array matching the schema.
            
            Important:
            1. 'fineType' must contain ONLY the Arabic description.
            2. 'fineTypeEn' must contain ONLY the English description.
            3. Ensure the Arabic text is not reversed.
            
            Ignore headers and footers, focus on the tabular data rows.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1, // Low temperature for factual extraction
      },
    });

    const text = response.text;
    if (!text) {
      return [];
    }

    const data: FineRecord[] = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw new Error("Failed to process the PDF document.");
  }
};