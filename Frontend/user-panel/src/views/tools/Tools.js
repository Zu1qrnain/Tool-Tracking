import React, { useEffect, useState } from "react";
import { getTools, borrowTool } from "src/services/api";

const Tools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTools = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTools();
      setTools(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tools.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTools() }, []);

  const handleBorrow = async (id) => {
    if (!window.confirm("Do you want to borrow this tool?")) return;
    try {
      await borrowTool(id);
      alert("✅ Tool borrowed successfully!");
      fetchTools();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to borrow tool.");
    }
  };

  if (loading) return <p className="p-6 text-gray-500 text-center">Loading tools...</p>;
  if (error) return <p className="p-6 text-red-600 text-center">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Available Tools</h2>

      {tools.length === 0 ? (
        <p className="text-gray-600 text-center">No tools available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="border-b p-3 text-left text-gray-700 uppercase tracking-wide">Name</th>
                <th className="border-b p-3 text-left text-gray-700 uppercase tracking-wide">Category</th>
                <th className="border-b p-3 text-center text-gray-700 uppercase tracking-wide">Quantity</th>
                <th className="border-b p-3 text-center text-gray-700 uppercase tracking-wide">Status</th>
                <th className="border-b p-3 text-center text-gray-700 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              {tools.map(tool => (
                <tr key={tool.id} className="hover:bg-gray-100 transition">
                  <td className="border-b p-3">{tool.name}</td>
                  <td className="border-b p-3 capitalize">{tool.category}</td>
                  <td className="border-b p-3 text-center font-medium">
                    {tool.quantity_available} / {tool.quantity_total}
                  </td>
                  <td className={`border-b p-3 text-center font-medium ${tool.quantity_available > 0 ? "text-green-600" : "text-red-600"}`}>
                    {tool.quantity_available > 0 ? "Available" : "Borrowed"}
                  </td>
                  <td className="border-b p-3 text-center">
                    {tool.quantity_available > 0 ? (
                      <button
                        onClick={() => handleBorrow(tool.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-md transition"
                      >
                        Borrow
                      </button>
                    ) : (
                      <span className="text-gray-400 font-medium">Not Available</span>
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

export default Tools;
