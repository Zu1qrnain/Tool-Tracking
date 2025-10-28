import React, { useEffect, useState } from "react";
import { getMaintenance } from "src/services/api";
import { CCard, CCardBody } from "@coreui/react";

const Maintenance = () => {
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMaintenance = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMaintenance();
      setMaintenanceList(data.sort((a,b)=>new Date(b.maintenance_date)-new Date(a.maintenance_date)));
    } catch (err) {
      console.error(err);
      setError("Failed to load maintenance records.");
    } finally { setLoading(false) }
  }

  useEffect(()=>{ fetchMaintenance() }, [])

  if(loading) return <p>Loading Maintenance Data...</p>
  if(error) return <p className="text-red-600">{error}</p>
  if(maintenanceList.length===0) return <p>No maintenance records found.</p>

  return (
    <div className="p-4">
      <h2 className="h4 mb-3">Maintenance Records</h2>
      {maintenanceList.map(item=>(
        <CCard key={item.id} className="mb-3">
          <CCardBody>
            <strong>{item.tool?.name}</strong>
            <div>Last Serviced: {item.maintenance_date ? new Date(item.maintenance_date).toLocaleString():"N/A"}</div>
            <div>Performed By: {item.performed_by?.username || "N/A"}</div>
            <div>Notes: {item.notes || "No notes"}</div>
          </CCardBody>
        </CCard>
      ))}
    </div>
  )
}

export default Maintenance;
