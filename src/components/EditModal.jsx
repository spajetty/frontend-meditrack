import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function EditModal({ prescription, onClose, onSaved }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData({
      medicineName: prescription.medicineName || "",
      instruction: prescription.instruction || "",
      dosage: prescription.dosage || "",
      startDate: prescription.startDate?.split("T")[0] || "",
      endDate: prescription.endDate?.split("T")[0] || "",
      days: (prescription.prescriptionDays || []).map(d => 
        ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.dayOfWeek]
      ),
      times: (prescription.prescriptionTimes || []).map(t => t.timeOfDay),
      isRecurring: prescription.isRecurring || false
    });
  }, [prescription]);

  const update = (key, val) => setFormData(f => ({ ...f, [key]: val }));
  const toggleDay = (day) => {
    update("days", formData.days.includes(day)
      ? formData.days.filter(d => d !== day)
      : [...formData.days, day]);
  };
  const changeTime = (i, val) => {
    const arr = [...formData.times]; arr[i] = val;
    update("times", arr);
  };
  const remTime = (i) => update("times", formData.times.filter((_,j) => j!==i));
  const addTime = () => update("times", [...formData.times, ""]);

  const handleSave = async (e) => {
    e.preventDefault();

    const payload = {
      medicineName: formData.medicineName,
      instruction: formData.instruction,
      dosage: formData.dosage,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isRecurring: formData.isRecurring,
      patientId: user.patientId,
      times: formData.times, // time strings
      days: !formData.isRecurring
        ? formData.days.map(day =>
            ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].indexOf(day)
          )
        : []
    };

    try {
      await axios.put(`https://localhost:7015/api/prescriptions/${prescription.prescriptionId}`, payload);
      onSaved();
      onClose();
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-2 py-4 sm:px-4">
      <form 
        onSubmit={handleSave} 
        className="bg-white p-6 rounded-lg shadow-lg lg:w-[50%] md:w-[60%] sm:w-[90%] max-w-[95%] max-h-[90vh] overflow-y-auto space-y-4 sm:max-w-[95%]"
      >
        <h2 className="text-xl font-semibold">Edit Prescription</h2>
        {/* similar fields as FormModal */}
        <input type="text" name="medicineName" value={formData.medicineName || ""} onChange={e => update("medicineName", e.target.value)} required className="w-full border p-2 rounded"/>
        <textarea name="instruction" value={formData.instruction || ""} onChange={e => update("instruction", e.target.value)} required className="w-full border p-2 rounded"/>
        <input
          type="text"
          name="dosage"
          value={formData.dosage}
          onChange={e => update("dosage", e.target.value)}
          placeholder="Dosage (e.g. 130 mg, 75g)"
          required
          className="w-full border p-2 rounded"
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:flex-1">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate || ""}
              onChange={e => update("startDate", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="w-full sm:flex-1">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate || ""}
              onChange={e => update("endDate", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
        <label className="font-semibold">Select Days:</label>
        <div className="grid grid-cols-3 gap-2">
          {["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map(day => (
            <label key={day} className="flex items-center">
              <input type="checkbox" checked={formData.days?.includes(day)} onChange={() => toggleDay(day)} />
              <span className="ml-1">{day}</span>
            </label>
          ))}
        </div>

        <label className="font-semibold">Time(s):</label>
        {formData.times?.map((t,i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="time" value={t || ""} onChange={e => changeTime(i, e.target.value)} className="border p-2 rounded flex-1"/>
            <button type="button" onClick={() => remTime(i)} className="text-red-500">×</button>
          </div>
        ))}
        <button type="button" onClick={addTime} className="text-blue-500 hover:underline">+ Add Time</button>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
        </div>
      </form>
    </div>
  );
}
