import { useAuth } from "../context/AuthContext";

export default function HowToUse() {
  const { user } = useAuth();

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-left text-emerald-700 mb-6">How To Use MediTrack</h1>
      <hr /><br />

      {user?.role === "doctor" ? (
        <div>
          <h2 className="text-2xl font-semibold text-emerald-800 mb-4">👨‍⚕️ For Doctors</h2>
          <div className="space-y-6 text-gray-800">
            <div>
              <h3 className="font-semibold text-lg">1. View Dashboard</h3>
              <p>Access a quick overview of your recent activities and patient updates.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">2. Manage Patients</h3>
              <p>See a list of all patients assigned to you, along with their prescription data.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">3. View Prescriptions</h3>
              <p>
                View detailed medication instructions, including dosage, timing, and duration for each patient.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">4. Track Medication Logs</h3>
              <p>
                Track which doses have been taken or missed through the prescription history logs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">5. Profile Management</h3>
              <p>Keep your profile updated or delete your account if necessary.</p>
            </div>
          </div>
        </div>
      ) : user?.role === "patient" ? (
        <div>
          <h2 className="text-2xl font-semibold text-cyan-800 mb-4">🧑‍⚕️ For Patients</h2>
          <div className="space-y-6 text-gray-800">
            <div>
              <h3 className="font-semibold text-lg">1. View Today's Prescriptions</h3>
              <p>Check what medications you need to take today and at what time.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">2. Mark as Taken</h3>
              <p>
                Once you've taken your medicine, click "Mark as Taken" to update your log.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">3. Undo Mistakes</h3>
              <p>Accidentally marked it? Use the "Undo" button to correct it instantly.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">4. View History</h3>
              <p>
                Access your dose history to see what you’ve taken or missed over time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">5. Manage Your Profile</h3>
              <p>Update your personal info or delete your account anytime.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-600 text-center">
          <p>User role not detected. Please log in again.</p>
        </div>
      )}
    </div>
  );
}
