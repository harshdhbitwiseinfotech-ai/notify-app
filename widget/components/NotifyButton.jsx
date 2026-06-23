import React, { useState } from "react";
import "./notify-button.css";

const NotifyButton = ({
  productId,
  variantId,
  productName,
  productImage,
  price,
  available = false,
}) => {
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [message, setMessage] = useState("");

  /*
    Product available

    No Notify button

    Shopify Add To Cart remains active
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
          productImage,
          price,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNotified(true);
        setMessage("You will receive an email when available");
      } else {
        setMessage(data.message || "Already subscribed");
      }
    } catch (error) {
      console.error("Notify Error:", error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notify-container">
      {!showInput && !notified && (
        <button
          className="notify-main-btn"
          onClick={() => setShowInput(true)}
        >
          Notify Me
        </button>
      )}

      {showInput && !notified && (
        <div className="notify-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="notify-submit-btn"
            disabled={loading}
            onClick={handleNotify}
          >
            {loading ? "Saving..." : "Notify Me"}
          </button>
        </div>
      )}

      {notified && (
        <button className="notify-main-btn notified">✓ Notified</button>
      )}

      {message && (
        <p
          className={
            notified ? "notify-success" : "notify-error"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default NotifyButton;

