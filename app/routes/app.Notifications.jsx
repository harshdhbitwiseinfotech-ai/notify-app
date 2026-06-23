// Notifications.jsx
import React, { useEffect, useState } from "react";
import "../routes/styles/notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");


  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/dashboard/notifications");
      const data = await res.json();

      setNotifications(data.notifications);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter logic
  const filteredNotifications = notifications.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });


  // UI
  return (
    <div className="notifications-container">

      {/* HEADER */}
      <div className="notifications-header">
        <h1>🔔 Notifications Log</h1>
        <p>Track all back-in-stock email notifications</p>
      </div>

      {/* FILTER BUTTONS */}
      <div className="filter-box">

        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={filter === "pending" ? "active pending" : ""}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>

        <button
          className={filter === "sent" ? "active sent" : ""}
          onClick={() => setFilter("sent")}
        >
          Sent
        </button>

        <button
          className={filter === "failed" ? "active failed" : ""}
          onClick={() => setFilter("failed")}
        >
          Failed
        </button>

      </div>

      {/* TABLE */}
      <div className="notifications-table-wrapper">

        {loading ? (
          <p>Loading notifications...</p>
        ) : (
          <table className="notifications-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Email</th>
                <th>Status</th>
                <th>Type</th>
                <th>Sent At</th>
              </tr>
            </thead>

            <tbody>
              {filteredNotifications.map((item) => (
                <tr key={item.id}>

                  {/* PRODUCT */}
                  <td className="product-cell">
                    <img src={item.productImage} alt="product" />
                    <span>{item.productName}</span>
                  </td>

                  {/* EMAIL */}
                  <td>{item.email}</td>

                  {/* STATUS */}
                  <td>
                    <span className={`badge ${item.status}`}>
                      {item.status}
                    </span>
                  </td>

                  {/* TYPE */}
                  <td>{item.type || "back_in_stock"}</td>

                  {/* SENT TIME */}
                  <td>
                    {item.sentAt
                      ? new Date(item.sentAt).toLocaleString()
                      : "Not Sent"}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

    </div>
  );
};

export default Notifications;