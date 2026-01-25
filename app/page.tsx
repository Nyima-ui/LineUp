"use client";
import LineNumbers from "@/components/LineNumbers";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Input = dynamic(() => import("@/components/Input"), { ssr: false });

let lineId = 0;
const generateId = () => `line-${lineId++}`;

export default function Home() {
  const [lines, setLines] = useState<{ id: string; text: string }[]>([
    { id: generateId(), text: "" },
  ]);
  const [activeLine, setActiveLine] = useState<number>(0);
  
  useEffect(() => {
    // console.log(activeLine);
  }, [activeLine]);
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
