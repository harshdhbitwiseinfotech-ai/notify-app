import React, { useState } from 'react';
import "../routes/styles/payment.css";

const Payment = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [invoices, setInvoices] = useState([]);

  const plans = [
    {
      title: "Free",
      description: "Basic stock tracking for small businesses.",
      price: "$0",
      period: "/ 15 days only",
      features: [
        "Basic Inventory Dashboard (Includes 1 store)",
        "Simple low-stock email alerts (up to 50 SKUs)",
        "Up to 1 admin account",
        "Basic data import (CSV)",
        "Instant access to the inventory environment",
        "No complex integration required"
      ],
      buttonText: "Your Current Plan",
      isPopular: false,
      isCurrent: true
    },
    {
      title: "Pro",
      description: "Complete back-in-stock management and automation.",
      price: "$49",
      period: "/ Monthly",
      subText: "Highly recommended for small teams who seek to upgrade their time & perform.",
      featuresHeader: "Free package included +:",
      features: [
        "Pre-built stock automation workflows",
        "Back-in-stock notifications (up to 1,000 requests/mo)",
        "Customer subscription portal",
        "Product waitlist management",
        "Priority technical support"
      ],
      buttonText: "Upgrade to Pro",
      isPopular: true
    },
    {
      title: "Advance",
      description: "Custom solutions for large-scale operations and digital practices.",
      price: "$99",
      period: "/ Monthly",
      features: [
        "Pre-built stock automation workflows",
        "Back-in-stock notifications (up to 1,000 requests/mo)",
        "Customer subscription portal",
        "Product waitlist management",
        "Up to 5 admin accounts",
        "Advanced low-stock reporting",
        "Priority technical support"
      ],
      buttonText: "Get Started",
      isPopular: false
    }
  ];

  const handleCheckout = (planTitle, basePrice) => {
    if (planTitle === "Free") return;

    const baseNumeric = parseInt(basePrice.replace('$', ''), 10);
    const calculatedPrice = isAnnual ? baseNumeric * 0.8 : baseNumeric;

    const newInvoice = {
      id: `300000${406 + invoices.length}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: `$${calculatedPrice.toFixed(2)}`,
      status: "Paid"
    };

    setInvoices([newInvoice, ...invoices]);
  };

  return (
    <div className="pricing-page-wrapper">
      <header className="pricing-header">
        <h1 className="main-heading">Bring Your Buyers Back</h1>
        <p className="sub-heading">
          Simple, automated back-in-stock alerts that capture high-intent buyers, build your email list, and automatically recover missed revenue.
        </p>

        {/* Centered & Enlarged Billing Toggle Switch Container */}
        <div className="toggle-wrapper-center">
          <span className={`toggle-txt ${!isAnnual ? 'active' : ''}`}>Monthly billing</span>
          <button 
            type="button" 
            className={`switch-element ${isAnnual ? 'on' : ''}`}
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <span className="switch-knob"></span>
          </button>
          <span className={`toggle-txt ${isAnnual ? 'active' : ''}`}>
            Annual billing <span className="discount-tag">Save 20%</span>
          </span>
        </div>
      </header>

      {/* Pricing Grid */}
      <div className="pricing-grid">
        {plans.map((plan, index) => {
          let dynamicPrice = plan.price;
          if (isAnnual && plan.price !== "$0") {
            const numericValue = parseInt(plan.price.replace('$', ''), 10);
            dynamicPrice = `$${Math.floor(numericValue * 0.8)}`;
          }

          return (
            <div key={index} className={`pricing-card ${plan.isPopular ? 'popular-card' : ''}`}>
              {plan.isPopular && (
                <>
                  <div className="popular-badge">Most Popular</div>
                  <div className="pro-bg-layer">
                    <div className="pro-top-glow"></div>
                    <div className="pro-dot-pattern"></div>
                  </div>
                </>
              )}
              
              <div className="card-header">
                <h2 className="plan-title">{plan.title}</h2>
                <p className="plan-description">{plan.description}</p>
                
                <div className="price-container">
                  <span className="plan-price">{dynamicPrice}</span>
                  <span className="plan-period">{isAnnual && plan.price !== "$0" ? "/ Yearly" : plan.period}</span>
                </div>

                {plan.subText && <p className="plan-subtext">{plan.subText}</p>}
              </div>

              {!plan.isPopular && <hr className="divider" />}
              {plan.isPopular && <div className="pro-divider-spacer"></div>}

              <div className="card-body">
                {plan.featuresHeader && <p className="features-header">{plan.featuresHeader}</p>}
                <ul className="features-list">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="feature-item">
                      <svg className="checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-footer">
                <button 
                  onClick={() => handleCheckout(plan.title, plan.price)}
                  className={`cta-button ${plan.isPopular ? 'pro-gradient-btn' : plan.isCurrent ? 'current-plan-btn' : 'standard-btn'}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="status-banner">
        <div className="status-banner-content">
          <span className="status-title">Current Plan Status</span>
          <span className="status-desc">You are currently on the Free Trial plan.</span>
        </div>
      </div>

      {/* Management Infrastructure Layout */}
      <div className="management-layout">
        
        {/* Payment Methods Section */}
        <div className="payment-method-panel">
          <h4 className="panel-title-text">Payment Method Management</h4>
          <div className="card-logos-container">
            <span className="card-badge visa-brand">VISA</span>
            <span className="card-badge mc-brand">
              <span className="mc-circle red-c"></span>
              <span className="mc-circle yellow-c"></span>
              <span className="mc-text">mastercard</span>
            </span>
            <span className="card-badge amex-brand">AMEX</span>
            <span className="card-badge discover-brand">DISCOVER</span>
          </div>
          <button className="panel-link-btn">Edit Billing Info</button>
        </div>

        {/* Persistent Table Layout Billing History Section */}
        <div className="billing-history-panel">
          <div className="panel-header-inline">
            <h4 className="panel-title-text">Billing History</h4>
            <button className="panel-link-btn grey-link">Edit Billing Info</button>
          </div>

          <div className="table-responsive-container">
            <table className="history-data-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-table-row-cell">
                      <div className="empty-history-state">
                        <div className="empty-icon-circle"></div>
                        <p className="empty-title-msg">No transactions yet</p>
                        <p className="empty-sub-msg">Your invoices will appear here once you make your first transaction.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice, index) => (
                    <tr key={index}>
                      <td className="invoice-bold-id">{invoice.id}</td>
                      <td className="invoice-date-text">{invoice.date}</td>
                      <td className="invoice-bold-id">{invoice.amount}</td>
                      <td><span className="paid-badge-label">{invoice.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payment;