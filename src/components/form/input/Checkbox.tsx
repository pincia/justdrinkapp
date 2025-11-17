import React from "react";

interface CheckboxProps {
  label?: string;
  checked: boolean;
  className?: string;
  id?: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  id,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <label
      className={`flex items-center space-x-3 group 
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <div className="relative w-5 h-5">
        <input
          id={id}
          type="checkbox"
          className={`
            w-5 h-5 appearance-none rounded-md border 
            ${checked ? "bg-brand-500 border-brand-500" : "bg-white border-gray-300"}
            
            dark:border-gray-700 dark:bg-gray-900
            
            ${disabled
              ? "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600 cursor-not-allowed opacity-100"
              : "cursor-pointer"
            }

            ${className}
          `}
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
        />

        {/* Checkmark */}
        {checked && (
          <svg
            className="absolute top-1/2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
              stroke={disabled ? "#D1D5DB" : "white"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {label && (
        <span
          className={`
            text-sm font-medium
            ${disabled ? "text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-gray-200"}
          `}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
