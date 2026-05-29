import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Update form values
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Check form inputs
  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return "Please fill in all fields.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      await axiosInstance.post("/api/auth/register", formData);

      alert("Registration successful. Please log in.");

      // Go to login page after registration
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage("Registration failed. Please try again.");
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
            <div className="col-lg-5">
              <p className="text-uppercase fw-semibold text-light mb-2">
                Customer Registration
              </p>

              <h1 className="display-4 fw-bold text-white mb-4">
                Create Your Account
              </h1>

              <p className="lead text-light mb-0">
                Register to browse groceries, manage your cart, place orders,
                and update your customer profile.
              </p>
            </div>

            <div className="col-lg-6 ms-auto">
              <div className="card border-0 shadow-lg rounded-4">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold mb-2">Register</h2>

                    <p className="text-muted mb-0">
                      Create your grocery delivery account
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="alert alert-danger shadow-sm">
                      {errorMessage}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Full Name
                        </label>

                        <input
                          type="text"
                          name="name"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Phone Number
                        </label>

                        <input
                          type="text"
                          name="phone"
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Email Address
                        </label>

                        <input
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Delivery Address
                        </label>

                        <input
                          type="text"
                          name="address"
                          placeholder="Enter delivery address"
                          value={formData.address}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Password
                        </label>

                        <input
                          type="password"
                          name="password"
                          placeholder="Create password"
                          value={formData.password}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Confirm Password
                        </label>

                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-success btn-lg w-100 fw-semibold mt-4"
                    >
                      {loading ? "Creating Account..." : "Register"}
                    </button>
                  </form>

                  <div className="text-center mt-4">
                    <p className="text-muted mb-0">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-success fw-semibold text-decoration-none"
                      >
                        Login
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

export default Register;