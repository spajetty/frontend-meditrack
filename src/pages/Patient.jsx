import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Patient = () => {
  const [patients, setPatients] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('https://localhost:7015/api/patients');
        const filtered = response.data.filter(p => p.doctorId === user.doctorId);
        setPatients(filtered);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    if (user?.role === 'doctor') fetchPatients();
  }, [user]);

  const handleViewHistory = (patientId) => {
    navigate(`/medication-history/${patientId}`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">My Patients</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Full Name</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => {
            const age = patient.dateOfBirth
              ? Math.floor((new Date() - new Date(patient.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
              : '-';
            return (
              <tr
                key={patient.patientId}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="border p-2">{patient.fullName}</td>
                <td className="border p-2">{age}</td>
                <td className="border p-2">{patient.email}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleViewHistory(patient.patientId)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    View Medication History
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Patient;
