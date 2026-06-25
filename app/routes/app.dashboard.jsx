import React, { useEffect, useState } from "react";
import "../routes/styles/dashboard.css";

const Dashboard = () => {
  const currentYear = new Date().getFullYear(); // Will dynamically compute to 2026
  const storeStartYear = 2022;

  // New filters and state logic
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [distributionFilter, setDistributionFilter] = useState("Country");
  const [bestsellerLimit, setBestsellerLimit] = useState(50);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [distribution, setDistribution] = useState([]);

  // Default fallback data
  const fallbackStats = {
    grossProfit: { total: "$1,020,456", percentage: "+21.2%", subText: "+$216,428 this month", isPositive: true },
    netProfit: { total: "$320,179", percentage: "+16.4%", subText: "+$52,518 this month", isPositive: true },
    ordersCompleted: { total: "12.5k", percentage: "+62%", subText: "+7.7k this month", isPositive: true },
    storeVisits: { total: "1.6m", percentage: "-11.2%", subText: "-182.7k this month", isPositive: false }
  };

  const fallbackDistribution = [
    { country: "United States (USA)", flag: "🇺🇸", visits: "732.8k", percentage: 45.8 },
    { country: "United Kingdom (UK)", flag: "🇬🇧", visits: "385.6k", percentage: 24.1 },
    { country: "Canada", flag: "🇨🇦", visits: "249.6k", percentage: 15.6 },
    { country: "Nigeria", flag: "🇳🇬", visits: "150.4k", percentage: 9.4 },
    { country: "Others", flag: "🌐", visits: "81.6k", percentage: 5.1 }
  ];

  const fallbackProducts = [
    { id: 1, productName: "iPhone 15 Pro Max", status: "Sold out", qtySold: 217, unitPrice: 1199.00, dateAdded: "Nov 5, 2025", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=80&auto=format&fit=crop&q=60" },
    { id: 2, productName: "Sony Playstation 5", status: "Sold out", qtySold: 320, unitPrice: 499.99, dateAdded: "Feb 11, 2026", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=80&auto=format&fit=crop&q=60" },
    { id: 3, productName: "M2 Macbook Air 15 inch", status: "Sold out", qtySold: 147, unitPrice: 999.99, dateAdded: "Sept 23, 2025", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&auto=format&fit=crop&q=60" },
    { id: 4, productName: "iPad Pro M4", status: "In Stock", qtySold: 95, unitPrice: 999.00, dateAdded: "Jan 15, 2026", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=80&auto=format&fit=crop&q=60" }
  ];

  // Generate Year Options list dynamically from creation threshold up to 2026
  const yearOptions = [];
  for (let y = currentYear; y >= storeStartYear; y--) {
    yearOptions.push(y);
  }

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard/analytics");
      const data = await res.json();
      setStats(data.stats);
      setDistribution(data.distribution);
      const sortedProducts = data.products.sort((a, b) => (b.qtySold * b.unitPrice) - (a.qtySold * a.unitPrice));
      setProducts(sortedProducts);
    } catch (error) {
      console.error("Using local fallback data. Server connection skipped/idle:", error);
      setStats(fallbackStats);
      setDistribution(fallbackDistribution);
      setProducts(fallbackProducts.sort((a, b) => (b.qtySold * b.unitPrice) - (a.qtySold * a.unitPrice)));
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const triggerLiveSaleSimulation = async (productId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/dashboard/sale/${productId}`, { method: "POST" });
      if (res.ok) fetchDashboardData();
    } catch (error) {
      setProducts(prevProducts => {
        const updated = prevProducts.map(p => p.id === productId ? { ...p, qtySold: p.qtySold + 15 } : p);
        return updated.sort((a, b) => (b.qtySold * b.unitPrice) - (a.qtySold * a.unitPrice));
      });
    }
  };

  const renderMetricIcon = (key) => {
    switch(key) {
      case 'grossProfit':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        );
      case 'netProfit':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="2" y1="10" x2="22" y2="10"></line>
            <circle cx="12" cy="12" r="2"></circle>
            <path d="M6 14h.01M18 14h.01"></path>
          </svg>
        );
      case 'ordersCompleted':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        );
      case 'storeVisits':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  const activeStats = stats || fallbackStats;
  const activeDistribution = distribution.length > 0 ? distribution : fallbackDistribution;
  const activeProducts = products.length > 0 ? products : fallbackProducts;

  // Compute dynamic chart details based on selected product filter
  const getChartConfiguration = () => {
    if (selectedProduct === "all") {
      return {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        yAxis: ["$50k", "$40k", "$30k", "$20k", "$10k", "0"],
        svgPath: "M0,60 Q50,30 100,70 T200,50 T300,90 T400,60 T500,45 L500,150 L0,150 Z",
        linePath: "M0,60 Q50,30 100,70 T200,50 T300,90 T400,60 T500,45",
        subtitle: `All products monthly trend inside ${selectedYear}`
      };
    } else {
      const prodId = parseInt(selectedProduct);
      const targetObj = activeProducts.find(p => p.id === prodId);
      const name = targetObj ? targetObj.productName : "Product";
      return {
        labels: ["Q1 Growth", "Q2 Growth", "Q3 Growth", "Q4 Growth"],
        yAxis: ["$15k", "$12k", "$9k", "$6k", "$3k", "0"],
        svgPath: "M0,100 Q125,40 250,80 T500,30 L500,150 L0,150 Z",
        linePath: "M0,100 Q125,40 250,80 T500,30",
        subtitle: `${name} performance stats for ${selectedYear}`
      };
    }
  };

  const chartConfig = getChartConfiguration();

  return (
    <div className="dashboard-container">
      
      {/* 4-COLUMN UPPER METRICS */}
      <div className="metrics-grid">
        {Object.entries(activeStats).map(([key, value]) => (
          <div className="metric-card" key={key}>
            <div className="card-top-row">
              <div className={`metric-icon-circle accent-${key}`}>
                {renderMetricIcon(key)}
              </div>
              <span className={`percentage-pill ${value.isPositive ? "pos" : "neg"}`}>
                {value.percentage}
              </span>
            </div>
            <p className="metric-label">{key.replace(/([A-Z])/g, ' $1')}</p>
            <h2 className="metric-value">{value.total}</h2>
            <p className={`metric-subtext ${value.isPositive ? "txt-pos" : "txt-neg"}`}>
              {value.subText}
            </p>
          </div>
        ))}
      </div>

      {/* GRAPH & DISTRIBUTION ROW */}
      <div className="analytics-split-row">
        
        {/* Sales Chart Section */}
        <div className={`chart-panel-card ${isFullscreen ? "fullscreen-panel" : ""}`}>
          <div className="panel-header">
            <div>
              <h3>Sales</h3>
              <p className="panel-subtitle">{chartConfig.subtitle}</p>
            </div>
            <div className="panel-actions">
              {/* Year Filtering Select */}
              <select 
                className="dropdown-select filter-spacing" 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {yearOptions.map(yr => <option key={yr} value={yr}>{yr}</option>)}
              </select>

              {/* Dynamic Product Select Option Box */}
              <select 
                className="dropdown-select" 
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="all">All products</option>
                {activeProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.productName}</option>
                ))}
              </select>
              
              {/* Functional Fullscreen Toggle Action Button */}
              <button className="expand-btn" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? "✕" : "⤢"}
              </button>
            </div>
          </div>
          
          <div className="mock-chart-container-with-axis">
            <div className="price-y-axis">
              {chartConfig.yAxis.map((val, idx) => <span key={idx}>{val}</span>)}
            </div>
            
            <div className="chart-visual-wrapper">
              {/* Added safe internal top padding via view boundaries adjustments */}
              <svg viewBox="0 -10 500 160" className="chart-svg" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                <path d={chartConfig.svgPath} fill="url(#chart-grad)" />
                <path d={chartConfig.linePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <div className="chart-timeline-labels">
                {chartConfig.labels.map((lbl, idx) => <span key={idx}>{lbl}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Customers Distribution */}
        <div className="distribution-panel-card">
          <div className="panel-header">
            <div>
              <h3>Customers Distribution</h3>
              <p className="panel-subtitle">1.6m visits this month</p>
            </div>
            <select className="dropdown-select-pill" value={distributionFilter} readOnly>
              <option value="Country">Country</option>
            </select>
          </div>

          <div className="distribution-list">
            {activeDistribution.map((item, index) => (
              <div className="distribution-row-item" key={index}>
                <div className="country-identity">
                  <span className="flag-icon">{item.flag}</span>
                  <span className="country-name-lbl">{item.country}</span>
                </div>
                <div className="progress-bar-track-wrapper">
                  <div className="progress-fill-bar" style={{ width: `${item.percentage}%` }}></div>
                </div>
                <div className="metric-percentage-data">
                  <strong>{item.visits}</strong> <span>({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BESTSELLERS TABLE */}
      <div className="bestsellers-table-section">
        <div className="panel-header-table">
          <div>
            <h3>Bestsellers</h3>
            <p className="panel-subtitle">Customers favourites, right here!</p>
          </div>
          <div className="table-controls-wrapper">
            <button className="download-data-btn">📥 Download data</button>
            <select 
              className="dropdown-select limit-select"
              value={bestsellerLimit}
              onChange={(e) => setBestsellerLimit(Number(e.target.value))}
            >
              <option value={50}>Top 50</option>
              <option value={25}>Top 25</option>
              <option value={10}>Top 10</option>
            </select>
          </div>
        </div>

        <table className="modern-data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Status</th>
              <th>Qty Sold</th>
              <th>Unit Price</th>
              <th>Total Revenue</th>
              <th>Date Added</th>
              <th style={{ textAlign: "center" }}>Simulate Checkout</th>
            </tr>
          </thead>
          <tbody>
            {activeProducts.slice(0, bestsellerLimit).map((product) => {
              const totalRevenue = product.qtySold * product.unitPrice;
              return (
                <tr key={product.id}>
                  <td className="product-identity-cell">
                    <img src={product.image} alt={product.productName} className="prod-thumb" />
                    <span className="product-txt-title">{product.productName}</span>
                  </td>
                  <td>
                    <span className={`status-pill-badge ${product.status.toLowerCase().replace(/\s+/g, "-")}`}>
                      • {product.status}
                    </span>
                  </td>
                  <td className="numeric-font">{product.qtySold}</td>
                  <td className="numeric-font">${product.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="numeric-font weight-bold">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="date-font-style">{product.dateAdded}</td>
                  <td style={{ textAlign: "center" }}>
                    <button className="sale-trigger-action-btn" onClick={() => triggerLiveSaleSimulation(product.id)}>
                      🛒 Purchase Item
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Dashboard;