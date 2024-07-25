import React, { useState } from "react";
import PixelCanvas from "./PixelCanvas";
import SelectionDetails from "./SelectionDetails";
import { Pixel } from "../interfaces/Pixel";

const MainContainer: React.FC<{ pixels: Pixel[] }> = ({ pixels }) => {
  const [selectedPixels, setSelectedPixels] = useState<
    { id: string; x: number; y: number }[]
  >([]);

  const handlePixelSelection = (
    selected: { id: string; x: number; y: number }[]
  ) => {
    setSelectedPixels(selected);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4">
      <div className="flex-grow">
        <PixelCanvas
          pixels={pixels}
          width={1000}
          height={1000}
          onPixelSelection={handlePixelSelection}
        />
      </div>
      <div className="w-full md:w-1/3">
        <SelectionDetails selectedPixels={selectedPixels} />
      </div>
    </div>
  );
};

export default MainContainer;
