import React, { useState } from "react";
import "../routes/styles/settings.css";

const Settings = () => {
  const [toastVisible, setToastVisible] = useState(false);
  const [settings, setSettings] = useState({
    senderEmail: "support@yourstore.com",
    isEmailVerified: true,
    senderName: "Store Notifications",
    smtp: "Shopify Mail (Default)",
    replyTo: "customer-service@yourstore.com",
    backInStock: true,
    autoSend: true,
    lowStock: false,
    quantity: "5 units",
    followUpEmails: false,
    batchSend: false,
    notifyText: "Notify Me",
    notifiedText: "Notified",
    buttonBg: "#b1ebbf",
    buttonText: "#034d15",
    webhook: true,
    webhookBtnBg: "#008060",
    webhookBtnText: "#ffffff",
    placementProductPages: true,
    placementCollectionPages: false,
    placementCart: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <div className="settings-page">
      <div className="settings-grid">
        {/* EMAIL CONFIGURATION */}
        <div className="settings-card">
          <h3>Email Configuration</h3>

          <label>Sender Email</label>
          <div className="verified-input-container">
            <input
              name="senderEmail"
              value={settings.senderEmail}
              onChange={handleChange}
            />
            {settings.isEmailVerified && (
              <div className="verified-circle" title="Verified Email">
                ✓
              </div>
            )}
          </div>

          <label>Sender Name</label>
          <input
            name="senderName"
            value={settings.senderName}
            onChange={handleChange}
          />
          <small className="char-limit">40 characters</small>

          <label>SMTP Server</label>
          <select name="smtp" value={settings.smtp} onChange={handleChange}>
            <option>Shopify Mail (Default)</option>
            <option>Custom SMTP</option>
          </select>

          <label>Email Reply-To</label>
          <input
            name="replyTo"
            value={settings.replyTo}
            onChange={handleChange}
          />
        </div>

        {/* NOTIFICATION BEHAVIOR */}
        <div className="settings-card">
          <h3>Notification Behavior</h3>

          <CheckBox
            label="Back-in-stock"
            name="backInStock"
            checked={settings.backInStock}
            onChange={handleChange}
          />

          <CheckBox
            label="Auto send email when product is back in stock"
            name="autoSend"
            checked={settings.autoSend}
            onChange={handleChange}
          />

          <CheckBox
            label="Notify Only for Low Stock Threshold"
            name="lowStock"
            checked={settings.lowStock}
            onChange={handleChange}
          />

          <label>Quantity</label>
          <select name="quantity" value={settings.quantity} onChange={handleChange}>
            <option>5 units</option>
            <option>10 units</option>
          </select>

          <div className="toggle-row">
            <span>Send Follow-up Emails</span>
            <Toggle
              active={settings.followUpEmails}
              onClick={() => setSettings((prev) => ({
                ...prev,
                followUpEmails: !prev.followUpEmails,
              }))}
            />
          </div>

          <div className="toggle-row">
            <span>Batch Send Notifications</span>
            <Toggle
              active={settings.batchSend}
              onClick={() => setSettings((prev) => ({
                ...prev,
                batchSend: !prev.batchSend,
              }))}
            />
          </div>
        </div>

        {/* BUTTON CUSTOMIZATION */}
        <div className="settings-card">
          <h3>Button Customization</h3>

          <label>Notify Button Text</label>
          <input
            value={settings.notifyText}
            name="notifyText"
            onChange={handleChange}
          />

          <label>Notified Button Text</label>
          <input
            value={settings.notifiedText}
            name="notifiedText"
            onChange={handleChange}
          />

          <h4>Button Placement</h4>
          <CheckBox
            label="Product pages"
            name="placementProductPages"
            checked={settings.placementProductPages}
            onChange={handleChange}
          />
          <CheckBox
            label="Collection pages"
            name="placementCollectionPages"
            checked={settings.placementCollectionPages}
            onChange={handleChange}
          />
          <CheckBox
            label="Cart"
            name="placementCart"
            checked={settings.placementCart}
            onChange={handleChange}
          />
        </div>

        {/* LIVE PREVIEW */}
        <div className="settings-card preview-card">
          <h3>Live Preview</h3>

          <div className="preview-box">
            <div className="product-image-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>

            <div className="preview-details">
              <h4>Product left</h4>
              <p className="preview-price">$15.00</p>
              <button
                className="preview-action-btn"
                style={{
                  background: settings.buttonBg,
                  color: settings.buttonText,
                }}
              >
                {settings.notifyText}
              </button>
            </div>
          </div>

          <div className="color-pickers-group">
            <div className="color-picker-wrapper">
              <label>Button Background</label>
              <div className="color-input-row">
                <input
                  type="color"
                  value={settings.buttonBg}
                  name="buttonBg"
                  onChange={handleChange}
                />
                <span className="color-hex-label">{settings.buttonBg}</span>
              </div>
            </div>

            <div className="color-picker-wrapper">
              <label>Button Text</label>
              <div className="color-input-row">
                <input
                  type="color"
                  value={settings.buttonText}
                  name="buttonText"
                  onChange={handleChange}
                />
                <span className="color-hex-label">{settings.buttonText}</span>
              </div>
            </div>
          </div>
        </div>

        {/* WEBHOOK */}
        <div className="settings-card">
          <h3>Shopify Webhook</h3>

          <CheckBox
            label="Inventory webhook active"
            name="webhook"
            checked={settings.webhook}
            onChange={handleChange}
          />

          <div className="webhook-status">
            <div className="status-line">
              Webhook Status: <b>Active and Verified</b>
            </div>
            <div className="status-line">
              Last received: 2025-05-24 12:50:14
            </div>
            
            <button 
              className="update-webhook-btn"
              style={{
                background: settings.webhookBtnBg,
                color: settings.webhookBtnText
              }}
            >
              Update Webhook
            </button>
          </div>

        </div>
      </div>

      <button className="save-btn" onClick={handleSave}>Save All Settings</button>

      {toastVisible && (
        <div className="toast-notification">
          <div className="toast-icon">✓</div>
          <div className="toast-content">
            <span className="toast-title">Settings saved</span>
            <p>All changes were saved successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckBox = ({ label, name, checked, onChange }) => {
  return (
    <label className="checkbox">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  );
};

const Toggle = ({ active, onClick }) => {
  return (
    <div className={`toggle ${active ? "active" : ""}`} onClick={onClick}>
      <span></span>
    </div>
  );
};

export default Settings;