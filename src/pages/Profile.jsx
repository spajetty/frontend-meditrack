import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

const Profile = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const endpoint =
            user.role === 'doctor'
              ? `https://localhost:7015/api/doctor/${user.doctorId}`
              : `https://localhost:7015/api/patients/${user.patientId}`;
          const response = await axios.get(endpoint);
          setProfile(response.data);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };

      fetchProfile();
    }
  }, [user]);

  const handleEdit = () => {
    navigate('/edit-profile');
  };

  const confirmDelete = () => {
    setModalMessage('Are you sure you want to delete your profile? This action cannot be undone.');
    setModalSuccess(false);
    setShowConfirm(true);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      if (user.role === 'doctor') {
        await axios.delete(`https://localhost:7015/api/doctor/${user.doctorId}`);
      } else if (user.role === 'patient') {
        await axios.delete(`https://localhost:7015/api/patients/${user.patientId}`);
      }

      setModalMessage('Profile deleted successfully.');
      setModalSuccess(true);
      setShowConfirm(false);
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error deleting profile:', error);
      setModalMessage('Failed to delete profile. Please try again.');
      setModalSuccess(false);
      setShowConfirm(false);
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setShowConfirm(false);
  };

  if (loading) return <div className="text-center mt-10">Loading authentication...</div>;
  if (!user) return <div className="text-center mt-10">Please log in to view your profile.</div>;
  if (!profile) return <div className="text-center mt-10">Loading profile data...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        {user.role === 'doctor' ? 'Doctor Profile' : 'Patient Profile'}
      </h2>

      <div className="flex flex-col items-center">
        {/* Avatar Placeholder */}
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <span className="text-gray-500 text-xl">👤</span>
        </div>

        {/* Profile Details */}
        <div className="space-y-2 w-full">
          <p><span className="font-semibold">Name:</span> {profile.fullName}</p>
          <p><span className="font-semibold">Email:</span> {profile.email}</p>

          {user.role === 'doctor' && (
            <p><span className="font-semibold">Specialty:</span> {profile.specialty}</p>
          )}

          {user.role === 'patient' && (
            <p>
              <span className="font-semibold">Date of Birth:</span> {new Date(profile.dateOfBirth).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 mt-4 w-full">
          <button
            onClick={handleEdit}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>

          <button
            onClick={confirmDelete}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Delete Profile
          </button>
        </div>
      </div>

      {/* Modal for confirm + success/error */}
      <Modal
        show={showModal}
        onClose={handleModalClose}
        message={modalMessage}
        success={modalSuccess}
        onConfirm={showConfirm ? handleDelete : null}
      />
    </div>
  );
};

export default Profile;
