import React, { useEffect, useState } from "react";

interface CounterComponentProps {
  ethValue: number;
  onQuantityChange: (quantity: number) => void;
}

const CounterComponent: React.FC<CounterComponentProps> = ({ ethValue, onQuantityChange }) => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  useEffect(() => {
    onQuantityChange(count);
  }, [count, onQuantityChange]);

  const total = (count * ethValue).toFixed(3);

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
