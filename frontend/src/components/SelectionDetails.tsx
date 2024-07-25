import React, { useState, useEffect } from "react";

interface SelectionDetailsProps {
  selectedPixels: { id: string; x: number; y: number }[];
}

const SelectionDetails: React.FC<SelectionDetailsProps> = ({
  selectedPixels,
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isImageValid, setIsImageValid] = useState<boolean>(false);
  const pixelCount = selectedPixels.length;
  const price = pixelCount * 10; // Assuming $10 per pixel

  // Calculate the dimensions of the selected pixels area
  const pixelWidth =
    selectedPixels.length > 0
      ? selectedPixels.reduce(
          (max, p) => (p.x > max ? p.x : max),
          selectedPixels[0].x
        ) -
        selectedPixels.reduce(
          (min, p) => (p.x < min ? p.x : min),
          selectedPixels[0].x
        ) +
        1
      : 0;
  const pixelHeight =
    selectedPixels.length > 0
      ? selectedPixels.reduce(
          (max, p) => (p.y > max ? p.y : max),
          selectedPixels[0].y
        ) -
        selectedPixels.reduce(
          (min, p) => (p.y < min ? p.y : min),
          selectedPixels[0].y
        ) +
        1
      : 0;

  useEffect(() => {
    // Check if the image dimensions match the selected pixel dimensions
    if (imageDimensions && pixelCount > 0) {
      setIsImageValid(
        imageDimensions.width === pixelWidth &&
          imageDimensions.height === pixelHeight
      );
    } else {
      setIsImageValid(false);
    }
  }, [imageDimensions, pixelWidth, pixelHeight, pixelCount]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);

      // Create an image element to get the dimensions
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
    } else {
      setImage(null);
      setImageDimensions(null);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Selection Details</h2>
      <p className="mb-2">
        Pixels Selected: <span className="font-semibold">{pixelCount}</span>
      </p>
      <p className="mb-2">
        Total Price: <span className="font-semibold">${price}</span>
      </p>
      <p className="mb-2">
        Selected Area:{" "}
        <span className="font-semibold">
          {pixelWidth} x {pixelHeight} pixels
        </span>
      </p>
      {image && imageDimensions && (
        <p className="mb-2">
          Image Dimensions:{" "}
          <span className="font-semibold">
            {imageDimensions.width} x {imageDimensions.height} pixels
          </span>
        </p>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />
        {image && (
          <p className="mt-2 text-sm text-gray-600">
            Selected file: {image.name}
          </p>
        )}
      </div>
      <button
        disabled={!isImageValid || pixelCount === 0}
        className={`w-full py-2 px-4 text-white rounded-md ${
          isImageValid && pixelCount > 0
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Continue to Purchase
      </button>
      {!isImageValid && image && (
        <p className="text-red-500 text-sm mt-2">
          The uploaded image dimensions do not match the selected area.
        </p>
      )}
    </div>
  );
};

export default SelectionDetails;
