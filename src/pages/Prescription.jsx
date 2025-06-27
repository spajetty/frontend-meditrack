import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Prescription() {
  const { user } = useAuth();
  //console.log("user from context:", user);

  const [prescriptions, setPrescriptions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    medicineName: "",
    instruction: "",
    startDate: "",
    endDate: "",
    scheduleType: "daily", // 'daily' or 'custom'
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  const handleRemoveTime = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== indexToRemove),
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
      patientId: user.patientId,
      days: formData.days.map((dayName) =>
        ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(dayName)
      ),
      times: formData.times,
    };

    try {
      const res = await axios.post("https://localhost:7015/api/prescriptions", payload);
      console.log("Prescription added:", res.data);
      fetchPrescriptions();
      setShowForm(false);

      setFormData({
        medicineName: "",
        instruction: "",
        startDate: "",
        endDate: "",
        isRecurring: false,
        recurringIntervalHours: "",
        days: [],
        times: [],
      });

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
          onClick={() => {
            if (showForm) {
              // Reset form when closing
              setFormData({
                medicineName: "",
                instruction: "",
                startDate: "",
                endDate: "",
                isRecurring: false,
                recurringIntervalHours: "",
                days: [],
                times: [],
              });
            }
            setShowForm(!showForm);
          }}
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

          <div className="mb-4">
            <label className="font-semibold">Schedule Type:</label>
            <div className="flex gap-4 mt-2">
              <label>
                <input
                  type="radio"
                  name="scheduleType"
                  value="daily"
                  checked={formData.scheduleType === "daily"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      scheduleType: e.target.value,
                      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    }))
                  }
                />
                <span className="text-transparent">s</span> Daily
              </label>
              <label>
                <input
                  type="radio"
                  name="scheduleType"
                  value="custom"
                  checked={formData.scheduleType === "custom"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      scheduleType: e.target.value,
                      days: [],
                    }))
                  }
                />
                <span className="text-transparent">s</span>Choose Specific Day(s)
              </label>
            </div>
          </div>

          {formData.scheduleType === "custom" && (
            <div>
              <label className="font-semibold">Select Day(s):</label>
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
          )}

          <div>
            <label className="font-semibold">Time(s) to take medicine:</label>
            {formData.times.map((time, index) => (
              <>
                <div className="w-12/12 flex flex-row flex-center">
                  <div className="w-11/12 flex-center">
                    <input
                      key={index}
                      type="time"
                      value={time}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                      className="w-full border p-2 rounded mb-2"
                    />
                  </div>
                  <div className="w-1/12 flex-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(index)}
                      className="hover:opacity-70"
                      title="Remove time"
                    >
                      <svg
                        width="28px"
                        height="28px"
                        viewBox="-2.16 -2.16 28.32 28.32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#d81313"
                        strokeWidth="1.176"
                      >
                        <path
                          d="M15 12.75C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H15Z"
                          fill="#d81313"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z"
                          fill="#d81313"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            ))}
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={handleAddTime}
            >
              <span className="text-transparent">s</span><span className="font-bold">+ Add Time</span>
            </button>
          </div>

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
              <th className="px-4 py-2">Times</th>
              <th className="px-4 py-2">Days</th>
              <th className="px-4 py-2">Dose Status</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((p) => (
              <tr key={p.prescriptionId} className="border-t align-top">
                <td className="px-4 py-2">{p.medicineName}</td>
                <td className="px-4 py-2">{new Date(p.startDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">{new Date(p.endDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <ul className="list-disc pl-4">
                    {p.prescriptionTimes?.map((t, i) => (
                      <li key={i}>{t.timeOfDay}</li>
                    )) || "-"}
                  </ul>
                </td>
                <td className="px-4 py-2">
                  <ul className="list-disc pl-4">
                    {p.prescriptionDays?.map((d, i) => (
                      <li key={i}>
                        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.dayOfWeek]}
                      </li>
                    )) || "-"}
                  </ul>
                </td>
                <td className="px-4 py-2">
                  <ul className="list-disc pl-4">
                    {p.doseLogs?.length > 0
                      ? p.doseLogs.map((log, i) => (
                          <li key={i}>
                            {log.takenTime ? `✅ Taken @ ${log.takenTime}` : `⏰ Missed (Scheduled ${log.scheduledDateTime})`}
                          </li>
                        ))
                      : "-"}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
