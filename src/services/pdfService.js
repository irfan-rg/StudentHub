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
        // Try to parse server error message
        let errMsg = 'Failed to generate questions from PDF';
        try {
          const errData = await response.json();
          errMsg = errData?.error || errData?.details || errMsg;
        } catch (e) {
          // ignore
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      return data.response || [];
    } catch (error) {
      console.error('Error generating questions from PDF:', error);
      throw error;
    }
  },
};
