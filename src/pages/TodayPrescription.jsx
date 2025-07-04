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

      // Sort by scheduled time (earliest first)
      const sorted = res.data.sort((a, b) => new Date(a.scheduledDateTime) - new Date(b.scheduledDateTime));

      setTodayPrescriptions(sorted);
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

  const undoDose = async (id) => {
    try {
      await axios.post(`https://localhost:7015/api/doselog/undo/${id}`);  // ✅ Fixed the typo here
      fetchToday();
    } catch (err) {
      console.error("Undo error:", err);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 md:flex-row flex-col">
        <div className="flex-center">
          <h2 className="text-2xl font-bold">Today's Prescriptions</h2>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer transition"
            onClick={() => navigate("/prescriptions")}
          >
            See All Prescriptions
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded !rounded-button whitespace-nowrap cursor-pointer flex items-center gap-2 transition-colors"
            onClick={() => setShowAdd(true)}
          >
            <i className="fas fa-plus"></i>
            Add Prescription
          </button>
        </div>
      </div>

      <div className="mb-4 flex justify-end items-center gap-2 text-gray-700 text-sm">
        <i className="fas fa-calendar-alt text-blue-600"></i>
        <span className="font-medium">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white rounded shadow">
          <thead>
            <tr className="bg-emerald-100 text-center">
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
            {todayPrescriptions.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Nothing to display yet.
                </td>
              </tr>
            ) : (
              todayPrescriptions.map((log) => (
                <tr key={log.doseLogId} className="border-t text-center">
                  <td className="px-4 py-2">{log.prescription.medicineName}</td>
                  <td className="px-4 py-2 w-50">{log.prescription.instruction}</td>
                  <td className="px-4 py-2">
                    {new Date(log.prescription.startDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })} - <br />
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
                    {log.status === 0 && (
                      <span className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs">Pending</span>
                    )}
                    {log.status === 1 && (
                      <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">Taken</span>
                    )}
                    {log.status === 2 && (
                      <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs">Missed</span>
                    )}
                  </td>

                  <td className="px-4 py-2 text-center space-y-1">
                    {log.status === 0 && (
                      <button
                        className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-500 transition w-39"
                        onClick={() => markAsTaken(log.doseLogId)}
                      >
                        Mark as Taken
                      </button>
                    )}
                    {log.status === 2 && (
                      <button
                        className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-500 transition w-39"
                        onClick={() => markAsTaken(log.doseLogId)}
                      >
                        Taken but Late
                      </button>
                    )}
                    {log.status === 1 && (
                      <button
                        className="bg-yellow-700 text-white px-3 py-1 rounded hover:bg-yellow-500 transition w-39"
                        onClick={() => undoDose(log.doseLogId)}
                      >
                        Undo Action
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
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
