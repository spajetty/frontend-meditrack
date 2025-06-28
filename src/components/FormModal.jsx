import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function FormModal({ onClose, onSaved }) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    medicineName: "",
    instruction: "",
    dosage: "",
    startDate: "",
    endDate: "",
    scheduleType: "daily", // 'daily' or 'custom'
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    times: [],
  });

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
      dosage: formData.dosage,
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
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      if (err.response?.data?.errors) {
        console.error("Validation errors:", err.response.data.errors);
      } else {
        console.error("Submit error:", err);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Add Prescription</h2>

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
        <input
          type="text"
          name="dosage"
          placeholder="Dosage (e.g. 130 mg, 75g)"
          value={formData.dosage}
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
              <span className="ml-1">Daily</span>
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
              <span className="ml-1">Custom Days</span>
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
            <div key={index} className="flex items-center gap-2 mt-2">
              <input
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(index, e.target.value)}
                className="w-full border p-2 rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveTime(index)}
                className="text-red-500 hover:text-red-700"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTime}
            className="mt-2 text-blue-500 hover:underline"
          >
            + Add Time
          </button>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
