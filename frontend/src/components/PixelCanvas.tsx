import React, { useEffect, useRef, useState } from "react";
import { Pixel } from "../interfaces/Pixel";

interface PixelCanvasProps {
  pixels: Pixel[];
  width: number;
  height: number;
  onPixelSelection: (
    selectedPixels: { id: string; x: number; y: number }[]
  ) => void;
}

const PixelCanvas: React.FC<PixelCanvasProps> = ({
  pixels,
  width,
  height,
  onPixelSelection,
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
    console.log("Rendering pixels:", pixels); // Debug line

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, width, height);

        pixels.forEach((pixel) => {
          let color = pixel.color ?? "lightgray";
          if (color === "gray") color = "#D3D3D3"; // Ensure gray color is visible
          ctx.fillStyle = color;
          ctx.fillRect(pixel.x, pixel.y, 1, 1);
        });

        // Highlight selected pixels
        selectedPixels.forEach((key) => {
          const [x, y] = key.split("-").map(Number);
          ctx.fillStyle = "rgba(173, 216, 230, 0.5)"; // Light blue for selected pixels
          ctx.fillRect(x, y, 1, 1);
          ctx.strokeStyle = "blue"; // Blue border for selected pixels
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, 1, 1);
        });

        // Draw the selection rectangle during dragging
        if (isDragging && startPoint && endPoint) {
          ctx.fillStyle = "rgba(173, 216, 230, 0.3)"; // Light blue fill for the selection area
          ctx.fillRect(
            Math.min(startPoint.x, endPoint.x),
            Math.min(startPoint.y, endPoint.y),
            Math.abs(endPoint.x - startPoint.x),
            Math.abs(endPoint.y - startPoint.y)
          );
          ctx.strokeStyle = "blue";
          ctx.lineWidth = 1;
          ctx.strokeRect(
            Math.min(startPoint.x, endPoint.x),
            Math.min(startPoint.y, endPoint.y),
            Math.abs(endPoint.x - startPoint.x),
            Math.abs(endPoint.y - startPoint.y)
          );
        }
      }
    }
  }, [pixels, width, height, isDragging, startPoint, endPoint, selectedPixels]);

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
      setEndPoint(pos);
      updateSelectedPixels(startPoint, pos);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (selectedPixels.size > 0) {
      const selected = Array.from(selectedPixels).map((key) => {
        const [x, y] = key.split("-").map(Number);
        return { id: key, x, y };
      });
      onPixelSelection(selected);
    }
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
    const maxY = Math.max(end.y, start.y);

    pixels.forEach((pixel) => {
      if (
        pixel.x >= minX &&
        pixel.x <= maxX &&
        pixel.y >= minY &&
        pixel.y <= maxY &&
        !pixel.is_owned
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
