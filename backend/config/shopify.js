import dotenv from "dotenv";

dotenv.config();

const SHOPIFY_API_VERSION =
  process.env.SHOPIFY_API_VERSION || "2025-01";

const getShopifyHeaders = () => {
  return {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
  };
};

const shopifyRequest = async (query, variables = {}) => {
  try {
    const response = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: getShopifyHeaders(),
        body: JSON.stringify({
          query,
          variables,
        }),
      }
    );

    const data = await response.json();

    if (data.errors) {
      throw new Error(JSON.stringify(data.errors));
    }

    return data.data;
  } catch (error) {
    console.error("Shopify API Error:", error.message);
    throw error;
  }
};

const getProductById = async (productId) => {
  const query = `
    query getProduct($id:ID!){
      product(id:$id){
        id
        title
        featuredImage{
          url
        }
        variants(first:10){
          nodes{
            id
            price
            inventoryQuantity
          }
        }
      }
    }
  `;

  const result = await shopifyRequest(query, {
    id: productId,
  });

  return result.product;
};

const updateInventoryStatus = async (variantId) => {
  const query = `
    query getVariant($id:ID!){
      productVariant(id:$id){
        inventoryQuantity
      }
    }
  `;

  const result = await shopifyRequest(query, {
    id: variantId,
  });

  return result.productVariant.inventoryQuantity;
};

const createWebhook = async ({ topic, webhookUrl }) => {
  const query = `
    mutation webhookCreate(
      $topic:WebhookSubscriptionTopic!,
      $webhookPath:String!
    ){
      webhookSubscriptionCreate(
        topic:$topic,
        webhookSubscription:{
          callbackUrl:$webhookPath,
          format:JSON
        }
      ){
        webhookSubscription{
          id
        }
        userErrors{
          field
          message
        }
      }
    }
  `;

  return await shopifyRequest(query, {
    topic,
    webhookPath: webhookUrl,
  });
};

const addProductToCart = ({ variantId, quantity = 1 }) => {
  return {
    variantId,
    quantity,
  };
};

export {
  shopifyRequest,
  getShopifyHeaders,
  getProductById,
  updateInventoryStatus,
  createWebhook,
  addProductToCart,
};

