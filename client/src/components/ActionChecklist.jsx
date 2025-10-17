/**
 * ActionChecklist Component
 * Displays actionable steps with checkboxes for emergency response
 */
function ActionChecklist({ actions, checkedActions, onToggle }) {
  const completedCount = checkedActions.length;
  const totalCount = actions.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span>📋</span>
          <span>Actions to Take</span>
        </h3>
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-blue-600">{completedCount}</span> of {totalCount} completed
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-green-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Action Items */}
      <div className="space-y-3">
        {actions.map((action, index) => {
          const isChecked = checkedActions.includes(index);

          return (
            <div
              key={index}
              onClick={() => onToggle(index)}
              className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                isChecked
                  ? 'bg-green-50 border-green-300'
                  : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {/* Checkbox */}
              <div className="flex-shrink-0 mt-0.5">
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    isChecked
                      ? 'bg-green-500 border-green-500'
                      : 'bg-white border-gray-400'
                  }`}
                >
                  {isChecked && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
              </div>

              {/* Action Text */}
              <div className="flex-1">
                <p
                  className={`text-sm leading-relaxed transition-all ${
                    isChecked
                      ? 'text-gray-500 line-through'
                      : 'text-gray-900 font-medium'
                  }`}
                >
                  {action}
                </p>
              </div>

              {/* Action Number */}
              <div
                className={`flex-shrink-0 text-xs font-bold ${
                  isChecked ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                #{index + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      {completedCount === totalCount && totalCount > 0 && (
        <div className="mt-4 p-4 bg-green-100 border-2 border-green-400 rounded-lg">
          <p className="text-sm font-semibold text-green-800 text-center flex items-center justify-center gap-2">
            <span>✅</span>
            <span>All actions completed! Stay safe and follow official updates.</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default ActionChecklist;
