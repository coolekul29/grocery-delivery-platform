import { useEffect, useState } from "react";
import axios from "axios";

function Products({ cart, setCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/products")
      .then(res => {
        console.log(res.data); // debug
        setProducts(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const addToCart = (product) => {
  setCart([...cart, product]);
  console.log("Cart:", [...cart, product]);
  };

return (
  <div style={{ padding: "20px" }}>
    <h2>Browse Products</h2>
    <p>Cart ({cart.length})</p>

    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "20px",
      marginTop: "20px"
    }}>
      {products.map(product => (
        <div key={product._id} style={{
          border: "1px solid #ccc",
          padding: "15px",
          textAlign: "center",
          background: "#f5f5f5"
        }}>
          <h4>{product.name}</h4>
          <p>${product.price}</p>

        <button
          onClick={() => addToCart(product)}
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "5px 10px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Add to Cart
        </button>
        </div>
      ))}
    </div>
  </div>
);
}

export default Products;