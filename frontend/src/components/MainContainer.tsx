import React, { useState } from "react";
import PixelCanvas from "./PixelCanvas";
import SelectionDetails from "./SelectionDetails";
import { Pixel } from "../interfaces/Pixel";

const MainContainer: React.FC<{ pixels: Pixel[] }> = ({ pixels }) => {
  const [selectedPixels, setSelectedPixels] = useState<
    { id: string; x: number; y: number }[]
  >([]);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(
    null
  );
  const [selectedImagePosition, setSelectedImagePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handlePixelSelection = (
    selected: { id: string; x: number; y: number }[]
  ) => {
    setSelectedPixels(selected);
  };

  const handleImageReady = (image: HTMLImageElement, x: number, y: number) => {
    setSelectedImage(image);
    setSelectedImagePosition({ x, y });
  };

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4">
      <div className="flex-grow">
        <PixelCanvas
          pixels={pixels}
          width={1000}
          height={1000}
          onPixelSelection={handlePixelSelection}
          selectedImage={selectedImage}
          selectedImagePosition={selectedImagePosition}
        />
      </div>
      <div className="w-full md:w-1/3">
        <SelectionDetails
          selectedPixels={selectedPixels}
          onImageReady={handleImageReady}
        />
      </div>
    </div>
  );
};

export default MainContainer;
