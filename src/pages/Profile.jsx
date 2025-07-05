import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import doctorImg from '../assets/Doctor.png';
import patientImg from '../assets/Patient.png';

const Profile = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const endpoint =
            user.role === 'doctor'
              ? `https://meditrack-f9bqhsedfqbaf2es.canadacentral-01.azurewebsites.net/api/doctor/${user.doctorId}`
              : `https://meditrack-f9bqhsedfqbaf2es.canadacentral-01.azurewebsites.net/api/patients/${user.patientId}`;
          const response = await axios.get(endpoint);
          setProfile(response.data);
          setFormData(response.data);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };

      fetchProfile();

      if (user.role === 'patient') {
        const fetchDoctors = async () => {
          try {
            const doctorResponse = await axios.get('https://meditrack-f9bqhsedfqbaf2es.canadacentral-01.azurewebsites.net/api/doctor');
            setDoctors(doctorResponse.data);
          } catch (error) {
            console.error('Error fetching doctors:', error);
          }
        };
        fetchDoctors();
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'doctorId' ? parseInt(value) : value,
    });
  };

  const handleSave = async () => {
  try {
    const endpoint =
      user.role === 'doctor'
        ? `https://meditrack-f9bqhsedfqbaf2es.canadacentral-01.azurewebsites.net/api/doctor/${user.doctorId}`
        : `https://meditrack-f9bqhsedfqbaf2es.canadacentral-01.azurewebsites.net/api/patients/${user.patientId}`;

    console.log('Saving profile data:', formData);
    await axios.put(endpoint, formData);

    // ✅ After saving, refetch latest profile data
    const updatedProfileResponse = await axios.get(endpoint);
    setProfile(updatedProfileResponse.data);
    setFormData(updatedProfileResponse.data);

    setModalMessage('Profile updated successfully.');
    setModalSuccess(true);
    setShowModal(true);
    setIsEditing(false);
  } catch (error) {
    console.error('Error updating profile:', error);
    setModalMessage('Failed to update profile.');
    setModalSuccess(false);
    setShowModal(true);
  }
};


  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
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
        await axios.delete(`https://meditrack-f9bqhsedfqbaf2es.canadacentral-01.azurewebsites.net/api/doctor/${user.doctorId}`);
      } else if (user.role === 'patient') {
        await axios.delete(`https://meditrack-f9bqhsedfqbaf2es.canadacentral-01.azurewebsites.net/api/patients/${user.patientId}`);
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
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg space-y-4">
      <div className="flex flex-col items-center mb-6">
        <img
          src={user.role === 'doctor' ? doctorImg : patientImg}
          alt="Profile"
          className="w-135 h-auto"
        />
      </div>

      <form className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
        </div>

        {user.role === 'doctor' && (
          <div>
            <label className="block font-medium mb-1">Specialty:</label>
            <input
              type="text"
              name="specialty"
              value={formData.specialty || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
          </div>
        )}

        {user.role === 'patient' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Date of Birth:</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth ? formData.dateOfBirth.substring(0, 10) : ''}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Assigned Doctor:</label>
              {isEditing ? (
                <select
                  name="doctorId"
                  value={formData.doctorId || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.doctorId} value={doctor.doctorId}>
                      {doctor.fullName}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={profile.doctor ? profile.doctor.fullName : 'No doctor assigned'}
                  disabled
                  className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
                />
              )}
            </div>
          </div>
        )}
      </form>

      <div className="flex flex-col items-center space-y-2 mt-4 w-full">
        {!isEditing ? (
          <>
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
          </>
        ) : (
          <div className="flex space-x-2 w-full">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

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
