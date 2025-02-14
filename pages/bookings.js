import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get("/api/bookings").then((response) => {
      const today = new Date();
      const upcomingAppointments = response.data.filter(appointment => {
        const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
        return appointmentDate > today;
      });
      setAppointments(upcomingAppointments);
    });
  }, []);

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Upcoming Customer Bookings</h1>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-md mt-4 bg-white rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">Date</th>
                <th className="p-3 border-b">Time</th>
                <th className="p-3 border-b">Products</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-3 text-center">No upcoming bookings.</td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr key={appointment._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{appointment.date}</td>
                    <td className="p-3">{appointment.time}</td>
                    <td className="p-3">
                      {appointment.products.map((product) => (
                        <div key={product._id} className="border-b last:border-none p-2">
                          {product.title}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
