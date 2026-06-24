import React, { useState } from 'react';
import "../routes/styles/payment.css";

const Payment = () => {
  // State tracking dynamic invoice simulation (starts empty for first-time installation layout)
  const [invoices, setInvoices] = useState([]);
  const [isAnnual, setIsAnnual] = useState(true);

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

  // Simulated handler for capturing fresh transaction records
  const handleTransaction = (planTitle, basePrice) => {
    if (planTitle === "Free") return;

    const priceNum = isAnnual ? parseInt(basePrice.replace('$', '')) * 12 * 0.8 : parseInt(basePrice.replace('$', ''));
    const formattedAmount = `$${priceNum.toFixed(2)}`;

    const newInvoice = {
      id: `30000${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: formattedAmount,
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

        {/* Dynamic Billing Cycle Toggle Switch */}
        <div className="toggle-container">
          <span className="toggle-label">Monthly billing</span>
          <button 
            type="button" 
            className={`toggle-switch ${isAnnual ? 'active' : ''}`} 
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <span className="toggle-handle"></span>
          </button>
          <span className="toggle-label active-label">
            Annual billing <span className="save-badge">Save 20%</span>
          </span>
        </div>
      </header>

      {/* Plan Grid Section */}
      <div className="pricing-grid">
        {plans.map((plan, index) => {
          // Adjust display text dynamically based on selection cycles
          let displayPrice = plan.price;
          if (isAnnual && plan.price !== "$0") {
            const analyticalPrice = parseInt(plan.price.replace('$', '')) * 0.8;
            displayPrice = `$${Math.floor(analyticalPrice)}`;
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
                
                {plan.price ? (
                  <div className="price-container">
                    <span className="plan-price">{displayPrice}</span>
                    <span className="plan-period">{plan.period}</span>
                  </div>
                ) : (
                  <div className="price-spacer"></div>
                )}

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
                  onClick={() => handleTransaction(plan.title, plan.price)}
                  className={`cta-button ${plan.isPopular ? 'pro-gradient-btn' : plan.isCurrent ? 'current-plan-btn' : 'standard-btn'}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Info Bar */}
      <div className="status-banner">
        <div className="status-banner-content">
          <span className="status-title">Current Plan Status</span>
          <span className="status-desc">You are currently on the Free Trial plan.</span>
        </div>
      </div>

      {/* Billing Infrastructure Blocks */}
      <div className="management-layout">
        <div className="payment-method-panel">
          <h4 className="panel-title-text">Payment Method Management</h4>
          <div className="card-logos">
            <span className="logo-card-item"><i className="fa-brands fa-cc-visa"></i></span>
            <span className="logo-card-item"><i className="fa-brands fa-cc-mastercard"></i></span>
            <span className="logo-card-item"><i className="fa-brands fa-cc-discover"></i></span>
            <span className="logo-card-item"><i className="fa-brands fa-cc-diners-club"></i></span>
          </div>
          <button className="panel-link-btn"><i className="fa-solid fa-pen-to-square"></i> Edit Billing Info</button>
        </div>

        <div className="billing-history-panel">
          <div className="panel-header-inline">
            <h4 className="panel-title-text">Billing History</h4>
            <button className="panel-link-btn grey-link"><i className="fa-solid fa-pencil"></i> Edit Billing Info</button>
          </div>

          {/* Conditional state display container */}
          {invoices.length === 0 ? (
            <div className="empty-history-state">
              <div className="empty-icon-circle">
                <i className="fa-solid fa-receipt"></i>
              </div>
              <p className="empty-title-msg">No transactions yet</p>
              <p className="empty-sub-msg">Your invoices will appear here once you make your first transaction.</p>
            </div>
          ) : (
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
                  {invoices.map((invoice, index) => (
                    <tr key={index}>
                      <td className="invoice-bold-id">{invoice.id}</td>
                      <td className="invoice-date-text">{invoice.date}</td>
                      <td className="invoice-bold-id">{invoice.amount}</td>
                      <td><span className="paid-badge-label">{invoice.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;