import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const ProductListAdmin = ({ products, setProducts, setEditingProduct }) => {
  
  const handleClone = async (productId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/products/${productId}/clone`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to clone product.");
    }

    alert("Product cloned successfully.");

    // Refresh the product list
    setProducts([...products, data]);
  } catch (error) {
    console.error(error);
    alert("Error cloning product.");
  }
};

  const handleDelete = async (productId) => {
    // Ask before deleting the product
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/products/${productId}`);

      // Remove deleted product from the list
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  // Show message if there are no products
  if (products.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <div className="fs-1 mb-3">📦</div>
        <h5 className="fw-bold">No products found</h5>
        <p className="mb-0">
          Add your first grocery product using the form above.
        </p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                <div className="fw-bold">{product.name}</div>
                <div className="text-muted small">
                  {product.description || "No description provided."}
                </div>
              </td>

              <td>
                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                  {product.category}
                </span>
              </td>

              <td className="fw-semibold">
                ${Number(product.price).toFixed(2)}
              </td>

              <td>
                {/* Show stock status */}
                <span
                  className={`badge rounded-pill ${
                    product.stock > 0 ? "bg-light text-dark border" : "bg-danger"
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                </span>
              </td>

              <td className="text-end">
                <button
                  className="btn btn-outline-primary btn-sm me-2"
                  onClick={() => handleClone(product._id)}
                >
                  Clone
                </button>
                <button
                  onClick={() => setEditingProduct(product)}
                  className="btn btn-outline-warning btn-sm me-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(product._id)}
                  className="btn btn-outline-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductListAdmin;