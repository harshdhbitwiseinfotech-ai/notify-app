import dotenv from "dotenv";

dotenv.config();

const SHOPIFY_API_VERSION =
process.env.SHOPIFY_API_VERSION || "2025-01";

const SHOPIFY_STORE =
process.env.SHOPIFY_STORE_DOMAIN;

const SHOPIFY_TOKEN =
process.env.SHOPIFY_ACCESS_TOKEN;

const shopifyGraphQL = async (
  query,
  variables = {}
) => {

  try{
    const response = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "X-Shopify-Access-Token":
          SHOPIFY_TOKEN
        },
        body:JSON.stringify({
          query,
          variables
        })
      }

    );

    const data =
    await response.json();

    if(data.errors){
      throw new Error(
        JSON.stringify(data.errors)
      );
    }

    return data.data;

  }

  catch(error){
    console.error(
      "Shopify API Error:",
      error.message
    );

    throw error;
  }

};

const getProduct = async (
  productId
) => {
  const query = `
  query getProduct($id:ID!){
    product(id:$id){
      id
      title
      description
      featuredImage{
        url
      }
      variants(first:20){
        nodes{
          id
          title
          price
          inventoryQuantity
        }
      }
    }
  }
  `;

  const result =
  await shopifyGraphQL(
    query,
    {
      id:productId
    }
  );
  return result.product;

};

const getProductInventory = async (
  variantId
) => {

  const query = `
  query getVariant($id:ID!){
    productVariant(id:$id){
      id
      inventoryQuantity
      product{
        id
        title
      }
    }
  }
  `;

  const result =
  await shopifyGraphQL(
    query,
    {
      id:variantId
    }
  );

  return result.productVariant;
};

const updateProductInventory = async ({
  inventoryItemId,
  quantity
}) => {

  const mutation = `
  mutation inventoryAdjustQuantity(
    $input:InventoryAdjustQuantityInput!
  ){

    inventoryAdjustQuantity(
      input:$input
    ){

      inventoryLevel{
        available
      }

      userErrors{
        message
      }
    }
  }
  `;

  return await shopifyGraphQL(
    mutation,
    {

      input:{
        inventoryItemId,
        availableDelta:quantity
     }
    }
  );
}
const createWebhook = async ({
  topic,
  callbackUrl
}) => {
  const mutation = `

  mutation webhookCreate(
    $topic:WebhookSubscriptionTopic!,
    $callbackUrl:URL!
  ){
    webhookSubscriptionCreate(
      topic:$topic
      webhookSubscription:{
        callbackUrl:$callbackUrl
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

  return await shopifyGraphQL(
    mutation,
    {
      topic,
      callbackUrl

    }
  );
};

const getOrders = async () => {

  const query = `
  query {
    orders(first:10){
      nodes{
        id
        name
        createdAt
        totalPriceSet{
          shopMoney{
            amount
          }
        }
      }
    }
  }
  `;

  const result =
  await shopifyGraphQL(
    query
  );
  return result.orders.nodes;
};

const createCheckoutUrl = ({
  variantId,
  quantity=1
}) => {
  return `https://${SHOPIFY_STORE}/cart/${variantId}:${quantity}`;
};

export {

  shopifyGraphQL,
  getProduct,
  getProductInventory,
  updateProductInventory,
  createWebhook,
  getOrders,
  createCheckoutUrl

};