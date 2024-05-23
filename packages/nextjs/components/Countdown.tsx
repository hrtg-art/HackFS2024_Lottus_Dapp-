import React, { useEffect, useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Countdown: React.FC = () => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Leer el tiempo de finalización desde el contrato inteligente
  const { data: currentLottery } = useScaffoldReadContract({
    contractName: "LottusLottery",
    functionName: "currentLottery",
  });

  useEffect(() => {
    if (currentLottery) {
      const endTime = Number(currentLottery[10]) * 1000; // Convertir a milisegundos
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance < 0) {
          clearInterval(interval);
          setTimeRemaining(0);
        } else {
          setTimeRemaining(distance);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentLottery]);

  const calculateTimeComponents = (distance: number) => {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = calculateTimeComponents(timeRemaining);

  const isUrgent = days === 0 && hours === 0;

  const timeStyle = {
    color: isUrgent ? "red" : "black",
  };

  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
      {days > 0 && (
        <div className="flex flex-col">
          <span className="countdown stat-value p-2">
            <span style={{ "--value": days } as React.CSSProperties}></span>
          </span>
          days
        </div>
      )}
      {days > 0 || hours > 0 ? (
        <div className="flex flex-col">
          <span className="countdown stat-value p-2">
            <span style={{ "--value": hours } as React.CSSProperties}></span>
          </span>
          hours
        </div>
      ) : null}
      <div className="flex flex-col">
        <span className="countdown stat-value p-2" style={timeStyle}>
          <span style={{ "--value": minutes } as React.CSSProperties}></span>
        </span>
        min
      </div>
      <div className="flex flex-col">
        <span className="countdown stat-value p-2" style={timeStyle}>
          <span style={{ "--value": seconds } as React.CSSProperties}></span>
        </span>
        sec
      </div>
    </div>
  );
};

export default Countdown;
