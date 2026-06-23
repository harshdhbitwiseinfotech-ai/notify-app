/*
  Subscribe Service
  Back In Stock Notification System
*/
const subscribeCustomer = async ({
  email,
  productId,
  variantId,
  productName,
  productImage,
  price
}) => {
    
  if(!email){
    return {
      success:false,
      message:"Email is required"
    };
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if(!emailRegex.test(email)){
    return {
      success:false,
      message:"Invalid email address"
    };
  }

  try{
    const response = await fetch(
      "/api/subscribers",
      {
        method:"POST",
        headers:{
          "Content-Type":
          "application/json"
        },

        body:JSON.stringify({

          email,
          productId,
          variantId,
          productName,
          productImage,
          price,
          status:"pending"

        })
      }
    );

    const data =
    await response.json();

    return {
      success:data.success,
      message:
      data.message ||
      "Subscribed successfully"
    };
  }

  catch(error){
    console.error(
      "Subscribe Error:",
      error
    );

    return {
      success:false,
      message:
      "Unable to subscribe"
    };
  }
};

const checkSubscription = async ({
  email,
  productId
}) => {

  try{
    const response =
    await fetch(

      `/api/subscribers/check?email=${email}&productId=${productId}`

    );

    const data =
    await response.json();
    return data;
  }

  catch(error){
    console.error(
      "Check Subscription Error:",
      error
    );

    return {
      subscribed:false
    };
  }
};

export {
  subscribeCustomer,
  checkSubscription
};