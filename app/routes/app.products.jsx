import React, { useEffect, useState } from "react";
import "../routes/styles/products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSubscribers, setShowSubscribers] = useState(false);
  const [error, setError] = useState(null);

  
  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/dashboard/products");
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Unable to load products");
      }

      setProducts(data.products || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // UI
  return (
    <div className="products-container">

      {/* HEADER */}
      <div className="products-header">
        <h1>🛒 Products Management</h1>
        <p>Track stock status and notify requests</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* TABLE SECTION */}
      <div className="products-table-wrapper">

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th>Notify Requests</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>

                  {/* PRODUCT INFO */}
                  <td className="product-cell">
                    <img src={product.image} alt={product.title} />
                    <span>{product.title}</span>
                  </td>

                  {/* PRICE */}
                  <td>₹{product.price}</td>

                  {/* STOCK STATUS */}
                  <td>
                    {product.inStock ? (
                      <span className="badge green">In Stock</span>
                    ) : (
                      <span className="badge red">Out of Stock</span>
                    )}
                  </td>

                  {/* NOTIFY COUNT */}
                  <td>
                    <span className="notify-count">
                      {product.notifyCount || 0}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowSubscribers(true);
                      }}
                    >
                      View Subscribers
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

        {showSubscribers && selectedProduct && (
          <div className="subscriber-modal">
            <div className="subscriber-modal-content">
              <div className="subscriber-modal-header">
                <h3>{selectedProduct.title} Subscribers</h3>
                <button onClick={() => setShowSubscribers(false)}>Close</button>
              </div>
              <div className="subscriber-modal-body">
                {selectedProduct.subscribers && selectedProduct.subscribers.length > 0 ? (
                  <ul>
                    {selectedProduct.subscribers.map((subscriber) => (
                      <li key={subscriber.id}>{subscriber.email}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No pending subscribers found.</p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default Products;
