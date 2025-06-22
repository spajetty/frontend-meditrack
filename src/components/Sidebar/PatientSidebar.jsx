import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/meditrack-logo.png";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { to: "/patient-dashboard", label: "Dashboard" },
  { to: "/profile", label: "Profile" },
  { to: "/prescriptions", label: "Prescriptions" },
  { to: "/how-to-use", label: "How to Use" },
];

export default function PatientSidebar({ mobile = false, onClose = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("role");
    navigate("/login?role=patient"); // or ?role=patient 
 };

  return (
    <div className={`${mobile ? "p-2" : "h-screen w-64 bg-dark-teal text-white flex flex-col"}`}>
      {!mobile && (
        <div className="flex items-center space-x-2 p-4 border-b border-gray-600">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <h1 className="font-bold text-xl">
            <span className="text-emerald-400">Medi</span>
            <span className="text-cyan-400">Track</span>
          </h1>
        </div>
      )}
      <nav className={`${mobile ? "bg-dark-teal" : "flex-1 p-2 space-y-1"}`}>
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={`flex items-center px-3 py-2 rounded hover:bg-emerald-600 ${
              location.pathname === item.to ? "bg-emerald-700" : ""
            }`}
          >
            <span className="mr-2">📌</span> {item.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="w-full p-3 bg-red-500 hover:bg-red-600 text-center text-white"
      >
        Logout
      </button>
    </div>
  );
}
