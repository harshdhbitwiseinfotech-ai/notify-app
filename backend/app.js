import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import notifyRoutes from "./routes/notify.js";
import productRoutes from "./routes/products.js";
import subscriberRoutes from "./routes/subscribers.js";
import notificationRoutes from "./routes/notifications.js";
import webhookRoutes from "./routes/webhooks.js";

const app = express();

app.use(
  cors()
);

app.use(
  helmet()
);

app.use(
  morgan("dev")
);

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended:true
  })
);

// Health Check

app.get(
  "/api/status",
  (req,res)=>{
    res.json({
      success:true,
      message:
      "Stock Notify App API is working"

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

// Not Found Handler

app.use(
  (req,res)=>{
    res.status(404).json({
      success:false,
      message:
      "API route not found"

    });
  }
);

// Global Error Handler

app.use(
  (error,req,res,next)=>{
    console.error(
      error
    );
    res.status(500).json({
      success:false,
      message:
      "Something went wrong"

    });
  }
);

export default app;