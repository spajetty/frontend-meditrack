import React, { useState, useEffect } from "react";
import axios from "axios";
import * as echarts from "echarts";
import { useParams, useNavigate } from "react-router-dom";

const DoctorPatientMedicationSummary = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("30 Days");

  const timeFilterOptions = ["7 Days", "30 Days", "90 Days", "All Time"];

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const getAdherenceColorClass = (rate) => {
    if (rate >= 90) return "bg-green-500";
    if (rate >= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [presRes, doseRes] = await Promise.all([
          axios.get(`https://localhost:7015/api/prescriptions/${patientId}`),
          axios.get(`https://localhost:7015/api/doselogs/patient/${patientId}`),
        ]);

        const doseLogs = doseRes.data;

        const enrichedPrescriptions = presRes.data.map((pres) => {
  const relatedLogs = doseLogs.filter((log) => log.prescriptionId === pres.prescriptionId);

  // ✅ Calculate total days duration (+1 to include both start and end dates)
  const totalDays =
    (new Date(pres.endDate).getTime() - new Date(pres.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1;

  // ✅ Count how many times per day (number of PrescriptionTimes for this prescription)
  const dosesPerDay = pres.prescriptionTimes.length;

  // ✅ Total scheduled doses
  const scheduled = totalDays * dosesPerDay;

  const taken = relatedLogs.filter((log) => log.status.toLowerCase() === "taken").length;
  const missed = relatedLogs.filter((log) => log.status.toLowerCase() === "missed").length;
  const pending = relatedLogs.filter((log) => log.status.toLowerCase() === "pending").length;

  const adherenceRate = scheduled > 0 ? Math.round((taken / scheduled) * 100) : 0;

  const recentDoses = relatedLogs
    .sort((a, b) => new Date(b.scheduledDateTime) - new Date(a.scheduledDateTime))
    .slice(0, 5)
    .map((log) => ({
      date: new Date(log.scheduledDateTime).toLocaleDateString(),
      time: new Date(log.scheduledDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: log.status,
      difference: "--", // Optional: calculate difference if needed
    }));

  return {
    id: pres.prescriptionId,
    medicineName: pres.medicineName,
    dosage: pres.dosage,
    instruction: pres.instruction,
    startDate: pres.startDate,
    endDate: pres.endDate,
    adherence: { scheduled, taken, missed, pending, rate: adherenceRate },
    recentDoses,
  };
});


        setPrescriptions(enrichedPrescriptions);
      } catch (error) {
        console.error("Error fetching prescription summary:", error);
      }
    };

    fetchData();
  }, [patientId]);

  useEffect(() => {
    prescriptions.forEach((prescription) => {
      const chartDom = document.getElementById(`adherence-chart-${prescription.id}`);
      if (chartDom) {
        const myChart = echarts.init(chartDom);
        const option = {
          animation: false,
          tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
          series: [
            {
              type: "pie",
              radius: ["50%", "70%"],
              avoidLabelOverlap: false,
              label: {
                show: true,
                position: "inside",
                formatter: "{d}%",
                fontSize: 14,
                fontWeight: "bold",
              },
              labelLine: { show: false },
              data: [
                { value: prescription.adherence.taken, name: "Taken", itemStyle: { color: "#4CAF50" } },
                { value: prescription.adherence.missed, name: "Missed", itemStyle: { color: "#F44336" } },
                { value: prescription.adherence.pending, name: "Pending", itemStyle: { color: "#9E9E9E" } },
              ],
            },
          ],
        };
        myChart.setOption(option);

        const handleResize = () => myChart.resize();
        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
          myChart.dispose();
        };
      }
    });
  }, [prescriptions, expandedCard]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Patient Medication Summary</h1>
          <select
            className="border text-sm rounded px-2 py-1"
            value={selectedTimeFilter}
            onChange={(e) => setSelectedTimeFilter(e.target.value)}
          >
            {timeFilterOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {prescriptions.map((prescription) => (
          <div
            key={prescription.id}
            className={`bg-white rounded shadow overflow-hidden mb-6 ${expandedCard === prescription.id ? "pb-6" : ""}`}
          >
            <div
              onClick={() => toggleCard(prescription.id)}
              className="px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
            >
              <div>
                <h2 className="text-lg font-semibold">{prescription.medicineName}</h2>
                <p className="text-sm text-gray-600">{prescription.dosage}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(prescription.startDate)} - {formatDate(prescription.endDate)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Adherence</p>
                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${getAdherenceColorClass(prescription.adherence.rate)}`}
                    style={{ width: `${prescription.adherence.rate}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{prescription.adherence.rate}%</span>
              </div>
            </div>

            {expandedCard === prescription.id && (
              <div className="px-6">
                {/* Adherence Statistics Boxes */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-xs text-gray-500">Scheduled</p>
                    <p className="text-lg font-semibold">{prescription.adherence.scheduled}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded">
                    <p className="text-xs text-green-700">Taken</p>
                    <p className="text-lg font-semibold text-green-600">{prescription.adherence.taken}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded">
                    <p className="text-xs text-red-700">Missed</p>
                    <p className="text-lg font-semibold text-red-600">{prescription.adherence.missed}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded">
                    <p className="text-xs text-gray-600">Pending</p>
                    <p className="text-lg font-semibold text-gray-600">{prescription.adherence.pending}</p>
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-2">Adherence Pie Chart</h4>
                  <div id={`adherence-chart-${prescription.id}`} style={{ height: "250px" }}></div>
                </div>

                {/* Recent Doses Table */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-2">Recent Doses</h4>
                  <div className="border rounded overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-1 text-left">Date</th>
                          <th className="px-2 py-1 text-left">Time</th>
                          <th className="px-2 py-1 text-left">Status</th>
                          <th className="px-2 py-1 text-left">Difference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescription.recentDoses.map((dose, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="px-2 py-1">{dose.date}</td>
                            <td className="px-2 py-1">{dose.time}</td>
                            <td className="px-2 py-1">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  dose.status.toLowerCase() === "taken"
                                    ? "bg-green-100 text-green-800"
                                    : dose.status.toLowerCase() === "missed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {dose.status}
                              </span>
                            </td>
                            <td className="px-2 py-1">{dose.difference}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </main>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between">
          <button className="px-4 py-2 bg-white border rounded text-gray-700 hover:bg-gray-50">
            <i className="fas fa-bell mr-2"></i> Set Reminder
          </button>
          <div>
            <button className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50 mr-3">
              <i className="fas fa-print mr-2"></i> Print
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              <i className="fas fa-comment-medical mr-2"></i> Contact Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPatientMedicationSummary;
