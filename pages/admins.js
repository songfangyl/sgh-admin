import Layout from "@/components/Layout";
import { useState, useEffect } from "react";

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/admins");
      const data = await response.json();
      setAdmins(data);
    } catch (err) {
      setError("Failed to fetch admins.");
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to add admin.");
      }

      setSuccess("Admin added successfully!");
      setEmail("");
      fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDeleteAdmin = async (adminId) => {
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch(`/api/admins?_id=${adminId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete admin.");
      }

      setSuccess("Admin removed successfully!");
      fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h2 className="text-xl font-semibold mb-4">Admin Management</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
        
        <form onSubmit={handleAddAdmin} className="space-y-4">
          <input
            type="email"
            placeholder="Enter admin email"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Admin"}
          </button>
        </form>
        
        <h3 className="text-lg font-semibold mt-6">Existing Admins</h3>
        <ul className="mt-4 space-y-2">
          {admins.map((admin) => (
            <li key={admin._id} className="flex justify-between items-center p-2 border rounded-md">
              <span>{admin.email}</span>
              <button
                className="p-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => handleDeleteAdmin(admin._id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
