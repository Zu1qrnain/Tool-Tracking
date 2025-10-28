import React, { useEffect, useState } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
} from "@coreui/react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import { getTools, getMyIssuances, getMaintenance, getCalibrations } from "src/services/api";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [tools, setTools] = useState([]);
  const [myIssuances, setMyIssuances] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [calibrations, setCalibrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [toolsData, issuancesData, maintenanceData, calibrationData] = await Promise.all([
        getTools(),
        getMyIssuances(),
        getMaintenance(),
        getCalibrations(),
      ]);

      setTools(toolsData);
      setMyIssuances(
        issuancesData.sort(
          (a, b) => new Date(b.borrow_date) - new Date(a.borrow_date)
        )
      );
      setMaintenance(maintenanceData);
      setCalibrations(calibrationData);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="p-4">Loading dashboard...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  // ✅ Updated calculations to sum quantities instead of just counting types
  const totalTools = tools.reduce((sum, t) => sum + t.quantity_total, 0);
  const availableTools = tools.reduce((sum, t) => sum + t.quantity_available, 0);
  const issuedTools = totalTools - availableTools;
  const recentBorrowings = myIssuances.slice(0, 5);
  const upcomingMaintenance = maintenance.slice(0, 3);

  const pieData = {
    labels: ["Available", "Issued"],
    datasets: [
      {
        label: "Tools",
        data: [availableTools, issuedTools],
        backgroundColor: ["#4ade80", "#f87171"],
        borderColor: ["#16a34a", "#b91c1c"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-semibold">Dashboard</h2>

      <CRow className="mb-4">
        <CCol xs={12} sm={6} md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h5>Total Tools</h5>
              <p className="h3">{totalTools}</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h5>Available</h5>
              <p className="h3 text-green-600">{availableTools}</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h5>Issued</h5>
              <p className="h3 text-red-600">{issuedTools}</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h5>Upcoming Maintenance</h5>
              <p className="h3">{upcomingMaintenance.length}</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol xs={12} md={6}>
          <CCard>
            <CCardHeader>Tool Status</CCardHeader>
            <CCardBody>
              <Pie data={pieData} />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} md={6}>
          <CCard>
            <CCardHeader>Recent Borrowings</CCardHeader>
            <CCardBody>
              {recentBorrowings.length === 0 ? (
                <p>No recent borrowings.</p>
              ) : (
                <ul>
                  {recentBorrowings.map((item) => (
                    <li key={item.id}>
                      {item.tool.name} - {item.status} (
                      {new Date(item.borrow_date).toLocaleString()})
                    </li>
                  ))}
                </ul>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>Quick Links</CCardHeader>
            <CCardBody className="d-flex gap-2 flex-wrap">
              <CButton color="primary" onClick={() => navigate("/tools")}>
                View All Tools
              </CButton>
              <CButton color="success" onClick={() => navigate("/issuances")}>
                My Borrowings
              </CButton>
              <CButton color="warning" onClick={() => navigate("/maintenance")}>
                Maintenance Schedule
              </CButton>
              <CButton color="info" onClick={() => navigate("/calibration")}>
                Calibration Schedule
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Dashboard;
