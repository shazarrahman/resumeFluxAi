const fs = require('fs');
const path = require('path');

// For PDF files
const pdfParse = require('pdf-parse');

// For DOCX files
const mammoth = require('mammoth');

/**
 * Extract text from a resume file
 * @param {string} filePath - Path to the uploaded file
 * @param {string} fileExtension - File extension (pdf, docx)
 * @returns {Promise<string>} - Extracted text
 */
const extractText = async (filePath, fileExtension) => {
  try {
    let text = '';

    if (fileExtension.toLowerCase() === '.pdf') {
      // Extract from PDF
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (fileExtension.toLowerCase() === '.docx') {
      // Extract from DOCX
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else {
      throw new Error(`Unsupported file format: ${fileExtension}`);
    }

    // Clean up the text
    text = cleanText(text);

    if (!text || text.trim().length === 0) {
      throw new Error('Could not extract text from the file');
    }

    return text;
  } catch (error) {
    console.error('Resume parser error:', error);
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
};

/**
 * Clean extracted text
 * @param {string} text - Raw extracted text
 * @returns {string} - Cleaned text
 */
const cleanText = (text) => {
  return text
    // Remove multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    // Remove multiple spaces
    .replace(/ {2,}/g, ' ')
    // Remove tabs
    .replace(/\t/g, ' ')
    // Trim each line
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .trim();
};

module.exports = {
  extractText,
  cleanText
};
