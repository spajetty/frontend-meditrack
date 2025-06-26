export default function Modal({ show, onClose, message, success = false, onConfirm = null }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">

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

        {/* ✅ If onConfirm exists, show Yes/Cancel buttons (confirmation mode) */}
        {onConfirm ? (
          <div className="flex space-x-2">
            <button
              onClick={onConfirm}
              className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Yes
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-gray-800 text-white hover:bg-gray-900 transition"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
