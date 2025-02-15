import Layout from "@/components/Layout";
import { useState } from "react";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function AdminManagement() {
  const { data: admins, error, isLoading, mutate } = useSWR("/api/admins", fetcher);
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setFeedback({ message: "", type: "" });

    if (!email || !email.includes("@")) {
      setFeedback({ message: "Please enter a valid email address.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/admins", { email });
      setFeedback({ message: "Admin added successfully!", type: "success" });
      setEmail("");
      mutate(); // Refresh the admin list
    } catch (err) {
      setFeedback({ message: "Failed to add admin.", type: "error" });
    }
    setLoading(false);
  };

  const handleDeleteAdmin = async (adminId) => {
    setFeedback({ message: "", type: "" });

    try {
      await axios.delete(`/api/admins?_id=${adminId}`);
      setFeedback({ message: "Admin removed successfully!", type: "success" });
      mutate(); // Refresh the admin list
    } catch (err) {
      setFeedback({ message: "Failed to delete admin.", type: "error" });
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h2 className="text-xl font-semibold mb-4">Admin Management</h2>
        
        {feedback.message && (
          <p className={`text-sm mb-2 ${feedback.type === "error" ? "text-red-500" : "text-green-500"}`}>
            {feedback.message}
          </p>
        )}
        
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
        {isLoading ? (
          <p className="text-gray-500 mt-4">Loading...</p>
        ) : error ? (
          <p className="text-red-500 mt-4">Failed to fetch admins.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {admins?.map((admin) => (
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
        )}
      </div>
    </Layout>
  );
}
