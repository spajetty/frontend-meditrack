export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-cyan-600 text-white p-4 text-xl font-bold">MediTrack Dashboard</header>
      <main className="p-4">{children}</main>
    </div>
  );
}
