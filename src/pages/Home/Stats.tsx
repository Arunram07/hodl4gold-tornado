import React from "react";

const Stats: React.FC = () => {
  return (
    <div className="home_stats_container">
      <div className="home_stats_container-header">
        <h2>Statistics</h2>
      </div>
      <div className="home_stats_container-content">
        <p>Anonymity set</p>
        <p className="md mt-10 mb-20">18206 equal user deposits</p>
        <b>Latest deposits</b>
        <div className="stats_grid">
          <div>
            {Array.from({ length: 4 }).map((_, i) => (
              <p key={i}>
                <span>37340.</span>
                <span>an hour ago</span>
              </p>
            ))}
          </div>
          <div>
            {Array.from({ length: 4 }).map((_, i) => (
              <p key={i}>
                <span>37340.</span>
                <span>an hour ago</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
