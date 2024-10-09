import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { fetchBarChartData } from '../services/api';

const BarChart = ({ month }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const loadChartData = async () => {
      const response = await fetchBarChartData(month);
      const data = response.data;

      setChartData({
        labels: data.priceRanges.map(range => range.label),
        datasets: [{
          label: 'Number of Items',
          data: data.priceRanges.map(range => range.count),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
      });
    };
    loadChartData();
  }, [month]);

  return (
    <div>
      <h3>Price Range for {month}</h3>
      <Bar data={chartData} />
    </div>
  );
};

export default BarChart;
