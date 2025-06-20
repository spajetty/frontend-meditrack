import Navbar from "../components/Navbar";

export default function LandingLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <main className="flex-1">{children}</main>{/* Footer */}
      <footer className="bg-[#115456] text-white text-center py-4">
        © 2025 MediTrack. All rights reserved.
      </footer>
    </div>
  );
}
