import React, { useState, useEffect } from "react";
import axios from "axios";
import * as echarts from "echarts";
import { useParams, useNavigate } from "react-router-dom";

const DoctorPatientMedicationSummary = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("30 Days");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPrescriptions = prescriptions.filter((prescription) =>
    prescription.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const formatDateYYYYMMDD = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };


  const calculateAge = (birthDateString) => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientRes, presRes, doseRes] = await Promise.all([
          axios.get(`https://meditrack-f9bqhsedfqbaf2es.canadacentral-01.azurewebsites.net/api/patients/${patientId}`),
          axios.get(`https://meditrack-f9bqhsedfqbaf2es.canadacentral-01.azurewebsites.net/api/prescriptions/${patientId}`),
          axios.get(`https://meditrack-f9bqhsedfqbaf2es.canadacentral-01.azurewebsites.net/api/doselog/patient/${patientId}`),
        ]);

        setPatientInfo(patientRes.data);
        const doseLogs = doseRes.data;
        console.log("Dose Logs:", doseLogs);

        const enrichedPrescriptions = presRes.data.map((pres) => {
          const relatedLogs = doseLogs.filter((log) => log.prescriptionId === pres.prescriptionId);

          const totalDays =
            (new Date(pres.endDate).getTime() - new Date(pres.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1;

          const dosesPerDay = pres.prescriptionTimes.length;
          const scheduled = totalDays * dosesPerDay;

          const taken = relatedLogs.filter((log) => log.status.toLowerCase() === "taken").length;
          const missed = relatedLogs.filter((log) => log.status.toLowerCase() === "missed").length;
          const pending = Math.max(scheduled - (taken + missed), 0);

          const adherenceRate = scheduled > 0 ? Math.round((taken / scheduled) * 100) : 0;
        
          // Determine status based on adherence rate and end date
          const tod = new Date();
          const endDate = new Date(pres.endDate);

          let status = "";
          if (tod > endDate) {
            // Prescription already ended
            status = adherenceRate >= 90 ? "Completed" : "Completed but Missed Some Doses";
          } else {
            // Still ongoing
            status = "Ongoing";
          }

        const recentDoses = relatedLogs
          .sort((a, b) => {
            const aDate = new Date(`${a.date} ${a.time}`);
            const bDate = new Date(`${b.date} ${b.time}`);
            return bDate - aDate;
          })
          .slice(0, 5)
          .map((log) => {
            const dateObj = new Date(`${log.date} ${log.time}`);
            const isValidDate = !isNaN(dateObj.getTime());

            return {
              date: isValidDate ? formatDateYYYYMMDD(dateObj) : "Invalid Date",
              time: isValidDate
                ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "--",
              status: log.status,
            };
          });
          return {
            id: pres.prescriptionId,
            medicineName: pres.medicineName,
            dosage: pres.dosage,
            instruction: pres.instruction,
            startDate: pres.startDate,
            endDate: pres.endDate,
            adherence: { scheduled, taken, missed, pending, rate: adherenceRate },
            status,
            recentDoses,
          };
        });

        setPrescriptions(enrichedPrescriptions);
      } catch (error) {
        console.error("Error fetching data:", error);
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
          tooltip: { trigger: "item" },
          legend: {
            orient: "vertical",
            right: 10,
            top: "center",
            data: ["Taken", "Missed", "Pending"],
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "70%"],
              avoidLabelOverlap: false,
              label: {
                show: true,
                position: "inside",
                formatter: "{d}%",
                fontSize: 14,
                fontWeight: "bold",
                fontFamily: "Poppins, sans-serif",
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
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
          <div className="flex items-center">
            <button className="mr-4 text-gray-600 hover:text-gray-900 cursor-pointer" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left text-lg"></i>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Patient Medication Summary</h1>
              {patientInfo && (
                <p className="text-sm text-gray-600">
                  {patientInfo.fullName} · {calculateAge(patientInfo.dateOfBirth)} years old
                </p>
              )}
            </div>
          </div>
          {/* 
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Time Period:</span>
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
           */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Box aligned right */}
        <div className="mb-4 flex justify-end">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search by medicine name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full text-sm pr-10"
            />
            <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
          </div>
        </div>

        {filteredPrescriptions.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No prescriptions match your search.
          </div>
        ) : (
          filteredPrescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 mb-6 ${
                expandedCard === prescription.id ? "pb-6" : ""
              }`}
            >
              <div
                onClick={() => toggleCard(prescription.id)}
                className="px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center cursor-pointer hover:bg-gray-100 gap-2"
              >
                {/* Left side: Medicine name + dosage + progress (on mobile) */}
                <div className="flex-1 w-full">
                  <div className="flex items-center flex-wrap">
                    <h3 className="text-lg font-bold">{prescription.medicineName}</h3>
                    <span
                      className={`ml-3 mt-1 sm:mt-0 px-2 py-1 text-xs rounded-full ${
                        prescription.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : prescription.status === "Ongoing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {prescription.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{prescription.dosage}</p>

                  {/* Progress bar: always shown, but stacked on mobile */}
                  <div className="mt-2 flex flex-wrap items-center gap-2 sm:hidden">
                    <span className="text-sm font-medium">Adherence:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${getAdherenceColorClass(prescription.adherence.rate)}`}
                        style={{ width: `${prescription.adherence.rate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{prescription.adherence.rate}%</span>
                  </div>
                </div>

                {/* Right side: Dates + progress (only on sm and up) */}
                <div className="text-right">
                  <p className="text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(prescription.startDate)} - {formatDate(prescription.endDate)}
                  </p>
                  <div className="mt-2 flex items-center justify-end gap-2">
                    <span className="text-sm font-medium">Adherence:</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${getAdherenceColorClass(prescription.adherence.rate)}`}
                        style={{ width: `${prescription.adherence.rate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{prescription.adherence.rate}%</span>
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="ml-4">
                  <i
                    className={`fas fa-chevron-${expandedCard === prescription.id ? "up" : "down"} text-gray-400`}
                  ></i>
                </div>
              </div>

              {expandedCard === prescription.id && (
                <div className="px-6 pt-2">
                  <div className="mb-6 bg-teal-50 p-4 rounded-md border border-teal-400">
                    <h4 className="text-sm font-semibold text-teal-800 mb-1">Instructions:</h4>
                    <p className="text-sm text-teal-700">{prescription.instruction}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Adherence Statistics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="text-sm text-gray-500">Total Scheduled</div>
                          <div className="text-2xl font-semibold mt-1">{prescription.adherence.scheduled}</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-md">
                          <div className="text-sm text-green-700">Taken</div>
                          <div className="text-2xl font-semibold text-green-600 mt-1">
                            {prescription.adherence.taken}
                          </div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-md">
                          <div className="text-sm text-red-700">Missed</div>
                          <div className="text-2xl font-semibold text-red-600 mt-1">
                            {prescription.adherence.missed}
                          </div>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-md">
                          <div className="text-sm text-gray-600">Pending</div>
                          <div className="text-2xl font-semibold text-gray-500 mt-1">
                            {prescription.adherence.pending}
                          </div>
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold text-gray-700 mt-6 mb-3">Recent Dose History</h4>
                      <div className="bg-white border border-gray-200 rounded-md overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {prescription.recentDoses.map((dose, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-sm text-gray-900">{dose.date}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">{dose.time}</td>
                                <td className="px-4 py-2">
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      dose.status === "Taken"
                                        ? "bg-green-100 text-green-800"
                                        : dose.status === "Pending"
                                        ? "bg-gray-100 text-gray-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {dose.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Adherence Visualization</h4>
                      <div className="bg-white border border-gray-200 rounded-md p-4 overflow-x-auto">
                        <div id={`adherence-chart-${prescription.id}`} style={{ height: "300px", minWidth: "300px" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default DoctorPatientMedicationSummary;
