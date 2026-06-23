import React, { useState } from "react";
import "./out-of-stock-banner.css";

const OutOfStockBanner = ({ productId, variantId, productName, available = false }) => {
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /*
    If product is available
    Show nothing
    Shopify Add To Cart continues normally
  */
  if (available) return null;

  const handleNotify = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          productId,
          variantId,
          productName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNotified(true);
        setMessage("You will be notified when available");
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="out-stock-banner">
      <div className="stock-label">OUT OF STOCK</div>
      <h3>{productName}</h3>
      <p className="stock-text">
        This product is currently unavailable. Get notified when it comes back.
      </p>

      <input
        type="email"
        className="notify-input"
        placeholder="Enter your email"
        value={email}
        disabled={notified}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className={notified ? "notify-btn notified" : "notify-btn"}
        disabled={loading || notified}
        onClick={handleNotify}
      >
        {loading ? "Saving..." : notified ? "✓ Notified" : "Notify Me"}
      </button>

      {message && (
        <p className={notified ? "success-message" : "error-message"}>{message}</p>
      )}
    </div>
  );
};

export default OutOfStockBanner;

