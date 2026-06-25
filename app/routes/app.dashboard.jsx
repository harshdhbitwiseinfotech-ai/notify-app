import React, { useEffect, useState } from "react";
import "../routes/styles/dashboard.css";

const Dashboard = () => {
  const currentYear = new Date().getFullYear(); // 2026
  const storeStartYear = 2022;

  const [selectedProduct, setSelectedProduct] = useState("all");
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [distributionFilter, setDistributionFilter] = useState("Country");
  const [bestsellerLimit, setBestsellerLimit] = useState(50);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [distribution, setDistribution] = useState([]);

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

  // Assigned unique static colors to render custom chart lines per product
  const fallbackProducts = [
    { id: 1, productName: "iPhone 15 Pro Max", status: "Sold out", qtySold: 217, unitPrice: 1199.00, dateAdded: "Nov 5, 2025", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVrT-Koh0dFEzPeapoXciMtLYol5DLYWC8ZB50_oJvEg&s=10", color: "#3b82f6" },
    { id: 2, productName: "Sony Playstation 5", status: "Sold out", qtySold: 320, unitPrice: 499.99, dateAdded: "Feb 11, 2026", image: "https://5.imimg.com/data5/SELLER/Default/2024/1/377032299/SF/DM/SY/205189144/sony-playstation-ps5-video-game-console-digital-edition-playstation-5-500x500.jpg", color: "#d946ef" },
    { id: 3, productName: "M2 Macbook Air 15 inch", status: "Sold out", qtySold: 147, unitPrice: 999.99, dateAdded: "Sept 23, 2025", image: "https://cdn.arstechnica.net/wp-content/uploads/2023/06/IMG_1134.jpeg", color: "#06b6d4" },
    { id: 4, productName: "iPad Pro M4", status: "In Stock", qtySold: 95, unitPrice: 999.00, dateAdded: "Jan 15, 2026", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH0BMhdITOQXGNUtxPDQ5BzUEHNvw9O4m_J2P2v8Q9Ig&s=10", color: "#10b981" }
  ];

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
      const extendedProds = data.products.map((p, i) => ({
        ...p,
        color: p.color || ["#3b82f6", "#d946ef", "#06b6d4", "#10b981", "#f59e0b"][i % 5]
      }));
      setProducts(extendedProds.sort((a, b) => (b.qtySold * b.unitPrice) - (a.qtySold * a.unitPrice)));
    } catch (error) {
      console.error("Using local fallback data:", error);
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

  // Curated curve configurations representing different unique monthly performance timelines
  const productPaths = {
    1: { line: "M0,90 C50,60 70,30 120,40 C170,50 200,110 250,95 C300,80 350,20 400,35 C450,50 480,15 500,20", fill: "M0,90 C50,60 70,30 120,40 C170,50 200,110 250,95 C300,80 350,20 400,35 C450,50 480,15 500,20 L500,150 L0,150 Z" },
    2: { line: "M0,110 C40,120 80,70 120,80 C160,90 210,40 250,55 C290,70 340,120 400,100 C460,80 480,45 500,50", fill: "M0,110 C40,120 80,70 120,80 C160,90 210,40 250,55 C290,70 340,120 400,100 C460,80 480,45 500,50 L500,150 L0,150 Z" },
    3: { line: "M0,60 C60,80 90,120 130,110 C170,100 220,50 260,70 C300,90 330,40 380,30 C430,20 470,85 500,90", fill: "M0,60 C60,80 90,120 130,110 C170,100 220,50 260,70 C300,90 330,40 380,30 C430,20 470,85 500,90 L500,150 L0,150 Z" },
    4: { line: "M0,130 C40,90 90,60 140,85 C190,110 230,120 280,75 C330,30 380,65 420,50 C460,35 480,105 500,100", fill: "M0,130 C40,90 90,60 140,85 C190,110 230,120 280,75 C330,30 380,65 420,50 C460,35 480,105 500,100 L500,150 L0,150 Z" }
  };

  const storeTotalPath = {
    line: "M0,50 C40,35 80,65 120,45 C160,25 200,85 250,30 C300,-5 360,55 400,25 C440,-5 470,25 500,15",
    fill: "M0,50 C40,35 80,65 120,45 C160,25 200,85 250,30 C300,-5 360,55 400,25 C440,-5 470,25 500,15 L500,150 L0,150 Z"
  };

  const isAll = selectedProduct === "all";
  const currentYAxis = isAll ? ["$50k", "$40k", "$30k", "$20k", "$10k", "0"] : ["$15k", "$12k", "$9k", "$6k", "$3k", "0"];
  const currentLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartSubtitle = isAll ? `Overall sales tracking performance inside ${selectedYear}` : `${activeProducts.find(p => p.id === parseInt(selectedProduct))?.productName || 'Product'} sales trend (${selectedYear})`;

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
              <p className="panel-subtitle">{chartSubtitle}</p>
            </div>
            <div className="panel-actions">
              <select 
                className="dropdown-select filter-spacing" 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {yearOptions.map(yr => <option key={yr} value={yr}>{yr}</option>)}
              </select>

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
              
              <button className="expand-btn" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? "✕" : "⤢"}
              </button>
            </div>
          </div>
          
          <div className="mock-chart-container-with-axis">
            <div className="price-y-axis">
              {currentYAxis.map((val, idx) => <span key={idx}>{val}</span>)}
            </div>
            
            <div className="chart-visual-wrapper">
              <svg viewBox="0 -15 500 165" className="chart-svg" preserveAspectRatio="none">
                <defs>
                  {activeProducts.map(p => (
                    <linearGradient id={`grad-${p.id}`} x1="0" y1="0" x2="0" y2="1" key={p.id}>
                      <stop offset="0%" stopColor={p.color} stopOpacity="0.25"/>
                      <stop offset="100%" stopColor={p.color} stopOpacity="0.0"/>
                    </linearGradient>
                  ))}
                  <linearGradient id="grad-store-total" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>

                {isAll ? (
                  <>
                    {/* Render all individual translucent backgrounds behind when 'All' is active */}
                    {activeProducts.map(p => {
                      const pathConf = productPaths[p.id] || productPaths[1];
                      return <path d={pathConf.fill} fill={`url(#grad-${p.id})`} key={`fill-${p.id}`} />;
                    })}
                    <path d={storeTotalPath.fill} fill="url(#grad-store-total)" />

                    {/* Display intersecting colored lines matching reference picture layout */}
                    {activeProducts.map(p => {
                      const pathConf = productPaths[p.id] || productPaths[1];
                      return (
                        <path 
                          d={pathConf.line} 
                          fill="none" 
                          stroke={p.color} 
                          strokeWidth="1.8" 
                          strokeLinecap="round" 
                          key={`line-${p.id}`}
                        />
                      );
                    })}

                    {/* Bold Master Store Total Line Accent */}
                    <path d={storeTotalPath.line} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    {/* Isolated selection view displaying just 1 selected dynamic trend block */}
                    <path 
                      d={productPaths[parseInt(selectedProduct)]?.fill || productPaths[1].fill} 
                      fill={`url(#grad-${selectedProduct})`} 
                    />
                    <path 
                      d={productPaths[parseInt(selectedProduct)]?.line || productPaths[1].line} 
                      fill="none" 
                      stroke={activeProducts.find(p => p.id === parseInt(selectedProduct))?.color || "#3b82f6"} 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                    />
                  </>
                )}
              </svg>
              <div className="chart-timeline-labels">
                {currentLabels.map((lbl, idx) => <span key={idx}>{lbl}</span>)}
              </div>
            </div>
          </div>

          {/* Quick interactive map key legend indicator shown during multi-line view */}
          {isAll && (
            <div className="chart-legend-row">
              <div className="legend-item"><span className="legend-dot" style={{ backgroundColor: "#4f46e5" }}></span>Total Store Revenue</div>
              {activeProducts.map(p => (
                <div className="legend-item" key={p.id}>
                  <span className="legend-dot" style={{ backgroundColor: p.color }}></span>{p.productName}
                </div>
              ))}
            </div>
          )}
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
                    <span className="product-txt-title" style={{ borderLeft: `3px solid ${product.color}`, paddingLeft: "8px" }}>
                      {product.productName}
                    </span>
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