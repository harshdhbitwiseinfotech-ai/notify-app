import React, { useState } from "react";
import "../routes/styles/components.css";


const Sidebar = ({ onSelect }) => {
  const [active, setActive] = useState("dashboard");

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "products", label: "Products", icon: "🛍️" },
    { key: "notifications", label: "Notifications", icon: "🔔" },
    { key: "subscribers", label: "Subscribers", icon: "📧" },
    { key: "settings", label: "Settings", icon: "⚙️" }
  ];

  const handleClick = (key) => {
    setActive(key);
    if (onSelect) onSelect(key);
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        🛒 StockNotify
      </div>

      <div style={styles.menu}>
        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => handleClick(item.key)}
            style={{
              ...styles.item,
              ...(active === item.key ? styles.activeItem : {})
            }}
          >
            <span style={styles.icon}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

// const styles = {
//   sidebar: {
//     width: "240px",
//     height: "100vh",
//     backgroundColor: "#111827",
//     color: "#fff",
//     display: "flex",
//     flexDirection: "column",
//     padding: "20px 0"
//   },

//   logo: {
//     fontSize: "20px",
//     fontWeight: "bold",
//     padding: "0 20px",
//     marginBottom: "30px"
//   },

//   menu: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "8px"
//   },

//   item: {
//     padding: "12px 20px",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     color: "#cbd5e1",
//     transition: "0.2s",
//     borderLeft: "3px solid transparent"
//   },

//   activeItem: {
//     backgroundColor: "#1f2937",
//     color: "#fff",
//     borderLeft: "3px solid #22c55e"
//   },

//   icon: {
//     fontSize: "18px"
//   }
// };

export default Sidebar;