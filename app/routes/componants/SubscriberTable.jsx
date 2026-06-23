import React from "react";
import "../routes/styles/components.css";

const SubscriberTable = ({
  subscribers = [],
  onNotify,
  onViewProduct
}) => {
  return (
    <div className="subscriber-table-container">
      <table className="subscriber-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Product</th>
            <th>Status</th>
            <th>Requested Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {subscribers.length > 0 ? (
            subscribers.map((subscriber) => (
              <tr key={subscriber.id}>
                <td className="customer-info">
                  <div className="customer-avatar">
                    {subscriber.email
                      ? subscriber.email.charAt(0).toUpperCase()
                      : "U"}
                  </div>

                  <div>
                    <h4>{subscriber.email}</h4>
                    <span>Customer</span>
                  </div>
                </td>

                <td className="product-info">
                  <img
                    src={subscriber.productImage || "https://via.placeholder.com/50"}
                    alt={subscriber.productName}
                  />

                  <div>
                    <h4>{subscriber.productName}</h4>
                    <span>₹{subscriber.price}</span>
                  </div>
                </td>

                <td>
                  {subscriber.status === "notified" ? (
                    <span className="status notified">Notified</span>
                  ) : (
                    <span className="status pending">Pending</span>
                  )}
                </td>

                <td>
                  {new Date(subscriber.createdAt).toLocaleDateString()}
                </td>

                <td>
                  <button
                    className="notify-btn"
                    onClick={() => onNotify(subscriber)}
                  >
                    Notify
                  </button>

                  <button
                    className="view-btn"
                    onClick={() => onViewProduct(subscriber)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="empty">
                No subscribers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriberTable;
