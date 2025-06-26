import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Prescription() {
  const { user } = useAuth();
  console.log("user from context:", user);

  const [prescriptions, setPrescriptions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    medicineName: "",
    instruction: "",
    startDate: "",
    endDate: "",
    isRecurring: false,
    recurringIntervalHours: "",
    days: [],
    times: [],
  });

  const fetchPrescriptions = async () => {
    try {
      if (!user || !user.patientId) {
        console.warn("No patient ID found.");
        return;
      }
      const res = await axios.get(`https://localhost:7015/api/prescriptions/${user.patientId}`);
      setPrescriptions(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleAddTime = () => {
    setFormData((prev) => ({
      ...prev,
      times: [...prev.times, ""],
    }));
  };

  const handleTimeChange = (index, value) => {
    const updated = [...formData.times];
    updated[index] = value;
    setFormData((prev) => ({
      ...prev,
      times: updated,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.patientId) {
      console.error("No patient ID available.");
      return;
    }

    const payload = {
      medicineName: formData.medicineName,
      instruction: formData.instruction,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isRecurring: formData.isRecurring,
      recurringIntervalHours: formData.isRecurring
        ? parseInt(formData.recurringIntervalHours)
        : null,
      patientId: user.patientId,
      days: formData.isRecurring
        ? null
        : formData.days.map((dayName) =>
            ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(
              dayName
            )
          ),
      times: formData.isRecurring ? null : formData.times,
    };

    try {
      const res = await axios.post("https://localhost:7015/api/prescriptions", payload);
      console.log("Prescription added:", res.data);
      fetchPrescriptions();
      setShowForm(false);
    } catch (err) {
      if (err.response?.data?.errors) {
        console.error("Validation errors:", err.response.data.errors);
      } else {
        console.error("Submit error:", err);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Prescriptions</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close" : "Add Prescription"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow-md mb-6 space-y-4"
        >
          <input
            type="text"
            name="medicineName"
            placeholder="Medicine Name"
            value={formData.medicineName}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            name="instruction"
            placeholder="Instruction"
            value={formData.instruction}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex-1">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleInputChange}
              />
              &nbsp;Recurring (Every x hours)
            </label>
            {formData.isRecurring && (
              <input
                type="number"
                name="recurringIntervalHours"
                value={formData.recurringIntervalHours}
                onChange={handleInputChange}
                className="w-full border p-2 rounded mt-2"
                placeholder="e.g. 8"
              />
            )}
          </div>

          {!formData.isRecurring && (
            <>
              <div>
                <label>Select Days:</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.days.includes(day)}
                        onChange={() => handleDayToggle(day)}
                      />
                      <span className="ml-1">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label>Times of Day:</label>
                {formData.times.map((time, index) => (
                  <input
                    key={index}
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className="w-full border p-2 rounded mb-2"
                  />
                ))}
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={handleAddTime}
                >
                  + Add Time
                </button>
              </div>
            </>
          )}

          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white rounded shadow">
          <thead>
            <tr className="bg-emerald-100 text-left">
              <th className="px-4 py-2">Medicine</th>
              <th className="px-4 py-2">Start</th>
              <th className="px-4 py-2">End</th>
              <th className="px-4 py-2">Recurring</th>
              <th className="px-4 py-2">Times</th>
              <th className="px-4 py-2">Days</th>
              <th className="px-4 py-2">Dose Status</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((p) => (
              <tr key={p.prescriptionId} className="border-t">
                <td className="px-4 py-2">{p.medicineName}</td>
                <td className="px-4 py-2">{new Date(p.startDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">{new Date(p.endDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  {p.isRecurring ? `Every ${p.recurringIntervalHours} hrs` : "No"}
                </td>
                <td className="px-4 py-2">
                  {p.prescriptionTimes?.map((t) => t.timeOfDay).join(", ") || "-"}
                </td>
                <td className="px-4 py-2">
                  {p.prescriptionDays?.map((d) => d.dayOfWeek).join(", ") || "-"}
                </td>
                <td className="px-4 py-2">
                  {p.doseLogs?.length > 0
                    ? p.doseLogs.map((log) =>
                        log.takenTime ? "✅ Taken" : "⏰ Missed"
                      ).join(", ")
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
