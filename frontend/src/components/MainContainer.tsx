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

  const handleCheckout = (
    pixels: { x: number; y: number; color: string }[]
  ) => {
    fetch("http://localhost:4000/api/update-pixels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pixels, owner: "owner_id" }), // Include owner ID or other identifying info
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Pixels updated successfully:", data);
        // Handle successful checkout, e.g., showing a success message
      })
      .catch((error) => {
        console.error("Error updating pixels:", error);
        // Handle errors, e.g., showing an error message
      });
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
          onCheckout={handleCheckout} // Pass the handleCheckout function
        />
      </div>
    </div>
  );
};

export default MainContainer;
