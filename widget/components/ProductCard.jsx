import React, { useState } from "react";
import NotifyButton from "./NotifyButton";
import EmailPopup from "./EmailPopup";
import "./product-card.css";

const ProductCard = ({
    product
}) => {
    const [showPopup, setShowPopup] = useState(false);
    const isAvailable = product.available;

    return (

        <div className="product-card">

            <div className="product-image">

                <img
                    src={product.image}
                    alt={product.title}
                />

            </div>

            <div className="product-content">

                <h3>
                    {product.title}
                </h3>

                <p className="product-price">
                    ₹{product.price}
                </p>
                {
                    isAvailable ? (

                        <div className="stock-area">

                            <span className="in-stock">
                                In Stock
                            </span>

                            <button className="cart-btn">
                                Add To Cart
                            </button>

                            <button className="buy-btn">
                                Buy Now
                            </button>
                        </div>

                    ) : (

                        <div className="out-stock-area">
                            <span className="out-stock">
                                Out Of Stock
                            </span>
                            <NotifyButton
                                productId={product.id}
                                variantId={product.variantId}
                                productName={product.title}
                                productImage={product.image}
                                price={product.price}
                                available={false}
                                onClick={() => setShowPopup(true)}
                            />
                        </div>
                    )
                }
            </div>
            <EmailPopup
                isOpen={showPopup}
                onClose={() => setShowPopup(false)}
                productId={product.id}
                variantId={product.variantId}
                productName={product.title}
                productImage={product.image}
                price={product.price}
            />
        </div>
    );
};

export default ProductCard;