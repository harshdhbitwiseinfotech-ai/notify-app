import {
  executeQuery
} from "../database.js";

import {
  updateInventoryStatus
} from "../shopify.js";

const checkInventory = async (
  variantId
) => {
  try{
    const inventory =
    await updateInventoryStatus(
      variantId
    );

    return {
      quantity:inventory,
      available:inventory > 0,
      status:inventory > 0
      ?
      "in_stock"
      :
      "out_of_stock"
    };
  }
  catch(error){
    console.error(
      "Inventory Check Error:",
      error
    );

    throw error;
  }
};

const updateProductInventory = async ({
  variantId,
  quantity
}) => {
  try{
    const status =
    quantity > 0
    ?
    "in_stock"
    :
    "out_of_stock";

    await executeQuery(
      `
      UPDATE products
      SET
      inventory_quantity=?,
      status=?,
      updated_at=CURRENT_TIMESTAMP
      WHERE variant_id=?
      `,
      [
        quantity,
        status,
        variantId
      ]
    );

    return {
      success:true,
      quantity,
      status
    };
  }
  catch(error){
    console.error(
      "Update Inventory Error:",
      error
    );

    throw error;
  }
};

const getOutOfStockProducts = async () => {
  try{
    const products =
    await executeQuery(
      `
      SELECT *
      FROM products
      WHERE status='out_of_stock'
      ORDER BY updated_at DESC
      `
    );

    return products;
  }
  catch(error){
    console.error(
      "Get Out Of Stock Products Error:",
      error
    );

    throw error;
  }
};

const getAvailableProducts = async () => {
  try{
    const products =
    await executeQuery(
      `
      SELECT *
      FROM products
      WHERE status='in_stock'
      ORDER BY updated_at DESC
      `
    );

    return products;
  }
  catch(error){
    console.error(
      "Get Available Products Error:",
      error
    );

    throw error;
  }
};

const syncInventory = async (
  variantId
) => {
  try{
    const inventory =
    await checkInventory(
      variantId
    );

    await updateProductInventory({
      variantId,
      quantity:
      inventory.quantity
    });

    return inventory;
  }
  catch(error){
    console.error(
      "Inventory Sync Error:",
      error
    );

    throw error;
  }
};

export {

  checkInventory,
  updateProductInventory,
  getOutOfStockProducts,
  getAvailableProducts,
  syncInventory

};


