interface ValidationErrorModalProps {
  isOpen: boolean;
  errorTitle: string;
  errorMessage: string;
  errorList: string[];
  onClose: () => void;
}

/**
 * Modal displaying validation errors with detailed error list
 */
export function ValidationErrorModal({
  isOpen,
  errorTitle,
  errorMessage,
  errorList,
  onClose,
}: ValidationErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        {/* Modal Header */}
        <div className="bg-red-600 text-white px-6 py-4">
          <h3 className="text-lg font-bold">{errorTitle}</h3>
        </div>
        
        {/* Modal Body */}
        <div className="px-6 py-4">
          <p className="text-gray-700 font mb-4">
            {errorMessage || "Please fix the following errors:"}
          </p>
          
          {/* Error List */}
          {errorList.length > 0 ? (
            <ul className="space-y-2 mb-4">
              {errorList.map((error, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-red-600 text-lg flex-shrink-0 mt-0.5">•</span>
                  <span className="text-gray-700 text-sm">{error}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        
        {/* Modal Footer */}
        <div className="bg-gray-100 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
