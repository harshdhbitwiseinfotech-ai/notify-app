import { executeQuery } from "../database.js";
import { sendBackInStockEmail } from "../email.js";

const getPendingSubscribers = async (productId) => {
  try {
    const subscribers = await executeQuery(
      `
      SELECT
        subscribers.*,
        products.title,
        products.image,
        products.price
      FROM subscribers
      JOIN products
        ON subscribers.product_id = products.id
      WHERE subscribers.product_id=?
        AND subscribers.status='pending'
      `,
      [productId]
    );

    return subscribers;
  } catch (error) {
    console.error("Get Pending Subscribers Error:", error);
    throw error;
  }
};

const sendProductBackInStockNotification = async (productId) => {
  try {
    const subscribers = await getPendingSubscribers(productId);

    if (subscribers.length === 0) {
      return {
        success: false,
        message: "No pending subscribers found",
      };
    }

    let sentCount = 0;

    for (const subscriber of subscribers) {
      const emailResult = await sendBackInStockEmail({
        email: subscriber.email,
        productName: subscriber.title,
        productImage: subscriber.image,
        price: subscriber.price,
        productUrl: `${process.env.CLIENT_URL}/products/${productId}`,
        buyUrl: `${process.env.CLIENT_URL}/cart`,
      });

      if (emailResult.success) {
        await updateNotificationStatus(subscriber.id, productId, subscriber.email);
        sentCount++;
      }
    }

    return {
      success: true,
      sent: sentCount,
      message: "Notifications sent successfully",
    };
  } catch (error) {
    console.error("Send Notification Error:", error);
    throw error;
  }
};

const updateNotificationStatus = async (subscriberId, productId, email) => {
  try {
    await executeQuery(
      `
      UPDATE subscribers
      SET
        status='notified',
        notified_at=CURRENT_TIMESTAMP
      WHERE id=?
      `,
      [subscriberId]
    );

    await executeQuery(
      `
      INSERT INTO notifications
        (
          subscriber_id,
          product_id,
          email,
          subject,
          status,
          sent_at
        )
      VALUES(?,?,?,?,?,CURRENT_TIMESTAMP)
      `,
      [
        subscriberId,
        productId,
        email,
        "Product Back In Stock",
        "sent",
      ]
    );

    return true;
  } catch (error) {
    console.error("Update Notification Status Error:", error);
    throw error;
  }
};

const getNotificationHistory = async () => {
  try {
    const notifications = await executeQuery(
      `
      SELECT
        notifications.*,
        products.title
      FROM notifications
      LEFT JOIN products
        ON notifications.product_id = products.id
      ORDER BY notifications.created_at DESC
      `
    );

    return notifications;
  } catch (error) {
    console.error("Get Notification History Error:", error);
    throw error;
  }
};

export {
  getPendingSubscribers,
  sendProductBackInStockNotification,
  updateNotificationStatus,
  getNotificationHistory,
};

