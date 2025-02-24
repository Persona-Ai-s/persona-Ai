export const Dial = ({ label, value, tooltip, color = "#3498db" }: { label: string; value: number; tooltip: string; color?: string }) => {
  const radius = 24; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle
  const offset = circumference - (value / 10) * circumference; // Stroke offset based on value out of 10

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex justify-center items-center w-16 h-16 group">
        <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="#e5e7eb" // Gray background circle
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke={color} // Use the color prop for the stroke
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease" }} // Smooth transition for the fill
          />
        </svg>
        <div className="absolute flex justify-center items-center w-full h-full">
          <span className="text-sm font-semibold">{value}/10</span>
        </div>
        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-4" style={{ minWidth: '100px' }}>
          {tooltip}
        </div>
      </div>
      <div className="text-center mt-2 text-sm font-semibold">{label}</div>
    </div>
  );
};
