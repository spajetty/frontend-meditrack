import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as echarts from 'echarts';
import { useParams } from 'react-router-dom';

const MedicationHistory = () => {
  const { patientId } = useParams();    
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    axios
      .get(`https://localhost:7015/api/doselogs/patient/${patientId}`)
      .then((response) => {
        const formattedData = response.data.map((entry) => ({
          id: entry.id,
          date: entry.date,
          time: entry.time,
          medicineName: entry.medicineName,
          dosage: entry.dosage,
          status: entry.status.toLowerCase(),
          notes: entry.notes || '',
          effectiveness: entry.effectiveness || 0,
        }));
        setMedicationHistory(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching dose logs:', error);
      });
  }, [patientId]);

  const filteredMedications = medicationHistory.filter((med) => {
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Taken' && med.status === 'taken') ||
      (activeFilter === 'Missed' && med.status === 'missed') ||
      (activeFilter === 'Pending' && med.status === 'pending');

    const matchesSearch =
      med.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.dosage.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    const chartDom = document.getElementById('adherence-chart');
    if (chartDom) {
      const chart = echarts.init(chartDom);

      const taken = medicationHistory.filter((m) => m.status === 'taken').length;
      const missed = medicationHistory.filter((m) => m.status === 'missed').length;
      const pending = medicationHistory.filter((m) => m.status === 'pending').length;

      chart.setOption({
        animation: false,
        tooltip: { trigger: 'item' },
        legend: {
          top: '0%',
          left: 'center',
          textStyle: {
            color: '#333'
          }
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
              borderWidth: 2
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
              { value: pending, name: 'Pending', itemStyle: { color: '#F59E0B' } },
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
  const pending = medicationHistory.filter((m) => m.status === 'pending').length;
  const adherenceRate = total > 0 ? Math.round((taken / total) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Medication History</h1>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search medication..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded w-full text-sm"
        />
        <div className="flex space-x-2">
          {['All', 'Taken', 'Missed', 'Pending'].map((filter) => (
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

      {/* Timeline */}
      <div className="space-y-4">
        {filteredMedications.length === 0 ? (
          <div className="text-center text-gray-500">No records found.</div>
        ) : (
          filteredMedications.map((med, index) => (
            <div key={med.id} className="relative">
              {/* Date Separator */}
              {index === 0 || med.date !== filteredMedications[index - 1].date ? (
                <div className="flex items-center mb-2">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="px-4 py-1 text-sm text-gray-500 bg-gray-100 rounded-full mx-4">
                    {med.date}
                  </span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>
              ) : null}

              {/* Medication Card */}
              <div
                onClick={() => setExpandedCard(expandedCard === med.id ? null : med.id)}
                className="ml-6 bg-white border rounded shadow-sm p-4 cursor-pointer hover:shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{med.medicineName}</h3>
                    <p className="text-sm text-gray-600">
                      {med.dosage} at {med.time}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium rounded-full px-2 py-1 capitalize ${
                      med.status === 'taken'
                        ? 'bg-green-100 text-green-700'
                        : med.status === 'missed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {med.status}
                  </span>
                </div>

                {expandedCard === med.id && (
                  <div className="mt-2 text-sm text-gray-700">
                    <p>
                      <strong>Notes:</strong> {med.notes || 'No notes.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats and Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
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
          <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
            <div>
              <p className="font-semibold text-green-600">{taken}</p>
              <p>Taken</p>
            </div>
            <div>
              <p className="font-semibold text-red-600">{missed}</p>
              <p>Missed</p>
            </div>
            <div>
              <p className="font-semibold text-yellow-600">{pending}</p>
              <p>Pending</p>
            </div>
          </div>
        </div>

        {/* Adherence Chart */}
        <div className="bg-white border rounded shadow-sm p-4">
          <h4 className="font-semibold mb-2">Adherence Chart</h4>
          <div id="adherence-chart" className="w-full" style={{ height: 200 }}></div>
        </div>


      </div>
    </div>
  );
};

export default MedicationHistory;
