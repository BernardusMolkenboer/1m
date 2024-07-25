import React from "react";
import { FixedSizeGrid as Grid } from "react-window";
import PixelBlock from "./PixelBlock";

interface Pixel {
  id: number;
  x: number;
  y: number;
  color: string;
  is_owned: boolean;
}

interface PixelGridProps {
  pixels: Pixel[];
}

const PixelGrid: React.FC<PixelGridProps> = ({ pixels }) => {
  const gridSize = 1000;
  const cellSize = 1;

  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const pixel = pixels.find((p) => p.x === columnIndex && p.y === rowIndex);
    const color = pixel ? pixel.color : "gray";
    const isOwned = pixel ? pixel.is_owned : false;

    return (
      <div style={style}>
        <PixelBlock color={color} isOwned={isOwned} />
      </div>
    );
  };

  return (
    <Grid
      columnCount={gridSize}
      columnWidth={cellSize}
      height={1000}
      rowCount={gridSize}
      rowHeight={cellSize}
      width={1000}
    >
      {Cell}
    </Grid>
  );
};

export default PixelGrid;
