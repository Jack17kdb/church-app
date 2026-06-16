import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmDialog = ({ open, title, message, confirmText = 'Confirm', danger = false, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fadeIn">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-100' : 'bg-church-100'}`}>
            <FaExclamationTriangle className={danger ? 'text-red-500' : 'text-church-500'} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-1">{title}</h3>
            <p className="text-gray-500 text-sm">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="btn-ghost flex-1 border border-gray-200">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 ${danger ? 'btn-danger' : 'btn-primary'}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
