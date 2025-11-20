// PDF Question Generation Service
const PYTHON_BACKEND_URL = 'http://localhost:4444';

export const pdfService = {
  /**
   * Generate MCQ questions from uploaded PDF
   * @param {File} pdfFile - The PDF file to process
   * @returns {Promise<Array>} Array of generated questions
   */
  generateQuestionsFromPDF: async (pdfFile) => {
    try {
      const formData = new FormData();
      formData.append('file', pdfFile);

      const response = await fetch(`${PYTHON_BACKEND_URL}/get_qna`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions from PDF');
      }

      const data = await response.json();
      return data.response || [];
    } catch (error) {
      console.error('Error generating questions from PDF:', error);
      throw error;
    }
  },
};
