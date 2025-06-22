import { useState } from "react";
import DoctorSidebar from "../components/Sidebar/DoctorSidebar";
import PatientSidebar from "../components/Sidebar/PatientSidebar";
import logo from "../assets/meditrack-logo.png";

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const role = localStorage.getItem("role");

  return (
    <div className="flex h-screen">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        {role === "doctor" ? <DoctorSidebar /> : <PatientSidebar />}
      </div>

      {/* Main content for mobile */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-gray-50">
        {/* Top navbar for mobile */}
        <div className="md:hidden bg-dark-teal text-white flex items-center justify-between p-3">
          {/* Hamburger button */}
          <button onClick={() => setIsOpen(!isOpen)} className="text-2xl font-bold p-2">
            ☰
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <h1 className="font-bold text-lg">
              <span className="text-emerald-400">Medi</span>
              <span className="text-cyan-400">Track</span>
            </h1>
          </div>

          {/* Spacer to balance layout (empty div or add something like profile/settings later) */}
          <div className="w-8"></div>
        </div>

        {/* Mobile sidebar dropdown */}
        {isOpen && (
          <div className="md:hidden bg-dark-teal text-white w-full absolute top-12 left-0 z-50 shadow-lg">
            {role === "doctor" ? (
              <DoctorSidebar mobile onClose={() => setIsOpen(false)} />
            ) : (
              <PatientSidebar mobile onClose={() => setIsOpen(false)} />
            )}
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
