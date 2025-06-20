import PatientForm from "./components/PatientForm";
import PatientList from "./components/PatientList";

export default function App() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Medicine Tracker</h1>
      <PatientForm onSuccess={() => window.location.reload()} />
      <PatientList />
    </div>
  );
}