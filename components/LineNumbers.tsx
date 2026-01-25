import { Line } from "./types";

interface LineNumbersProps {
  lines: Line[];
  activeLine: number;
}
const LineNumbers = ({ lines, activeLine }: LineNumbersProps) => {
  return (
    <div className="w-15 min-h-screen flex flex-col">
      {lines.map((_, idx) => (
        <div key={idx}>
          <span
            className={`inline-block h-4.75 w-full text-right pr-3  ${activeLine === idx ? "text-white" : "text-white/70"}`}
          >
            {idx + 1}
          </span>
        </div>
      ))}
    </div>
  );
};

export default LineNumbers;
