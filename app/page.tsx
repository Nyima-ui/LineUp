"use client";
import LineNumbers from "@/components/LineNumbers";
import { useEffect, useState } from "react";
import { Line } from "./types";
import dynamic from "next/dynamic";
import SideBar from "@/components/SideBar";

const Input = dynamic(() => import("@/components/Input"), { ssr: false });

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
    // console.log(lines);
  }, [lines]);
  return (
    <div className="text-foreground bg-background flex bg-main min-h-screen">
      <SideBar />

      <div className="flex text-sm leading-4.75 flex-1 bg-editor">
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
