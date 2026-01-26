"use client";
import LineNumbers from "@/components/LineNumbers";
import { useEffect, useState } from "react";
import { Line } from "./types";
import dynamic from "next/dynamic";

// const Input = dynamic(() => import("@/components/Input"), { ssr: false });
const Input = dynamic(() => import("@/components/play"), { ssr: false });

let lineId = 0;
const generateId = () => `line-${lineId++}`;

export default function Home() {
  const [lines, setLines] = useState<Line[]>([{ id: generateId(), text: "" }]);
  const [activeLine, setActiveLine] = useState<number>(0);

  useEffect(() => {
    const fetchLines = (items: Line[]) => setLines(items);
    const items = localStorage.getItem("items");
    if (items) fetchLines(JSON.parse(items));
  }, []);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(lines));
  }, [lines]);

  useEffect(() => {
    console.log(lines);
  }, [lines]);
  return (
    <div className="text-white bg-background min-h-screen">
      <div className="flex text-[14px] leading-4.75">
        <LineNumbers lines={lines} activeLine={activeLine} />
        <Input
          lines={lines}
          setLines={setLines}
          generateId={generateId}
          setActiveLine={setActiveLine}
        />
      </div>
    </div>
  );
}
