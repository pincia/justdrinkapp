type Props = {
  message: string;
  type: "success" | "error" | "warning" | "info";
};

export default function Snackbar({ message, type }: Props) {
  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-yellow-600",
    info: "bg-gray-800",
  };

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2
        text-white px-4 py-2 rounded-lg shadow-lg
        animate-fade-in-out z-[9999]
        ${colors[type]}
      `}
    >
      {message}
    </div>
  );
}
