import React, { useEffect, useState } from "react";
import { getCalibrations } from "src/services/api";

const Calibration = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getCalibrations();
      setData(result.sort((a,b)=>new Date(b.calibration_date)-new Date(a.calibration_date)));
    } catch (err) {
      console.error(err);
      setError("Failed to load calibration schedule.");
    } finally { setLoading(false) }
  }

  useEffect(()=>{ fetchData() }, [])

  if(loading) return <p>Loading calibration schedule...</p>
  if(error) return <p className="text-red-600">{error}</p>
  if(data.length===0) return <p>No calibration records found.</p>

  return (
    <div className="p-4">
      <h2 className="h4 mb-3">Calibration Schedule</h2>
      <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Tool</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Performed By</th>
            <th className="border p-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item=>(
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="border p-2">{item.tool.name}</td>
              <td className="border p-2">{new Date(item.calibration_date).toLocaleString()}</td>
              <td className="border p-2">{item.performed_by?.username || "N/A"}</td>
              <td className="border p-2">{item.notes || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Calibration;
