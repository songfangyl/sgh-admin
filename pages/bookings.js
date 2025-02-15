import Layout from "@/components/Layout";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Appointments() {
  const { data: bookings, error, isLoading, mutate } = useSWR("/api/bookings", fetcher, {
    refreshInterval: 300000, // Auto-refresh every 5 minutes
  });

  const today = new Date();
  const upcomingAppointments = bookings
    ? bookings.filter((appointment) => {
        const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
        return appointmentDate > today;
      })
    : [];

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Upcoming Customer Bookings</h1>
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">Failed to fetch bookings.</p>
          ) : (
            <table className="w-full border-collapse shadow-md mt-4 bg-white rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Time</th>
                  <th className="p-3 border-b">Products</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-3 text-center">No upcoming bookings.</td>
                  </tr>
                ) : (
                  upcomingAppointments.map((appointment) => (
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
          )}
        </div>
      </div>
    </Layout>
  );
}
