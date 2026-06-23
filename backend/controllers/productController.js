import {
  getProductById,
  updateInventoryStatus
} from "../services/shopify.js";

import {
  executeQuery
} from "../database.js";


const getProducts = async (
  req,
  res
) => {
  try{
    const products = await executeQuery(
      "SELECT * FROM products ORDER BY created_at DESC"
    );

    res.json({
      success:true,
      products
    });
  }
  catch(error){
    console.error(
      "Get Products Error:",
      error
    );

    res.status(500).json({
      success:false,
      message:"Unable to fetch products"
    });
  }
};


const getProduct = async (
  req,
  res
) => {
  try{
    const {
      id
    } = req.params;

    const product = await executeQuery(
      "SELECT * FROM products WHERE id=?",
      [id]
    );

    if(product.length === 0){
      return res.status(404).json({
        success:false,
        message:"Product not found"
      });
    }

    res.json({
      success:true,
      product:product[0]
    });
  }
  catch(error){
    console.error(
      "Get Product Error:",
      error
    );

    res.status(500).json({
      success:false,
      message:"Unable to fetch product"
    });
  }
};


const syncProductFromShopify = async (
  req,
  res
) => {
  try{
    const {
      productId
    } = req.body;

    const product = await getProductById(
      productId
    );

    const variant = product.variants.nodes[0];

    await executeQuery(
      `
      INSERT INTO products
      (
        shopify_product_id,
        variant_id,
        title,
        image,
        price,
        inventory_quantity,
        status
      )
      VALUES(?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
      title=?,
      image=?,
      price=?,
      inventory_quantity=?,
      status=?
      `,
      [
        product.id,
        variant.id,
        product.title,
        product.featuredImage?.url,
        variant.price,
        variant.inventoryQuantity,
        variant.inventoryQuantity > 0
        ?
        "in_stock"
        :
        "out_of_stock",

        product.title,
        product.featuredImage?.url,
        variant.price,
        variant.inventoryQuantity,
        variant.inventoryQuantity > 0
        ?
        "in_stock"
        :
        "out_of_stock"
      ]
    );

    res.json({
      success:true,
      message:"Product synced successfully"
    });
  }
  catch(error){
    console.error(
      "Sync Product Error:",
      error
    );

    res.status(500).json({
      success:false,
      message:"Product sync failed"
    });
  }
};


const updateProductInventory = async (
  req,
  res
) => {
  try{
    const {
      variantId
    } = req.body;

    const inventory = await updateInventoryStatus(
      variantId
    );

    const status = inventory > 0
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
        inventory,
        status,
        variantId
      ]
    );

    res.json({
      success:true,
      inventory,
      status
    });
  }
  catch(error){
    console.error(
      "Inventory Update Error:",
      error
    );

    res.status(500).json({
      success:false,
      message:"Inventory update failed"
    });
  }
};


export {
  getProducts,
  getProduct,
  syncProductFromShopify,
  updateProductInventory
};

