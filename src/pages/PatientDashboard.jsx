import { useNavigate } from "react-router-dom";
import banner from '../assets/bg-meditrack.png';
import { useAuth } from "../context/AuthContext";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="text-center flex-center px-4 py-8 flex-col">
      <div>
        <h1 className="text-4xl font-bold">Welcome to <span className="text-emerald-500">Medi</span>
            <span className="text-cyan-500">Track</span>, {user.fullName}!</h1>
      </div><br />
      <div>
        <img src={banner} alt="" className="lg:w-xl md:w-lg sm:w-lg w-sm"/>
      </div><br /><br />
      <div className="flex flex-wrap gap-4 mb-4">
        <button
          onClick={() => navigate("/today-prescriptions")}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-md transition"
        >
          Today's Prescriptions
        </button>
        <button
          onClick={() => navigate("/prescriptions")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md transition"
        >
          All Prescriptions
        </button>
        <button
          onClick={() => navigate("/how-to-use")}
          className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-md transition"
        >
          How to Use
        </button>
      </div>
    </div>
  );
}
