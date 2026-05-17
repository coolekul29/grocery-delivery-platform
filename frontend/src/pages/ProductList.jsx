import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/products"
      );

      setProducts(response.data);

    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Product Listings</h2>

      <div className="row">
        {products.length === 0 ? (
            <div className="alert alert-info">
                No products available at the moment.
            </div>
            ) : (
            <div className="row">
                {products.map((product) => (
                <div className="col-md-4 mb-4" key={product._id}>
                    <div className="card h-100 shadow-sm">
                    {product.image && (
                        <img
                        src={`http://localhost:5001${product.image}`}
                        alt={product.name}
                        className="card-img-top"
                        style={{
                            height: "250px",
                            objectFit: "cover",
                        }}
                        />
                    )}

                    <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>

                        <p className="card-text">{product.description}</p>

                        <p>
                        <strong>Category:</strong> {product.category}
                        </p>

                        <p>
                        <strong>Price:</strong> ${product.price}
                        </p>

                        <p>
                        <strong>Stock:</strong> {product.stock}
                        </p>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}
      </div>
    </div>
  );
};

export default ProductList;