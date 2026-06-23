/*
  Notification Service
  Back In Stock Notification System
*/


const sendBackInStockNotification = async ({
    subscriberEmail,
    productId,
    productName,
    productImage,
    price,
    variantId
}) => {

    if (!subscriberEmail) {

        return {
            success: false,
            message: "Subscriber email required"
        };

    }


    try {

        const response = await fetch(
            "/api/notifications/send",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    email: subscriberEmail,

                    productId,

                    variantId,

                    productName,

                    productImage,

                    price,

                    status: "sent"

                })

            }
        );


        const data =
            await response.json();


        return {

            success: data.success,

            message:
                data.message ||
                "Notification sent successfully"

        };


    }

    catch (error) {

        console.error(
            "Notification Error:",
            error
        );


        return {

            success: false,

            message: "Notification failed"

        };

    }

};





const sendBulkNotifications = async (
    subscribers,
    product
) => {

    if (!subscribers || subscribers.length === 0) {

        return {

            success: false,

            message: "No subscribers found"

        };

    }


    try {


        const response = await fetch(
            "/api/notifications/bulk",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    subscribers,

                    product

                })

            }
        );



        const data =
            await response.json();



        return {

            success: data.success,

            sent: data.sent || 0,

            message:
                data.message ||
                "Bulk notifications completed"

        };


    }

    catch (error) {

        console.error(
            "Bulk Notification Error:",
            error
        );


        return {

            success: false,

            sent: 0,

            message: "Bulk notification failed"

        };

    }

};






const createNotificationData = ({
    subscriber,
    product
}) => {

    return {

        email: subscriber.email,

        productId: product.id,

        variantId: product.variantId,

        productName: product.title,

        productImage: product.image,

        price: product.price,

        status: "pending",

        createdAt: new Date()

    };

};





export {

    sendBackInStockNotification,

    sendBulkNotifications,

    createNotificationData

};