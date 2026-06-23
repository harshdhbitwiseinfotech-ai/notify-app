import {
  executeQuery
} from "../database.js";

import {
  sendBackInStockEmail
} from "../email.js";

import {
  getProductById
} from "../shopify.js";


const inventoryUpdateWebhook = async (
  req,
  res
) => {
  try{
    const webhookData = req.body;

    const variantId = webhookData.inventory_item_id;

    const availableQuantity = webhookData.available || 0;

    const status = availableQuantity > 0
    ?
    "in_stock"
    :
    "out_of_stock";

    await executeQuery(
      `
      UPDATE products
      SET
      inventory_quantity=?,
      status=?
      WHERE variant_id=?
      `,
      [
        availableQuantity,
        status,
        variantId
      ]
    );

    if(status === "in_stock"){
      await notifySubscribers(variantId);
    }

    res.status(200).json({
      success:true,
      message:"Inventory webhook processed"
    });
  }
  catch(error){
    console.error(
      "Inventory Webhook Error:",
      error
    );

    res.status(500).json({
      success:false,
      message:"Webhook processing failed"
    });
  }
};


const notifySubscribers = async (
  variantId
) => {
  try{
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
      WHERE subscribers.variant_id=?
      AND subscribers.status='pending'
      `,
      [
        variantId
      ]
    );

    for(
      const subscriber of subscribers
    ){
      await sendBackInStockEmail({
        email:subscriber.email,
        productName:subscriber.title,
        productImage:subscriber.image,
        price:subscriber.price,
        productUrl:`${process.env.CLIENT_URL}/products/${subscriber.product_id}`,
        buyUrl:`${process.env.CLIENT_URL}/cart/${subscriber.variant_id}:1`
      });

      await executeQuery(
        `
        UPDATE subscribers
        SET
        status='notified',
        notified_at=CURRENT_TIMESTAMP
        WHERE id=?
        `,
        [
          subscriber.id
        ]
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
          subscriber.id,
          subscriber.product_id,
          subscriber.email,
          "Product Back In Stock",
          "sent"
        ]
      );
    }
  }
  catch(error){
    console.error(
      "Subscriber Notification Error:",
      error
    );
  }
};


const createWebhookLog = async (
  req,
  res
) => {
  try{
    const {
      shopDomain,
      webhookType,
      webhookId
    } = req.body;

    await executeQuery(
      `
      INSERT INTO webhooks
      (
        shop_domain,
        webhook_type,
        webhook_id,
        status
      )
      VALUES(?,?,?,'active')
      `,
      [
        shopDomain,
        webhookType,
        webhookId
      ]
    );

    res.json({
      success:true,
      message:"Webhook saved"
    });
  }
  catch(error){
    console.error(
      "Webhook Log Error:",
      error
    );

    res.status(500).json({
      success:false,
      message:"Webhook log failed"
    });
  }
};


export {
  inventoryUpdateWebhook,
  createWebhook
};

