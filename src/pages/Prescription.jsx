import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import FormModal from "../components/FormModal";
import EditModal from "../components/EditModal";
import { useNavigate } from "react-router-dom";

export default function Prescription() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewingHistoryId, setViewingHistoryId] = useState(null);
  const [sortField, setSortField] = useState('startDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const fetchPrescriptions = async () => {
    if (!user?.patientId) return;
    try {
      const res = await axios.get(`https://meditrack-f9bqhsedfqbaf2es.canadacentral-01.azurewebsites.net/api/prescriptions/${user.patientId}`);
      setPrescriptions(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [user]);

  const filteredPrescriptions = prescriptions.filter(p =>
    p.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPrescriptions = [...filteredPrescriptions].sort((a, b) => {
    let valA, valB;

    if (sortField === 'startDate') {
      valA = new Date(a.startDate);
      valB = new Date(b.startDate);
    } else if (sortField === 'medicineName') {
      valA = a.medicineName.toLowerCase();
      valB = b.medicineName.toLowerCase();
    } else if (sortField === 'status') {
      const getStatus = (p) => new Date(p.endDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0) ? 'Finished' : 'Ongoing';
      valA = getStatus(a);
      valB = getStatus(b);
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  const confirmDelete = (id) => {
    setSelectedDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://meditrack-f9bqhsedfqbaf2es.canadacentral-01.azurewebsites.net/api/prescriptions/${selectedDeleteId}`);
      setShowDeleteModal(false);
      setSelectedDeleteId(null);
      fetchPrescriptions();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
  <div className="p-4">
    <div className="flex justify-between items-center mb-4 md:flex-row flex-col">
      <div className="flex-center">
        <h2 className="text-2xl font-bold">All Prescriptions</h2>
      </div>
      <div className="flex gap-2">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer transition"
          onClick={() => navigate("/today-prescriptions")}
        >
          See Today
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

    {/* Search Box aligned right */}
    <div className="mb-4 flex justify-end">
      <div className="relative w-full max-w-xs">
        <input
          type="text"
          placeholder="Search by medicine name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white border border-gray-300 rounded px-3 py-2 w-full text-sm pr-10"
        />
        <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full table-auto bg-white rounded shadow">
        <thead>
          <tr className="bg-emerald-100 text-center">
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('medicineName')}>
              Medicine {sortField === 'medicineName' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th className="px-4 py-2">Instruction</th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('startDate')}>
              Duration {sortField === 'startDate' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th className="px-4 py-2">Dosage</th>
            <th className="px-4 py-2">Times</th>
            <th className="px-4 py-2">Days</th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('status')}>
              Status {sortField === 'status' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredPrescriptions.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                No matching prescriptions found.
              </td>
            </tr>
          ) : (
            sortedPrescriptions.map((p) => (
              <tr key={p.prescriptionId} className="border-t text-center">
                <td className="px-4 py-2">{p.medicineName}</td>
                <td className="px-4 py-2 w-50">{p.instruction}</td>
                <td className="px-4 py-2">
                  {new Date(p.startDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  - <br />
                  {new Date(p.endDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-2">{p.dosage || "-"}</td>
                <td className="px-4 py-2 text-center">
                  {p.prescriptionTimes?.length > 0 ? (
                    p.prescriptionTimes
                      .map((t) => {
                        const [hourStr, minStr] = t.timeOfDay.split(":");
                        const hour = parseInt(hourStr, 10);
                        const ampm = hour >= 12 ? "PM" : "AM";
                        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
                        return `${hour12}:${minStr} ${ampm}`;
                      })
                      .join(", ")
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {p.prescriptionDays?.length === 7 ? (
                    <span>Daily</span>
                  ) : p.prescriptionDays?.length > 0 ? (
                    <span>
                      {p.prescriptionDays
                        .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                        .map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.dayOfWeek])
                        .join(", ")}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-2">
                  {new Date(p.endDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) ? (
                    <span className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs">Finished</span>
                  ) : (
                    <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">Ongoing</span>
                  )}
                </td>

                <td className="px-4 py-2 flex gap-3 flex-wrap justify-center text-lg">
                  <button
                    title="Edit"
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    onClick={() => setEditing(p)}
                  >
                    <i className="fas fa-pen"></i>
                  </button>
                  <button
                    title="Delete"
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                    onClick={() => confirmDelete(p.prescriptionId)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                  <button
                    title="History"
                    className="text-purple-600 hover:text-purple-800 cursor-pointer"
                    onClick={() => navigate(`/medication-history/${p.prescriptionId}`)}
                  >
                    <i className="fas fa-history"></i>
                  </button>

                </td>


              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {showAdd && (
      <FormModal onSaved={fetchPrescriptions} onClose={() => setShowAdd(false)} />
    )}
    {editing && (
      <EditModal
        prescription={editing}
        onSaved={fetchPrescriptions}
        onClose={() => setEditing(null)}
      />
    )}

    {viewingHistoryId && (
      <HistoryModal
        prescriptionId={viewingHistoryId}
        onClose={() => setViewingHistoryId(null)}
      />
    )}
  </div>
);

}

// 🔽 Modal Component (inside same file for simplicity)
function HistoryModal({ prescriptionId, onClose }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`https://meditrack-f9bqhsedfqbaf2es.canadacentral-01.azurewebsites.net/api/doselog/history/${prescriptionId}`);
        setLogs(res.data);
      } catch (err) {
        console.error("History fetch error:", err);
      }
    };
    fetchLogs();
  }, [prescriptionId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg max-h-[80vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Dose History</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-gray-500 py-4">No history to show.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.doseLogId}>
                  <td className="px-4 py-2">{new Date(log.scheduledDateTime).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{new Date(log.scheduledDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-4 py-2">{log.status === 1 ? "Taken" : "Missed"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>

      <Modal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedDeleteId(null);
        }}
        message="Are you sure you want to delete this prescription?"
        onConfirm={handleDelete}
      />
    </div>
  );
}