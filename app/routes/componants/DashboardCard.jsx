import React from "react";
import "../routes/styles/global.css";


const DashboardCard = ({
  title,
  value,
  icon,
  subtitle,
  status = "default",
  onClick
}) => {

  return (

    <div
      className={`dashboard-card ${status}`}
      onClick={onClick}
    >

      <div className="dashboard-card-header">
        <div className="dashboard-card-icon">
          {icon}
        </div>

        <div className="dashboard-card-title">
          <h3>
            {title}
          </h3>
          <p>
            {subtitle}
          </p>
        </div>
      </div>
      <div className="dashboard-card-value">
        {value}
      </div>
    </div>
  );
};


export default DashboardCard;