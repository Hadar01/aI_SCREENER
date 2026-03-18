const fs = require("fs");
const pdfParse = require("pdf-parse");

/**
 * Extract text and metadata from a PDF file.
 *
 * @param {string} filePath  – Absolute path to the PDF file
 * @returns {Promise<{ text: string, pageCount: number, info: object }>}
 */
async function extractTextFromPDF(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`PDF file not found: ${filePath}`);
  }

  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);

  // Basic cleaning: collapse multiple whitespace, trim
  const cleanedText = data.text
    .replace(/\s+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return {
    text: cleanedText,
    pageCount: data.numpages,
    info: {
      title: data.info?.Title || null,
      author: data.info?.Author || null,
      creator: data.info?.Creator || null,
    },
  };
}

module.exports = { extractTextFromPDF };
