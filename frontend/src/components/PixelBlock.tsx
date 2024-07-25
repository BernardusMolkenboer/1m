import React from "react";

interface PixelBlockProps {
  color: string;
  isOwned: boolean;
}

const PixelBlock: React.FC<PixelBlockProps> = ({ color, isOwned }) => {
  return (
    <div
      className="pixel-block"
      style={{
        width: "1px",
        height: "1px",
        backgroundColor: color,
      }}
    ></div>
  );
};

export default PixelBlock;
