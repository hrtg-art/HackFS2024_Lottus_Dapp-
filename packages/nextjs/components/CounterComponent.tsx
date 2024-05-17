import React, { useState } from "react";

const CounterComponent: React.FC = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const total = (count * 0.01).toFixed(2);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="stat-value p-2">Total: {total} ETH</div>
      <div className="flex items-center space-x-2">
        <button className="btn btn-secondary" onClick={decrement}>
          -
        </button>
        <span className="stat-value p-5">{count}</span>
        <button className="btn btn-secondary" onClick={increment}>
          +
        </button>
      </div>
    </div>
  );
};

export default CounterComponent;
