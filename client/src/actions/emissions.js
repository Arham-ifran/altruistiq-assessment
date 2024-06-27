/**
 * Fetch emissions data from the server.
 * 
 * Makes a GET request to the server to retrieve emissions data for all countries.
 * 
 * @returns {Promise<Object>} The emissions data retrieved from the server.
 * @throws Will throw an error if the network response is not ok or if fetching data fails.
 */
export const fetchEmissionsData = async () => {
  try {
    // Uncomment the following line to simulate a delay in order to test/see the loader
    // await new Promise(resolve => setTimeout(resolve, 2000));

    // Fetch emissions data from the server
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}countries/emissions-per-country`);
    
    // Check if the network response is ok
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Parse the response data as JSON
    const data = await response.json();
    
    return data;
  } catch (error) {
    // Log and rethrow the error if fetching data fails
    console.error('Failed to fetch emissions data:', error);
    throw error;
  }
};
