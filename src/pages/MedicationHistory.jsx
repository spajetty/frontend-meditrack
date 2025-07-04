import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as echarts from 'echarts';
import { useParams } from 'react-router-dom';

const MedicationHistory = () => {
  const { prescriptionId } = useParams();
  const [prescriptionName, setPrescriptionName] = useState('');
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!prescriptionId) return;

    // Fetch prescription name
    axios
      .get(`https://localhost:7015/api/prescriptions/details/${prescriptionId}`)
      .then((response) => {
        setPrescriptionName(response.data.medicineName);
      })
      .catch((error) => {
        console.error('Error fetching prescription details:', error);
      });

    // Fetch medication history (dose logs)
    axios
      .get(`https://localhost:7015/api/doselog/history/${prescriptionId}`)
      .then((response) => {
        const formattedData = response.data
          .filter((entry) => entry.status === 1 || entry.status === 2)
          .map((entry) => {
            let statusString = entry.status === 1 ? 'taken' : 'missed';
            const dateObj = new Date(entry.scheduledDateTime);
            const formattedDate = dateObj.toISOString().split('T')[0];

            return {
              id: entry.doseLogId,
              date: formattedDate,
              time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: statusString,
              fullDate: dateObj,
            };
          })
          .sort((a, b) => b.fullDate - a.fullDate); // ✅ Sort newest first

        setMedicationHistory(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching dose logs:', error);
      });
  }, [prescriptionId]);

  console.log('Prescption Name:', prescriptionName);  
  console.log('Prescription ID:', prescriptionId);
  const filteredMedications = medicationHistory.filter((med) => {
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Taken' && med.status === 'taken') ||
      (activeFilter === 'Missed' && med.status === 'missed');

    const matchesSearch = med.date.includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    const chartDom = document.getElementById('adherence-chart');
    if (chartDom) {
      const chart = echarts.init(chartDom);

      const taken = medicationHistory.filter((m) => m.status === 'taken').length;
      const missed = medicationHistory.filter((m) => m.status === 'missed').length;

      chart.setOption({
        animation: false,
        tooltip: { trigger: 'item' },
        legend: {
          top: '0%',
          left: 'center',
          textStyle: { color: '#333' },
        },
        series: [
          {
            name: 'Adherence',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: { show: false, position: 'center' },
            emphasis: {
              label: {
                show: true,
                fontSize: 18,
                fontWeight: 'bold',
              },
            },
            data: [
              { value: taken, name: 'Taken', itemStyle: { color: '#10B981' } },
              { value: missed, name: 'Missed', itemStyle: { color: '#EF4444' } },
            ],
          },
        ],
      });

      const handleResize = () => chart.resize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };
    }
  }, [medicationHistory]);

  const total = medicationHistory.length;
  const taken = medicationHistory.filter((m) => m.status === 'taken').length;
  const missed = medicationHistory.filter((m) => m.status === 'missed').length;
  const adherenceRate = total > 0 ? Math.round((taken / total) * 100) : 0;

return (
  <div className="max-w-7xl mx-auto px-4 py-6">
    {/* Header */}
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-1">Medication History</h1>
      <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
        <span className="font-semibold">Prescription:</span>
        <span>{prescriptionName}</span>
      </div>
    </div>

    {/* Filter */}
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <input
        type="text"
        placeholder="Search by date (YYYY-MM-DD)..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border px-3 py-2 rounded w-full text-sm"
      />
      <div className="flex space-x-2">
        {['All', 'Taken', 'Missed'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-2 rounded text-sm ${
              activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>

    {/* Left-Right Layout */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {/* Left Column: Adherence Rate + Chart */}
      <div className="space-y-4">
        {/* Adherence Rate */}
        <div className="bg-white border rounded shadow-sm p-4">
          <h4 className="font-semibold mb-2">Adherence Rate</h4>
          <p className="text-2xl font-bold text-blue-600">{adherenceRate}%</p>
          <div className="h-2 bg-gray-200 rounded mt-2">
            <div
              className="h-2 bg-blue-600 rounded"
              style={{ width: `${adherenceRate}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3 text-center text-xs">
            <div>
              <p className="font-semibold text-green-600">{taken}</p>
              <p>Taken</p>
            </div>
            <div>
              <p className="font-semibold text-red-600">{missed}</p>
              <p>Missed</p>
            </div>
          </div>
        </div>

        {/* Adherence Chart */}
        <div className="bg-white border rounded shadow-sm p-4">
          <h4 className="font-semibold mb-2">Adherence Chart</h4>
          <div id="adherence-chart" className="w-full" style={{ height: 200 }}></div>
        </div>
      </div>

      {/* Right Column: Table */}
      <div className="md:col-span-2 overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedications.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-gray-500 py-4">
                  No records found.
                </td>
              </tr>
            ) : (
              filteredMedications.map((med) => (
                <tr key={med.id} className="text-sm border-t">
                  <td className="px-4 py-2">{med.date}</td>
                  <td className="px-4 py-2">{med.time}</td>
                  <td className="px-4 py-2 capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        med.status === 'taken'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {med.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

};

export default MedicationHistory;
