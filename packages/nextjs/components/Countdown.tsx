import React, { useEffect, useState } from "react";

const Countdown: React.FC = () => {
  const [days, setDays] = useState(15);
  const [hours, setHours] = useState(10);
  const [minutes, setMinutes] = useState(24);
  const [seconds, setSeconds] = useState(53);

  // You can add useEffect hooks here to update the values as needed
  useEffect(() => {
    const interval = setInterval(() => {
      // Logic to update days, hours, minutes, and seconds
      // Example: decrement seconds and handle rollovers
      setSeconds(prev => (prev > 0 ? prev - 1 : 59));
      if (seconds === 0) {
        setMinutes(prev => (prev > 0 ? prev - 1 : 59));
        if (minutes === 0) {
          setHours(prev => (prev > 0 ? prev - 1 : 23));
          if (hours === 0) {
            setDays(prev => (prev > 0 ? prev - 1 : 0));
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, minutes, hours, days]);

  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
      <div className="flex flex-col">
        <span className="countdown stat-value p-2">
          <span style={{ "--value": days } as React.CSSProperties}></span>
        </span>
        days
      </div>
      <div className="flex flex-col">
        <span className="countdown stat-value p-2">
          <span style={{ "--value": hours } as React.CSSProperties}></span>
        </span>
        hours
      </div>
      <div className="flex flex-col">
        <span className="countdown stat-value p-2">
          <span style={{ "--value": minutes } as React.CSSProperties}></span>
        </span>
        min
      </div>
      <div className="flex flex-col">
        <span className="countdown stat-value p-2">
          <span style={{ "--value": seconds } as React.CSSProperties}></span>
        </span>
        sec
      </div>
    </div>
  );
};

export default Countdown;
