import { useEffect, useState } from 'react';
import Loader from './Loader';
import { fetchEmissionsData } from '../actions/emissions';

function EmissionsByCountry() {
  const [year, setYear] = useState(null); // Current year being displayed
  const [yearNumber, setYearNumber] = useState(null); // Index of the current year in the data
  const [emissionsData, setEmissionsData] = useState(null); // Emissions data for all years
  const [currentYearData, setCurrentYearData] = useState(null); // Emissions data for the current year
  const [globalTotal, setGlobalTotal] = useState(0); // Global total emissions for the current year
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [responseMessage, setResponseMessage] = useState(null); // Response message from the API

  // Fetch emissions data on component mount
  useEffect(() => {
    const getData = async () => {
      try {
        const { data, message } = await fetchEmissionsData();
        setResponseMessage(message);
        if (data) {
          setEmissionsData(data);
          const firstYearNumber = 0;
          const firstYear = Object.keys(data)[firstYearNumber];
          setYearNumber(firstYearNumber);
          setYear(firstYear);
          setCurrentYearData(data[firstYear]);
          setGlobalTotal(data[firstYear].reduce((sum, item) => sum + item.total, 0));
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  // Update current year data periodically
  useEffect(() => {
    if (yearNumber !== null && emissionsData) {
      const interval = setInterval(() => {
        setYearNumber(prevYearNumber => {
          let newYearNumber = prevYearNumber + 1;
          if (newYearNumber > Object.keys(emissionsData).length - 1) {
            newYearNumber = 0;
          }
          const newYear = Object.keys(emissionsData)[newYearNumber];
          setYear(newYear);
          setCurrentYearData(emissionsData[newYear]);
          setGlobalTotal(emissionsData[newYear].reduce((sum, item) => sum + item.total, 0));
          return newYearNumber;
        });
      }, 500); // Change year every 0.5 seconds
      return () => clearInterval(interval);
    }
  }, [emissionsData, yearNumber]);

  // Calculate the percentage for the bar graph
  const calculatePercent = (high, value) => {
    if (high === 0) {
      return 0; // to avoid division by zero
    }
    return (value / high) * 100;
  };

  // Generate color for the bar graph based on the percentage
  const generateColor = (percent) => {
    const color1 = { r: 65, g: 86, b: 90 };    // #41565A
    const color2 = { r: 157, g: 216, b: 229 }; // #9DD8E5

    const r = Math.round(color1.r + percent * (color2.r - color1.r));
    const g = Math.round(color1.g + percent * (color2.g - color1.g));
    const b = Math.round(color1.b + percent * (color2.b - color1.b));

    return `rgb(${r}, ${g}, ${b})`;
  };

  // Display loader while data is loading
  if (loading) {
    return <Loader />;
  }

  // Display error message if there was an error fetching data
  if (error) {
    return <div>Error: {error}</div>;
  }

  const highestTotal = (currentYearData && currentYearData[0]?.total) || 0;

  return (
    <div className="app">
      <div className="app-holder d-flex justify-content-center align-items-center">
        <div className="app-block d-flex flex-column align-items-center">
          <h1>Historic global carbon footprint</h1>
          {
            currentYearData &&
            <div className="stats-block d-flex justify-content-between">
              <div className="d-flex flex-column align-items-center">
                <span className="stat-heading">year</span>
                <strong className="stat-value">{year}</strong>
              </div>
              <div className="d-flex flex-column align-items-center">
                <span className="stat-heading">global total</span>
                <strong className="stat-value">{parseFloat(globalTotal.toFixed(4))}</strong>
              </div>
            </div>
          }
          <div className="chart-container">
            <div className="chart-block">
              {
                currentYearData &&
                <div className="total-text d-flex justify-content-end mb-15">total</div>
              }
              {
                !currentYearData &&
                <h3>{responseMessage}</h3>
              }
              {currentYearData && currentYearData.map((item, index) => {
                const percent = calculatePercent(highestTotal, item.total) / 100;
                return (
                  <div className="chart-row d-flex flex-column mb-10" key={index}>
                    <div className="d-flex justify-content-between align-items-center">
                      <strong className="country-name d-flex justify-content-end">{item.country}</strong>
                      <div className="population-graph desktop-view">
                        <div className="population-index" style={{ width: `${percent * 100}%`, background: generateColor(percent) }}></div>
                      </div>
                      <strong className="population-count d-flex justify-content-end">{item.total}</strong>
                    </div>
                    <div className="population-graph mobile-view">
                      <div className="population-index" style={{ width: `${percent * 100}%`, background: generateColor(percent) }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmissionsByCountry;