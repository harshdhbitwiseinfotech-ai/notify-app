import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import notifyRoutes from "./routes/notify.js";
import productRoutes from "./routes/products.js";
import subscriberRoutes from "./routes/subscribers.js";
import notificationRoutes from "./routes/notifications.js";
import webhookRoutes from "./routes/webhooks.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin:"*"
  })
);

app.use(
  bodyParser.json()
);

app.use(
  bodyParser.urlencoded({
    extended:true
  })
);

app.get(
  "/",
  (req,res)=>{
    res.json({
      success:true,
      message:
      "Stock Notify API Running"

    });
  }
);

// API Routes

app.use(
  "/api/notify",
  notifyRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/subscribers",
  subscriberRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/webhooks",
  webhookRoutes
);

// Error Handler

app.use(
  (err,req,res,next)=>{
    console.error(
      err
    );
    res.status(500).json({
      success:false,
      message:
      "Internal Server Error"

    });
  }
);

app.listen(
  PORT,
  ()=>{

    console.log(
      `Stock Notify Server running on port ${PORT}`
    );

  }
);







// const express = require("express");
// const cors = require("cors");
// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// let dashboardDatabase = {
//   stats: {
//     grossProfit: { total: "$1,020,456", percentage: "+21.2%", subText: "+$216,428 this month", isPositive: true },
//     netProfit: { total: "$320,179", percentage: "+16.4%", subText: "+$52,518 this month", isPositive: true },
//     ordersCompleted: { total: "12.5k", percentage: "+62%", subText: "+7.7k this month", isPositive: true },
//     storeVisits: { total: "1.6m", percentage: "-11.2%", subText: "-182.7k this month", isPositive: false }
//   },
//   distribution: [
//     { country: "United States (USA)", flag: "🇺🇸", visits: "732.8k", percentage: 45.8 },
//     { country: "United Kingdom (UK)", flag: "🇬🇧", visits: "385.6k", percentage: 24.1 },
//     { country: "Canada", flag: "🇨🇦", visits: "249.6k", percentage: 15.6 },
//     { country: "Nigeria", flag: "🇳🇬", visits: "150.4k", percentage: 9.4 },
//     { country: "Others", flag: "🌐", visits: "81.6k", percentage: 5.1 }
//   ],
//   products: [
//     { id: 1, productName: "iPhone 15 Pro Max", status: "Sold out", qtySold: 217, unitPrice: 1199.00, dateAdded: "Nov 5, 2025", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=80&auto=format&fit=crop&q=60" },
//     { id: 2, productName: "Sony Playstation 5", status: "Sold out", qtySold: 320, unitPrice: 499.99, dateAdded: "Feb 11, 2026", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=80&auto=format&fit=crop&q=60" },
//     { id: 3, productName: "M2 Macbook Air 15 inch", status: "Sold out", qtySold: 147, unitPrice: 999.99, dateAdded: "Sept 23, 2025", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&auto=format&fit=crop&q=60" },
//     { id: 4, productName: "iPad Pro M4", status: "In Stock", qtySold: 95, unitPrice: 999.00, dateAdded: "Jan 15, 2026", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=80&auto=format&fit=crop&q=60" }
//   ]
// };

// // Returns analytics payload immediately without arbitrary loaders
// app.get("/api/dashboard/analytics", (req, res) => {
//   res.json(dashboardDatabase);
// });

// app.post("/api/dashboard/sale/:id", (req, res) => {
//   const productId = parseInt(req.params.id);
//   const product = dashboardDatabase.products.find(p => p.id === productId);
  
//   if (product) {
//     product.qtySold += 15;
//     if (product.qtySold > 350) {
//       product.status = "Sold out";
//     }
//     res.status(200).json({ message: "Sale updated directly", product });
//   } else {
//     res.status(404).json({ message: "Product missing" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Live backend operating immediately on port ${PORT}`);
// });