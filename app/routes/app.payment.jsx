import React from 'react';
import "../routes/styles/payment.css";

const Payment = () => {
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
      buttonText: "Get Started",
      isPopular: false
    },
    {
      title: "Pro",
      description: "Complete back-in-stock management and automation.",
      price: "$299",
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
      buttonText: "Get Started",
      isPopular: true
    },
    {
      title: "Enterprise",
      description: "Custom solutions for large-scale operations and digital pratices.",
      price : "Custom Price",
    //   period: "/ Monthly",
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

  return (
    <div className="pricing-page-wrapper">
      <header className="pricing-header">
        <h1 className="main-heading">Bring Your Buyers Back</h1>
        <p className="sub-heading">
          Simple, automated back-in-stock alerts that capture high-intent buyers, build your email list, and automatically recover missed revenue.
        </p>
      </header>

      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div key={index} className={`pricing-card ${plan.isPopular ? 'popular-card' : ''}`}>
            
            {plan.isPopular && (
              <>
                <div className="popular-badge">Most Popular</div>
                {/* Wrapped background effects into a secure container */}
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
                  <span className="plan-price">{plan.price}</span>
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
              <button className={`cta-button ${plan.isPopular ? 'pro-gradient-btn' : 'standard-btn'}`}>
                {plan.buttonText}
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Payment;