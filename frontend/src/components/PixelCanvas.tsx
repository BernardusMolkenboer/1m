import React, { useEffect, useRef, useState } from "react";
import { Pixel } from "../interfaces/Pixel";

interface PixelCanvasProps {
  pixels: Pixel[];
  width: number;
  height: number;
  onPixelSelection: (
    selectedPixels: { id: string; x: number; y: number }[]
  ) => void;
  selectedImage: HTMLImageElement | null;
  selectedImagePosition: { x: number; y: number } | null;
}

const PixelCanvas: React.FC<PixelCanvasProps> = ({
  pixels,
  width,
  height,
  onPixelSelection,
  selectedImage,
  selectedImagePosition,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [endPoint, setEndPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [selectedPixels, setSelectedPixels] = useState<Set<string>>(new Set());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, width, height);

        // Draw all pixels from the dataset
        pixels.forEach((pixel) => {
          let color = pixel.color ?? "lightgray";
          if (color === "gray") color = "#D3D3D3"; // Lighten gray color
          ctx.fillStyle = color;
          ctx.fillRect(pixel.x, pixel.y, 1, 1);
        });

        // Highlight selected pixels
        selectedPixels.forEach((key) => {
          const [x, y] = key.split("-").map(Number);
          ctx.fillStyle = "rgba(0, 122, 255, 0.3)"; // Semi-transparent blue for selection
          ctx.fillRect(x, y, 1, 1);
          ctx.strokeStyle = "rgba(0, 122, 255, 0.8)"; // Blue border for selected pixels
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, 1, 1);
        });

        // Draw the selected image if available, above all other elements
        if (selectedImage && selectedImagePosition) {
          ctx.drawImage(
            selectedImage,
            selectedImagePosition.x,
            selectedImagePosition.y
          );
        }

        // Draw the selection rectangle during dragging, above the image
        if (isDragging && startPoint && endPoint) {
          ctx.fillStyle = "rgba(0, 122, 255, 0.2)"; // Lighter fill during drag
          ctx.strokeStyle = "rgba(0, 122, 255, 0.8)"; // Solid border during drag
          ctx.lineWidth = 1;
          const startX = Math.min(startPoint.x, endPoint.x);
          const startY = Math.min(startPoint.y, endPoint.y);
          const rectWidth = Math.abs(endPoint.x - startPoint.x);
          const rectHeight = Math.abs(endPoint.y - startPoint.y);
          ctx.fillRect(startX, startY, rectWidth, rectHeight);
          ctx.strokeRect(startX, startY, rectWidth, rectHeight);
        }
      }
    }
  }, [
    pixels,
    width,
    height,
    isDragging,
    startPoint,
    endPoint,
    selectedPixels,
    selectedImage,
    selectedImagePosition,
  ]);

  const getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor(evt.clientX - rect.left),
      y: Math.floor(evt.clientY - rect.top),
    };
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    const pos = getMousePos(canvasRef.current!, event.nativeEvent);
    setStartPoint(pos);
    setEndPoint(pos);
    setSelectedPixels(new Set()); // Clear previous selections on new drag
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const pos = getMousePos(canvasRef.current!, event.nativeEvent);

      // Check if the new position crosses into an owned pixel
      const pixelsWithinArea = pixels.filter(
        (pixel) =>
          pixel.x >= Math.min(startPoint!.x, pos.x) &&
          pixel.x <= Math.max(startPoint!.x, pos.x) &&
          pixel.y >= Math.min(startPoint!.y, pos.y) &&
          pixel.y <= Math.max(startPoint!.y, pos.y)
      );

      const ownedPixelFound = pixelsWithinArea.some((pixel) => pixel.is_owned);

      if (!ownedPixelFound) {
        setEndPoint(pos);
        updateSelectedPixels(startPoint, pos);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const selected = Array.from(selectedPixels).map((key) => {
      const [x, y] = key.split("-").map(Number);
      return { id: key, x, y };
    });
    onPixelSelection(selected);
  };

  const updateSelectedPixels = (
    start: { x: number; y: number } | null,
    end: { x: number; y: number } | null
  ) => {
    if (!start || !end) return;

    const selected = new Set<string>();

    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);

    pixels.forEach((pixel) => {
      if (
        pixel.x >= minX &&
        pixel.x <= maxX &&
        pixel.y >= minY &&
        pixel.y <= maxY &&
        !pixel.is_owned // Skip already owned pixels
      ) {
        selected.add(`${pixel.x}-${pixel.y}`);
      }
    });

    setSelectedPixels(selected);
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default PixelCanvas;
