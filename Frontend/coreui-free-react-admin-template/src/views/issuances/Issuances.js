import React, { useEffect, useState } from "react";
import { getMyIssuances, returnTool } from "src/services/api";

const Issuances = () => {
  const [issuances, setIssuances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchIssuances = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyIssuances();
      setIssuances(data.sort((a, b) => new Date(b.borrow_date) - new Date(a.borrow_date)));
    } catch (err) {
      console.error(err);
      setError("Failed to load your issued tools.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIssuances(); }, []);

  const handleReturn = async (id) => {
    if (!window.confirm("Mark this tool as returned?")) return;
    try {
      await returnTool(id);
      alert("✅ Tool returned successfully!");
      fetchIssuances();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to return tool.");
    }
  };

  if (loading) return <p className="p-6 text-gray-500 text-center">Loading your issuances...</p>;
  if (error) return <p className="p-6 text-red-600 text-center">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Issued Tools</h2>

      {issuances.length === 0 ? (
        <p className="text-gray-600 text-center">No tools currently issued.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="border-b p-3 text-left text-gray-700 uppercase tracking-wide">Tool</th>
                <th className="border-b p-3 text-left text-gray-700 uppercase tracking-wide">Category</th>
                <th className="border-b p-3 text-center text-gray-700 uppercase tracking-wide">Status</th>
                <th className="border-b p-3 text-center text-gray-700 uppercase tracking-wide">Quantity (Available / Total)</th>
                <th className="border-b p-3 text-center text-gray-700 uppercase tracking-wide">Borrow Date</th>
                <th className="border-b p-3 text-center text-gray-700 uppercase tracking-wide">Return Date</th>
                <th className="border-b p-3 text-center text-gray-700 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              {issuances.map(item => (
                <tr key={item.id} className="hover:bg-gray-100 transition">
                  <td className="border-b p-3">{item.tool.name}</td>
                  <td className="border-b p-3 capitalize">{item.tool.category}</td>
                  <td className={`border-b p-3 text-center font-medium ${item.status === "borrowed" ? "text-yellow-600" : "text-green-600"}`}>
                    {item.status}
                  </td>
                  <td className="border-b p-3 text-center font-medium">
                    {item.tool.quantity_available} / {item.tool.quantity_total}
                  </td>
                  <td className="border-b p-3 text-center">{new Date(item.borrow_date).toLocaleString()}</td>
                  <td className="border-b p-3 text-center">{item.return_date ? new Date(item.return_date).toLocaleString() : "-"}</td>
                  <td className="border-b p-3 text-center">
                    {item.status === "borrowed" ? (
                      <button
                        onClick={() => handleReturn(item.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition"
                      >
                        Return
                      </button>
                    ) : (
                      <span className="text-gray-400 font-medium">Returned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Issuances;
