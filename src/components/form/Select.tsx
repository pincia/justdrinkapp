import { useEffect, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;       // ⭐ Aggiunto
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  value,
  disabled = false,         // ⭐ Aggiunto
}) => {
  const [internalValue, setInternalValue] = useState<string>(defaultValue);

  const selectedValue = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;

    if (value === undefined) {
      setInternalValue(v);
    }

    onChange(v);
  };

  useEffect(() => {
    if (value === undefined) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, value]);

  return (
    <select
      disabled={disabled}   // ⭐ Aggiunto
      className={`
        h-11 w-full rounded-lg border border-gray-300 bg-transparent
        px-4 py-2.5 pr-11 text-sm shadow-theme-xs
        placeholder:text-gray-400 focus:border-brand-300
        focus:outline-hidden focus:ring-3 focus:ring-brand-500/10
        dark:border-gray-700 dark:bg-gray-900 dark:text-white/90
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
      value={selectedValue}
      onChange={handleChange}
    >
      <option value="" disabled>
        {placeholder}
      </option>

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
