import React, { useState, useEffect } from 'react';
import { fetchStatistics } from '../services/api';

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    const loadStatistics = async () => {
      const response = await fetchStatistics(month);
      setStatistics(response.data);
    };
    loadStatistics();
  }, [month]);

  return (
    <div>
      <h3>Statistics for {month}</h3>
      <div>Total Sales: ${statistics.totalSales}</div>
      <div>Sold Items: {statistics.soldItems}</div>
      <div>Unsold Items: {statistics.unsoldItems}</div>
    </div>
  );
};

export default Statistics;
