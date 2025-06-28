import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import FormModal from "../components/FormModal";
import { useNavigate } from "react-router-dom";

export default function TodayPrescription() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [todayPrescriptions, setTodayPrescriptions] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const markAsTaken = async (id) => {
    try {
      await axios.post(`https://localhost:7015/api/doselog/mark-taken/${id}`);
      fetchToday(); // Refresh the list to update the status
    } catch (err) {
      console.error("Mark error:", err);
    }
  };

  // Fetch today's prescriptions
  const fetchToday = async () => {
    if (!user?.patientId) return;
    try {
      const res = await axios.get(`https://localhost:7015/api/prescriptions/today/${user.patientId}`);
      setTodayPrescriptions(res.data);
    } catch (err) {
      console.error("Fetch today error:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchToday();
    };
    load();
  }, [user]);

  const handleMarkTaken = async (logId) => {
    await axios.post(`https://localhost:7015/api/doselog/${logId}/mark-taken`);
    fetchToday();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Today's Prescriptions</h2>
        <div className="flex gap-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => navigate("/prescriptions")}
          >
            See All Prescriptions
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setShowAdd(true)}
          >
            Add Prescription
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white rounded shadow">
          <thead>
            <tr className="bg-emerald-100 text-left">
              <th className="px-4 py-2">Medicine</th>
              <th className="px-4 py-2">Instruction</th>
              <th className="px-4 py-2">Duration</th>
              <th className="px-4 py-2">Dosage</th>
              <th className="px-4 py-2">Hour Intake</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {todayPrescriptions.map((log) => (
              <tr key={log.doseLogId} className="border-t">
                <td className="px-4 py-2">{log.prescription.medicineName}</td>
                <td className="px-4 py-2 w-50">{log.prescription.instruction}</td>
                <td className="px-4 py-2">
                  {new Date(log.prescription.startDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })} -{" "} <br />
                  {new Date(log.prescription.endDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-2">{log.prescription.dosage}</td>
                <td className="px-4 py-2">
                  {new Date(log.scheduledDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className="px-4 py-2">
                  {log.status === 0 ? "Pending" : log.status === 1 ? "Taken" : "Missed"}
                </td>
                <td className="px-4 py-2">
                  {log.status !== 1 && (
                    <button
                      className="text-green-600 hover:underline"
                      onClick={() => markAsTaken(log.doseLogId)}
                    >
                      {log.status === 2 ? "Mark as Taken (Late)" : "Mark as Taken"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <FormModal
          onSaved={() => {
            fetchToday(); // refresh today's list
            setShowAdd(false);
          }}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}
