import React from "react";

interface UserLevelProps {
  level: number | bigint;
}

const UserLevel: React.FC<UserLevelProps> = ({ level }) => {
  return (
    <div className="p-5 bg-base-300 shadow-lg rounded-box">
      <h2 className="stat-value p-1 text-center">Your Level</h2>
      <div className="flex justify-center mt-3">
        <span className="block text-8xl font-bold">{level.toString()}</span>
      </div>
    </div>
  );
};

export default UserLevel;
