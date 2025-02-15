import Layout from "@/components/Layout";
import Link from "next/link";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Products() {
  const { data: products, error, isLoading, mutate } = useSWR("/api/products", fetcher, {
    refreshInterval: 300000, // Auto-refresh every 5 minutes
  });

  if (error) return <p className="text-red-500">Failed to load products.</p>;

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Products</h1>
        <Link
          className="btn-primary px-4 py-2 mb-4 inline-block"
          href="/products/new"
          onClick={() => mutate()} // Ensure latest products after adding a new one
        >
          Add new product
        </Link>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 w-full mb-2"></div>
              <div className="h-6 bg-gray-200 w-full mb-2"></div>
              <div className="h-6 bg-gray-200 w-full mb-2"></div>
            </div>
          ) : (
            <table className="w-full border-collapse shadow-md mt-4 bg-white rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border-b">Product name</th>
                  <th className="p-3 border-b text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{product.title}</td>
                    <td className="p-3 text-right space-x-2">
                      <Link
                        className="btn-default px-3 py-1 inline-flex items-center"
                        href={`/products/edit/${product._id}`}
                        onClick={() => mutate()} // Ensure sync after edit
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Edit
                      </Link>
                      <button
                        className="btn-red px-3 py-1 inline-flex items-center"
                        onClick={async () => {
                          await axios.delete(`/api/products/${product._id}`);
                          mutate(); // Refresh list after delete
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
