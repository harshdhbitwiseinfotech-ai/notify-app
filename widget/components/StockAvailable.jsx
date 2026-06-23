import React from "react";
import "./stock-available.css";

const StockAvailable = ({
    productId,
    variantId,
    productName,
    price,
    onAddToCart,
    onBuyNow
}) => {

    return (

        <div className="stock-available">

            <span className="available-label">
                In Stock
            </span>


            <p className="available-text">
                {productName} is available now.
            </p>


            <div className="stock-actions">

                <button
                    className="cart-button"
                    onClick={() =>
                        onAddToCart({
                            productId,
                            variantId
                        })
                    }
                >
                    Add To Cart
                </button>


                <button
                    className="buy-button"
                    onClick={() =>
                        onBuyNow({
                            productId,
                            variantId
                        })
                    }
                >
                    Buy Now
                </button>

            </div>

        </div>

    );

};

export default StockAvailable;