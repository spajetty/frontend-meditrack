export default function Modal({ show, onClose, message, success = false }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div
        className={`p-6 rounded-2xl shadow-2xl 
          ${success ? 'bg-green-100 border border-green-500' : 'bg-red-100 border border-red-500'}
          w-[80%] sm:w-[400px] animate-fade-in`}
      >
        <p
          className={`mb-4 text-center text-lg font-semibold ${
            success ? 'text-green-700' : 'text-red-700'
          }`}
        >
          {message}
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-gray-800 text-white hover:bg-gray-900 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
