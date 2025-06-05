const recommendationApiRequest = {
  getRecommendations: async (
    productId: number,
    page: number = 1,
    size: number = 12
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5555/api/recommendations?id=${productId}&page=${page}&size=${size}`
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      return { payload: data };
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      throw error;
    }
  },
};

export default recommendationApiRequest;
