import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';

const MedicationHistory = () => {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedCard, setExpandedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const medicationHistory = [
    { id: 1, date: '2025-06-27', medicineName: 'Amoxicillin', dosage: '500mg', time: '8:30 AM', status: 'taken', notes: 'No side effects.', effectiveness: 4, medicineType: 'pill' },
    { id: 2, date: '2025-06-26', medicineName: 'Lisinopril', dosage: '10mg', time: '9:00 PM', status: 'missed', notes: 'Forgot to take.', effectiveness: 0, medicineType: 'pill' },
    { id: 3, date: '2025-06-26', medicineName: 'Metformin', dosage: '850mg', time: '1:15 PM', status: 'delayed', notes: 'Took 2 hrs late.', effectiveness: 3, medicineType: 'pill' },
    { id: 4, date: '2025-06-25', medicineName: 'Insulin', dosage: '10 units', time: '7:45 AM', status: 'taken', notes: 'Pre-breakfast.', effectiveness: 5, medicineType: 'injection' },
  ];

  const filteredMedications = medicationHistory.filter(med => {
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Taken' && med.status === 'taken') ||
      (activeFilter === 'Missed' && med.status === 'missed') ||
      (activeFilter === 'Delayed' && med.status === 'delayed');

    const matchesSearch =
      med.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.dosage.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    const chartDom = document.getElementById('adherence-chart');
    if (chartDom) {
      const chart = echarts.init(chartDom);
      const taken = medicationHistory.filter(m => m.status === 'taken').length;
      const missed = medicationHistory.filter(m => m.status === 'missed').length;
      const delayed = medicationHistory.filter(m => m.status === 'delayed').length;

      chart.setOption({
        tooltip: { trigger: 'item' },
        series: [
          {
            name: 'Adherence',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: { show: false, position: 'center' },
            emphasis: {
              label: {
                show: true,
                fontSize: 18,
                fontWeight: 'bold'
              }
            },
            data: [
              { value: taken, name: 'Taken', itemStyle: { color: '#10B981' } },
              { value: missed, name: 'Missed', itemStyle: { color: '#EF4444' } },
              { value: delayed, name: 'Delayed', itemStyle: { color: '#F59E0B' } },
            ]
          }
        ]
      });

      const handleResize = () => chart.resize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };
    }
  }, [medicationHistory]);

  const renderEffectivenessStars = (rating) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map(star => (
        <i key={star} className={`fas fa-star text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}></i>
      ))}
    </div>
  );

  const total = medicationHistory.length;
  const taken = medicationHistory.filter(m => m.status === 'taken').length;
  const missed = medicationHistory.filter(m => m.status === 'missed').length;
  const delayed = medicationHistory.filter(m => m.status === 'delayed').length;
  const adherenceRate = Math.round((taken / total) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Medication History</h1>
        <div className="relative">
          <button
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm hover:bg-gray-50"
          >
            {dateRange} <i className="fas fa-chevron-down ml-2"></i>
          </button>
          {/* Dropdown would go here if implemented */}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search medication..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <div className="flex space-x-2">
          {['All', 'Taken', 'Missed', 'Delayed'].map(filter => (
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

      {/* Timeline List */}
      <div className="space-y-4">
        {filteredMedications.map((med, index) => (
          <div key={med.id} className="relative">
            {/* Date separator */}
            {index === 0 || med.date !== filteredMedications[index - 1].date ? (
              <div className="flex items-center mb-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="px-4 py-1 text-sm text-gray-500">{med.date}</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
            ) : null}

            {/* Card */}
            <div
              className="ml-6 bg-white rounded shadow-sm border p-4 cursor-pointer"
              onClick={() => setExpandedCard(expandedCard === med.id ? null : med.id)}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{med.medicineName}</h3>
                  <p className="text-sm text-gray-600">{med.dosage} at {med.time}</p>
                </div>
                <span className={`text-xs font-medium rounded-full px-2 py-1 ${
                  med.status === 'taken' ? 'bg-green-100 text-green-700' :
                  med.status === 'missed' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {med.status}
                </span>
              </div>

              {expandedCard === med.id && (
                <div className="mt-2 text-sm text-gray-700">
                  <p><strong>Notes:</strong> {med.notes}</p>
                  <p><strong>Effectiveness:</strong> {renderEffectivenessStars(med.effectiveness)}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Stats and Charts */}
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
              <p className="font-semibold text-yellow-600">{delayed}</p>
              <p>Delayed</p>
            </div>
          </div>
        </div>

        {/* Adherence Chart */}
        <div className="bg-white border rounded shadow-sm p-4">
          <h4 className="font-semibold mb-2">Adherence Chart</h4>
          <div id="adherence-chart" style={{ height: 200 }}></div>
        </div>

        {/* Current Streak */}
        <div className="bg-white border rounded shadow-sm p-4 flex items-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <i className="fas fa-fire text-blue-600 text-xl"></i>
          </div>
          <div className="ml-4">
            <h4 className="font-semibold">Current Streak</h4>
            <p className="text-2xl font-bold text-blue-600">3 days</p>
            <p className="text-xs text-gray-500">Keep going!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationHistory;
