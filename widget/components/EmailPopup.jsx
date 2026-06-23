import React, { useState } from "react";
import "./email-popup.css";

const EmailPopup = ({
  isOpen,
  onClose,
  productId,
  variantId,
  productName,
  productImage,
  price,
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!email) {
      setMessage("Please enter your email address");
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
        setSuccess(true);
        setMessage(
          "You will be notified when this product is back in stock"
        );
      } else {
        setMessage(data.message || "Already subscribed");
      }
    } catch (error) {
      console.error("Notification Error:", error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="email-popup">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        {!success ? (
          <>
            <div className="popup-product">
              <img
                src={
                  productImage || "https://via.placeholder.com/80"
                }
                alt={productName}
              />

              <div>
                <h3>{productName}</h3>

                <p>₹{price}</p>
              </div>
            </div>

            <h2>Get notified when available</h2>

            <p className="popup-text">
              Enter your email and we will inform you
              when this product is back in stock.
            </p>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Notify Me"}
            </button>
          </>
        ) : (
          <div className="success-box">
            <div className="success-icon">✓</div>

            <h2>You are subscribed!</h2>

            <p>{message}</p>

            <button className="done-btn" onClick={onClose}>
              Done
            </button>
          </div>
        )}

        {message && !success && (
          <p className="error-message">{message}</p>
        )}
      </div>
    </div>
  );
};

export default EmailPopup;

