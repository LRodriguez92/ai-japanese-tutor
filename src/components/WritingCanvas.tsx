import React, { useRef, useEffect } from 'react';
import './WritingCanvas.css';

interface WritingCanvasProps {
  referenceCharacter: string;
}

const WritingCanvas: React.FC<WritingCanvasProps> = ({ referenceCharacter }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let isDrawing = false;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const context = canvasRef.current?.getContext('2d');
    isDrawing = true;
    context?.beginPath();
    context?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing) return;
    const context = canvasRef.current?.getContext('2d');
    context?.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context?.stroke();
  };

  const endDrawing = () => {
    isDrawing = false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    context!.lineWidth = 2; // Set the line width for drawing

    // Draw the reference character
    context!.font = '48px serif'; // Adjust the font style as needed
    context!.fillText(referenceCharacter, 40, 80); // Adjust the position as needed

    return () => {
      // Cleanup
    };
  }, [referenceCharacter]);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={endDrawing}
      onMouseOut={endDrawing}
    />
  );
};

export default WritingCanvas;
