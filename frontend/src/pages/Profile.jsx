import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  // Load profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      try {
        const response = await axiosInstance.get("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        // Fill form with profile data
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
        alert("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchProfile();
    }
  }, [user]);

  // Update form values
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.put("/api/auth/profile", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <section
        className="text-white py-5"
        style={{
          background: "linear-gradient(135deg, #1f9254, #2ecc9a)",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <p className="text-uppercase fw-semibold mb-2 opacity-75">
                Customer Profile
              </p>

              <h1 className="display-4 fw-bold mb-3">
                Manage Your Account
              </h1>

              <p className="lead mb-0">
                Update your personal information and delivery details.
              </p>
            </div>

            <div className="col-lg-5 text-center mt-4 mt-lg-0">
              <div
                className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow"
                style={{
                  width: "140px",
                  height: "140px",
                }}
              >
                <FaUserCircle size={90} className="text-success" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-5">
                  <h2 className="fw-bold mb-2">Profile Information</h2>

                  <p className="text-muted mb-4">
                    Keep your account information up to date.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-semibold">
                          Full Name
                        </label>

                        <input
                          type="text"
                          name="name"
                          className="form-control form-control-lg"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-semibold">
                          Email Address
                        </label>

                        <input
                          type="email"
                          name="email"
                          className="form-control form-control-lg"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-semibold">
                          Phone Number
                        </label>

                        <input
                          type="text"
                          name="phone"
                          className="form-control form-control-lg"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-semibold">
                          Delivery Address
                        </label>

                        <input
                          type="text"
                          name="address"
                          className="form-control form-control-lg"
                          placeholder="Enter delivery address"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-success btn-lg px-5 fw-semibold"
                    >
                      Update Profile
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;