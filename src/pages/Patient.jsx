import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Patient = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'fullName', direction: 'asc' });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('https://meditrack-f9bqhsedfqbaf2es.canadacentral-01.azurewebsites.net/api/patients');
        const filtered = response.data.filter(p => p.doctorId === user.doctorId);
        setPatients(filtered);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    if (user?.role === 'doctor') fetchPatients();
  }, [user]);

  const handleViewHistory = (patientId) => {
    navigate(`/doctor-medication-summary/${patientId}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        return { key, direction: 'asc' };
      }
    });
  };

  const getAge = (dob) => {
    if (!dob) return '-';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredAndSortedPatients = patients
    .filter((p) =>
      p.fullName.toLowerCase().includes(searchTerm) ||
      p.email.toLowerCase().includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortConfig.key === 'age') {
        const ageA = getAge(a.dateOfBirth);
        const ageB = getAge(b.dateOfBirth);
        return sortConfig.direction === 'asc' ? ageA - ageB : ageB - ageA;
      } else {
        const valA = a[sortConfig.key]?.toLowerCase() || '';
        const valB = b[sortConfig.key]?.toLowerCase() || '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
    });

  const getSortArrow = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">My Patients</h1>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full border p-2 pl-10 rounded"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
      </div>

      <table className="w-full border-collapse">
        <thead className="bg-emerald-100">
          <tr>
            <th
              onClick={() => handleSort('fullName')}
              className="border p-2 cursor-pointer hover:bg-gray-100"
            >
              Full Name {getSortArrow('fullName')}
            </th>
            <th
              onClick={() => handleSort('age')}
              className="border p-2 cursor-pointer hover:bg-gray-100"
            >
              Age {getSortArrow('age')}
            </th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedPatients.map((patient) => (
            <tr
              key={patient.patientId}
              className="hover:bg-gray-50 transition duration-150"
            >
              <td className="border p-2">{patient.fullName}</td>
              <td className="border p-2">{getAge(patient.dateOfBirth)}</td>
              <td className="border p-2">{patient.email}</td>
              <td className="border p-2">
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => handleViewHistory(patient.patientId)}
                    title="View Prescriptions"
                    className="cursor-pointer px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
                  >
                    {/* Icon */}
                    <i className="fas fa-eye mr-0 md:mr-2"></i>

                    {/* Text (only show from md and up) */}
                    <span className="hidden md:inline">View Prescriptions</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Patient;
