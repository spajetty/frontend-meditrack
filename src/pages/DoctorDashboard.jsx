import DashboardLayout from "../layouts/DashboardLayout";

export default function DoctorDashboard() {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold mb-4">Welcome, Doctor!</h2>
      <p>Your prescriptions, appointments, and more will be displayed here.</p>
    </DashboardLayout>
  );
}
