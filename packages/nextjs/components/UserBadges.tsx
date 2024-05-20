import React from "react";

interface UserBadgesProps {
  badges: readonly string[];
}

const badgeStyles = [
  "badge badge",
  "badge badge-primary badge",
  "badge badge-warning badge",
  "badge badge-info badge",
  "badge badge-neutral badge",
  "badge badge-accent badge",
];

const badgeDescriptions: { [key: string]: string } = {
  Newcomer: "Awarded for participating in your first Lottus.",
  "Regular Participant": "Awarded for participating in 5 Lottus events.",
  "Frequent Player": "Awarded for participating in 10 Lottus events.",
  "Seasoned Player": "Awarded for participating in 20 Lottus events.",
  "Veteran Player": "Awarded for participating in 50 Lottus events.",
  Centurion: "Awarded for participating in 100 Lottus events.",
  "Double Centurion": "Awarded for participating in 200 Lottus events.",
  "Half Millennia Master": "Awarded for participating in 500 Lottus events.",
  LuckyWinner: "Awarded for winning a Lottus.",
  "Bronze Donor": "Awarded for donating a total of 0.1 ETH.",
  "Silver Donor": "Awarded for donating a total of 0.5 ETH.",
  "Gold Donor": "Awarded for donating a total of 1 ETH.",
  "Platinum Donor": "Awarded for donating a total of 2 ETH.",
  "Diamond Donor": "Awarded for donating a total of 5 ETH.",
  "Master Philanthropist": "Awarded for donating a total of 10 ETH.",
};

const UserBadges: React.FC<UserBadgesProps> = ({ badges }) => {
  return (
    <div className="p-5 bg-base-100 shadow-lg rounded-box">
      <h2 className="stat-value p-1 text-center">Your Badges</h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {badges.map((badge, index) => (
          <div
            key={index}
            className={`tooltip ${badgeStyles[index % badgeStyles.length]}`}
            data-tip={badgeDescriptions[badge] || "Achievement badge"}
          >
            {badge}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBadges;
