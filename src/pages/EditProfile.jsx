import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

const EditProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
          setFormData(response.data);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };

      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const endpoint =
      user.role === 'doctor'
        ? `https://localhost:7015/api/doctor/${user.doctorId}`
        : `https://localhost:7015/api/patients/${user.patientId}`;

    const dataToSend =
      user.role === 'doctor'
        ? {
            fullName: formData.fullName,
            email: formData.email,
            specialty: formData.specialty,
          }
        : formData;

    await axios.put(endpoint, dataToSend);

    setModalMessage('Profile updated successfully!');
    setModalSuccess(true);
    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
      navigate('/profile');
    }, 2000);
  } catch (error) {
    console.error('Error updating profile:', error);
    setModalMessage('Failed to update profile. Please try again.');
    setModalSuccess(false);
    setShowModal(true);
  }
};


  const handleCancel = () => {
    navigate('/profile');
  };

  if (!profile) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block font-medium mb-1">Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Doctor-specific field */}
        {user.role === 'doctor' && (
          <div>
            <label className="block font-medium mb-1">Specialty:</label>
            <input
              type="text"
              name="specialty"
              value={formData.specialty || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        )}

        {/* Patient-specific field */}
        {user.role === 'patient' && (
          <div>
            <label className="block font-medium mb-1">Date of Birth:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth ? formData.dateOfBirth.substring(0, 10) : ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        )}

        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </form>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        message={modalMessage}
        success={modalSuccess}
      />
    </div>
  );
};

export default EditProfile;
