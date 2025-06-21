export default function Modal({ show, onClose, message, success = false }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`p-6 rounded shadow-lg ${success ? 'bg-green-500' : 'bg-red-500'} text-white max-w-sm w-full`}>
        <p className="mb-4 text-center text-lg">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-white text-black py-2 rounded hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}
