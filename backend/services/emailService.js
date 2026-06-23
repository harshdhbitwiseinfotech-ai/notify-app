import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const result = await transporter.sendMail({
      from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return {
      success: true,
      message: "Email sent successfully",
      messageId: result.messageId,
    };
  } catch (error) {
    console.error("Email Service Error:", error.message);

    return {
      success: false,
      message: "Email sending failed",
    };
  }
};

const sendWelcomeEmail = async ({
  email,
  customerName,
  storeName,
  storeUrl,
}) => {
  const html = `
  <div style="font-family:Arial,sans-serif;">
    <h1>Welcome ${customerName}</h1>

    <p>
      Thank you for joining ${storeName}
      back in stock notifications.
    </p>

    <p>
      We will notify you automatically
      when your favorite products are available.
    </p>

    <a href="${storeUrl}">Continue Shopping</a>
  </div>
  `;

  return await sendEmail({
    to: email,
    subject: "Welcome To Stock Notify",
    html,
  });
};

const sendBackInStockEmail = async ({
  email,
  productName,
  productImage,
  price,
  productUrl,
  buyUrl,
}) => {
  const html = `
  <div style="font-family:Arial,sans-serif;text-align:center;">
    <h2>${productName} is Back In Stock 🎉</h2>

    <img
      src="${productImage}"
      width="250"
      style="border-radius:12px;"
    />

    <h3>${productName}</h3>

    <p>Price: ${price}</p>

    <p>
      Good news! The product you were waiting for
      is available again.
    </p>

    <a
      href="${productUrl}"
      style="background:#008060;color:white;padding:12px 25px;text-decoration:none;border-radius:8px;"
    >
      Add To Cart
    </a>

    <br/><br/>

    <a
      href="${buyUrl}"
      style="background:#111827;color:white;padding:12px 25px;text-decoration:none;border-radius:8px;"
    >
      Buy Now
    </a>
  </div>
  `;

  return await sendEmail({
    to: email,
    subject: `${productName} is back in stock`,
    html,
  });
};

const sendNotificationEmails = async (subscribers, product) => {
  const results = [];

  for (const subscriber of subscribers) {
    const result = await sendBackInStockEmail({
      email: subscriber.email,
      productName: product.title,
      productImage: product.image,
      price: product.price,
      productUrl: product.url,
      buyUrl: product.buyUrl,
    });

    results.push({
      email: subscriber.email,
      result,
    });
  }

  return results;
};

const verifyEmailConnection = async () => {
  try {
    await transporter.verify();

    return {
      success: true,
      message: "Email service connected",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export {
  sendEmail,
  sendWelcomeEmail,
  sendBackInStockEmail,
  sendNotificationEmails,
  verifyEmailConnection,
};


