import {
  executeQuery
} from "../database.js";


const createSubscriber = async (
  req,
  res
) => {
  try{
    const {
      email,
      productId,
      variantId,
      productName,
      productImage,
      price
    } = req.body;

    if(!email || !productId){
      return res.status(400).json({
        success:false,
        message:"Email and product are required"
      });
    }

    const existingSubscriber = await executeQuery(
      `
      SELECT *
      FROM subscribers
      WHERE email=? AND product_id=?
      `,
      [
        email,
        productId
      ]
    );

    if(existingSubscriber.length > 0){
      return res.json({
        success:false,
        message:"You are already subscribed for this product"
      });
    }

    await executeQuery(
      `
      INSERT INTO subscribers
      (
        email,
        product_id,
        variant_id,
        status
      )
      VALUES(?,?,?,'pending')
      `,
      [
        email,
        productId,
        variantId
      ]
    );

    res.json({
      success:true,
      message:"You will be notified when product is back in stock"
    });
  }
  catch(error){
    console.error(
      "Create Subscriber Error:",
      error
    );

    res.status(500).json({
      success:false,
      message:"Unable to subscribe"
    });
  }
};


const getSubscribers = async (
  req,
  res
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
      LEFT JOIN products
      ON subscribers.product_id = products.id
      ORDER BY subscribers.created_at DESC
      `
    );

    res.json({
      success:true,
      subscribers
    });
  }
  catch(error){
    console.error(
      "Get Subscribers Error:",
      error
    );

    res.status(500).json({
      success:false,
      message:"Unable to fetch subscribers"
    });
  }
};


const getProductSubscribers = async (
  req,
  res
) => {
  try{
    const {
      productId
    } = req.params;

    const subscribers = await executeQuery(
      `
      SELECT *
      FROM subscribers
      WHERE product_id=?
      AND status='pending'
      `,
      [

        productId
      ]
    );

    res.json({
      success:true,
      subscribers
    });
  }
  catch(error){
    console.error(
      "Product Subscribers Error:",
      error
    );

    res.status(500).json({
      success:false,
      message:"Unable to get subscribers"
    });
  }
};


const updateSubscriberStatus = async (
  req,
  res
) => {
  try{
    const {
      id
    } = req.params;

    const {
      status
    } = req.body;

    await executeQuery(
      `
      UPDATE subscribers
      SET status=?
      WHERE id=?
      `,
      [
        status,
        id
      ]
    );

    res.json({
      success:true,
      message:"Subscriber status updated"
    });
  }
  catch(error){
    console.error(
      "Update Subscriber Error:",
      error
    );

    res.status(500).json({
      success:false,
      message:"Status update failed"
    });
  }
};


const deleteSubscriber = async (
  req,
  res
) => {
  try{
    const {
      id
    } = req.params;

    await executeQuery(
      `
      DELETE FROM subscribers
      WHERE id=?
      `,
      [
        id
      ]
    );

    res.json({
      success:true,
      message:"Subscriber deleted"
    });
  }
  catch(error){
    console.error(
      "Delete Subscriber Error:",
      error
    );

    res.status(500).json({
      success:false,
      message:"Delete failed"
    });
  }
};


export {
  createSubscriber,
  getSubscribers,
  getProductSubscribers,
  updateSubscriberStatus,
  deleteSubscriber
};

