import { useNavigate } from "react-router-dom";
import banner from '../assets/bg-meditrack.png';
import { useAuth } from "../context/AuthContext";

export default function PatientDashboard() {
  const { user } = useAuth();

  return (
    <div className="text-center flex-center px-4 py-8 flex-col">
      <div>
        <h1 className="text-4xl font-bold">Welcome to <span className="text-emerald-500">Medi</span>
            <span className="text-cyan-500">Track</span>, {user.fullName}!</h1>
      </div>
      <div>
        <img src={banner} alt="" className="lg:w-xl md:w-lg sm:w-lg w-sm"/>
      </div>
    </div>
  );
}
