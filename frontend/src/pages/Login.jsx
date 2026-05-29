import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  // Send login details to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axiosInstance.post(
        "/api/auth/login",
        formData
      );

      // Save user login data
      login(response.data);

      navigate("/products");
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <section
        className="hero-section"
        style={{
          background: "linear-gradient(135deg, #1f9d67 0%, #2ecf9f 100%)",
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container">
          <div className="row align-items-center py-5">
            <div className="col-lg-6">
              <p className="text-uppercase fw-semibold text-light mb-2">
                Customer Login
              </p>
              <h1 className="display-4 fw-bold text-white mb-4">
                Welcome Back
              </h1>
              <p className="lead text-light mb-0">
                Login to manage your grocery orders, shopping cart,
                and customer profile.
              </p>
            </div>

            <div className="col-lg-5 ms-auto">
              <div className="card border-0 shadow-lg rounded-4">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold mb-2">Sign In</h2>
                    <p className="text-muted mb-0">
                      Access your grocery delivery account
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="alert alert-danger shadow-sm">
                      {errorMessage}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                        className="form-control form-control-lg"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            password: e.target.value,
                          })
                        }
                        className="form-control form-control-lg"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-success btn-lg w-100 fw-semibold"
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </form>

                  <div className="text-center mt-4">
                    <p className="text-muted mb-0">
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        className="text-success fw-semibold text-decoration-none"
                      >
                        Create Account
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;