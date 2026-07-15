import { forwardRef } from "react";

const Input = forwardRef(({
  label,
  type = "text",
  error,
  className = "",
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
        }`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 mt-1">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
