import './App.css';

import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';

const App = () => {
  const [month, setMonth] = useState('March');

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  return (
    <div>
      <h1>Transaction Dashboard</h1>
      <select value={month} onChange={handleMonthChange}>
        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      
      <Statistics month={month} />
      <TransactionsTable month={month} />
      <BarChart month={month} />
    </div>
  );
};

export default App;
