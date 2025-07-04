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

  const handleFrequencyChange = (type) => {
    if (type === "daily") {
      setFormData((prev) => ({
        ...prev,
        scheduleType: type,
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],  // All days
      }));
    } else if (type === "custom") {
      setFormData((prev) => ({
        ...prev,
        scheduleType: type,
        days: [], // Start with empty days for custom
      }));
    }
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
      // frequencyType: formData.scheduleType,
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg lg:w-[50%] md:w-[60%] sm:w-[90%] max-w-[95%] max-h-[90vh] overflow-y-auto space-y-4 sm:max-w-[95%]"
      >
        
        <div className="flex justify-between items-center border-b border-gray-200 py-3 mb-2">
          <h2 className="text-xl font-bold text-gray-800">
            Add Prescription
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

         <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Medicine Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="medicineName"
              value={formData.medicineName}
              onChange={handleInputChange}
              placeholder="e.g. Paracetamol, Amoxicillin"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Dosage <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleInputChange}
              placeholder="e.g. '500mg', '5 ml'"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Instructions <span className="text-gray-500 text-sm font-normal">(Optional)</span>
            </label>
            <textarea
              name="instruction"
              value={formData.instruction}
              onChange={handleInputChange}
              placeholder="e.g. 'After meals', 'Before bedtime', 'Take with water'"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
            />
          </div>  

          {/*Schedule Section*/}  
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
              Schedule Type <span className="text-red-500">*</span>
            </label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="scheduleType"
                value="daily"
                checked={formData.scheduleType === "daily"}
                onChange={() => handleFrequencyChange('daily')}
              />
              <span className="ml-1">Daily</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="scheduleType"
                value="custom"
                checked={formData.scheduleType === "custom"}
                onChange={() => handleFrequencyChange('custom')}
              />
              <span className="ml-1">Custom Days</span>
            </label>
          </div>
        </div>

        {formData.scheduleType === "custom" && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Select Days</label>

            {/* Quick select buttons */}
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  }))
                }
                className="px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Weekdays
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    days: ["Saturday", "Sunday"],
                  }))
                }
                className="px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Weekends
              </button>
            </div>

            {/* Day toggle buttons */}
            <div className="flex flex-wrap gap-2">
              {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer transition-colors ${
                    formData.days.includes(day)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>    
        )}

        {/* Time Input Section */}
        <div className="flex justify-between items-center mb-4">
          <label className="block text-gray-700 font-medium mb-2">Time(s) to take medicine: <span className="text-red-500">*</span></label>
          <button
            type="button"
            onClick={handleAddTime}
            className="text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            + Add Time
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
            {formData.times.map((time, index) => (
            <div key={index} className="flex items-center bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
              <input
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(index, e.target.value)}
                className="w-full border p-2 rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveTime(index)}
                className="ml-2 text-gray-400 hover:text-red-500 cursor-pointer"
                title="Remove"
                disabled={formData.times.length === 1}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
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
