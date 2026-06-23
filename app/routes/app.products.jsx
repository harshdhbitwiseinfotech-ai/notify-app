import React, { useEffect, useState } from "react";
import "../routes/styles/products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  
  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/dashboard/products");
      const data = await res.json();

      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
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
                      onClick={() =>
                        alert(
                          `Subscribers:\n\n${product.subscribers
                            .map((s) => s.email)
                            .join("\n")}`
                        )
                      }
                    >
                      View Subscribers
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

    </div>
  );
};

export default Products;
