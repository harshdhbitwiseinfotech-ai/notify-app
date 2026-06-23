import React from "react";
import "../routes/styles/components.css";


const ProductTable = ({
  products = [],
  onViewSubscribers,
  onViewProduct
}) => {
  return (
    <div className="product-table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th> Product </th>
            <th> Price </th>
            <th> Inventory </th>
            <th> Subscribers </th>
            <th> Status </th>
            <th> Action </th>
          </tr>
        </thead>
        <tbody>
        {
          products.length > 0 ? (
            products.map((product)=> (
              <tr key={product.id}>
                {/* PRODUCT */}

                <td className="product-info">
                  <img
                    src={ product.image || "https://via.placeholder.com/50" } alt={product.title} />
                  <div>
                    <h4>
                      {product.title}
                    </h4>
                    <span>
                      ID: {product.id}
                    </span>
                  </div>
                </td>

                {/* PRICE */}

                <td> ₹{product.price} </td>

                {/* INVENTORY */}

                <td> { product.inventory > 0 ? `${product.inventory} left`: "0"} </td>

                {/* SUBSCRIBERS */}

                <td>
                  <span className="subscriber-count">
                    {
                      product.subscribers || 0
                    }
                  </span>
                </td>

                {/* STATUS */}

                <td>
                { product.inventory > 0 ?
                  <span className="status available"> In Stock </span> :
                  <span className="status out-stock"> Out Of Stock </span>
                }
                </td>

                {/* ACTION */}
                <td>
                  <button className="view-btn" onClick={() => onViewSubscribers(product) }>
                    Subscribers
                  </button>
                  <button className="product-btn" onClick={() => onViewProduct(product)}>
                    View
                  </button>
                </td>
              </tr>
            ))
          ):
          (
            <tr>
              <td colSpan="6" className="empty">
                No products found
              </td>
            </tr>
          )
        }
        </tbody>
      </table>
    </div>
  );
};


export default ProductTable;