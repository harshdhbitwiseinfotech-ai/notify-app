// Subscribers.jsx
import React, { useEffect, useState } from "react";
import "../routes/styles/subscribers.css";

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  
  // Fetch subscribers
  const fetchSubscribers = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/dashboard/subscribers");
      const data = await res.json();

      setSubscribers(data.subscribers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);


  // Filter logic
  const filteredSubscribers = subscribers.filter((item) =>
    item.email.toLowerCase().includes(search.toLowerCase()) ||
    item.productName.toLowerCase().includes(search.toLowerCase())
  );

  // Mark as notified
  const markAsNotified = async (id) => {
    try {
      await fetch(`/api/dashboard/subscribers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "notified" }),
      });

      fetchSubscribers();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  
  // UI
  return (
    <div className="subscribers-container">

      {/* HEADER */}
      <div className="subscribers-header">
        <h1>👥 Subscribers</h1>
        <p>Customers waiting for back-in-stock notifications</p>
      </div>

      {/* SEARCH */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by email or product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="subscribers-table-wrapper">

        {loading ? (
          <p>Loading subscribers...</p>
        ) : (
          <table className="subscribers-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Email</th>
                <th>Status</th>
                <th>Requested At</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredSubscribers.map((item) => (
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
                    {item.status === "notified" ? (
                      <span className="badge green">Notified</span>
                    ) : (
                      <span className="badge orange">Pending</span>
                    )}
                  </td>

                  {/* TIME */}
                  <td>
                    {new Date(item.createdAt).toLocaleString()}
                  </td>

                  {/* ACTION */}
                  <td>
                    {item.status === "pending" ? (
                      <button
                        className="notify-btn"
                        onClick={() => markAsNotified(item.id)}
                      >
                        Mark Notified
                      </button>
                    ) : (
                      <span className="done-text">✔ Done</span>
                    )}
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

export default Subscribers;