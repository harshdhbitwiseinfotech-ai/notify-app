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
    const info = await transporter.sendMail({
      from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return {
      success: true,
      message: "Email sent successfully",
      id: info.messageId,
    };
  } catch (error) {
    console.error("Email Sending Error:", error.message);

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
  <h1>
    Welcome To ${storeName}
  </h1>

  <p>
    Hello ${customerName},
  </p>

  <p>
    Thank you for joining our back in stock notification service.
  </p>

  <a href="${storeUrl}">
    Continue Shopping
  </a>
  `;

  return await sendEmail({
    to: email,
    subject: "Welcome To Our Store",
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
  <div style="font-family:Arial">
    <h2>
      ${productName} is Back In Stock 🎉
    </h2>

    <img 
      src="${productImage}"
      width="250"
    />

    <h3>
      ${productName}
    </h3>

    <p>
      Price: ${price}
    </p>

    <a href="${productUrl}">
      Add To Cart
    </a>

    <br/><br/>

    <a href="${buyUrl}">
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

const sendBulkEmails = async (subscribers, product) => {
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

    results.push(result);
  }

  return results;
};

export {
  sendEmail,
  sendWelcomeEmail,
  sendBackInStockEmail,
  sendBulkEmails,
};
