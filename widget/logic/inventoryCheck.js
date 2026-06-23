/*
  Inventory Check Utility
  Back In Stock Notification System
*/
const checkInventory = (product) => {
  if (!product) {
    return {
      available:false,
      inventory:0
    };
  }

  const inventory =
    product.inventoryQuantity || 0;
  return {
    available: inventory > 0,
    inventory
  };
};

const isOutOfStock = (product) => {
  const inventory =
    product?.inventoryQuantity || 0;
  return inventory <= 0;
};

const isInStock = (product) => {

  const inventory =
    product?.inventoryQuantity || 0;
  return inventory > 0;
};

const getStockStatus = (product) => {
  const inventory =
    product?.inventoryQuantity || 0;

  if(inventory <= 0){

    return {
      status:"OUT_OF_STOCK",
      message:"Notify Me available"
    };
  }

  return {
    status:"AVAILABLE",
    message:"Add To Cart available"
  };
};

const shouldShowNotifyButton = (product) => {
  return isOutOfStock(product);
};

const shouldShowBuyButtons = (product) => {
  return isInStock(product);
};

export {

  checkInventory,
  isOutOfStock,
  isInStock,
  getStockStatus,
  shouldShowNotifyButton,
  shouldShowBuyButtons

};