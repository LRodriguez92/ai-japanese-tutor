import React, { useRef, useEffect, useState } from 'react';
import flashcards from '../data/flashcardData'; // Adjust the import path as needed

interface Zone {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface StrokePoint {
  x: number;
  y: number;
}

interface Flashcard {
  character: string;
  zones: Zone[];
  // ... other properties
}

const WritingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [allStrokes, setAllStrokes] = useState<Array<Array<StrokePoint>>>([]);
  const [currentStroke, setCurrentStroke] = useState<Array<StrokePoint>>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState<Flashcard>(flashcards[0]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setIsDrawing(true);
    const newStroke = [{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }];
    setCurrentStroke(newStroke);
  };

  const drawStrokes = (context: CanvasRenderingContext2D, strokes: Array<Array<StrokePoint>>) => {
    strokes.forEach((stroke: Array<StrokePoint>) => {
      context.beginPath();
      stroke.forEach((point: StrokePoint, index: number) => {
        if (index === 0) {
          context.moveTo(point.x, point.y);
        } else {
          context.lineTo(point.x, point.y);
        }
      });
      context.lineWidth = 2;
      context.strokeStyle = '#000000';
      context.stroke();
    });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing) return;
    const newPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    setCurrentStroke(prevStroke => {
      const updatedStroke = [...prevStroke, newPoint];
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          drawStrokes(context, [...allStrokes, updatedStroke]);
          context.font = '48px serif';
          context.fillText(currentCharacter.character, 40, 80);
        }
      }
      return updatedStroke;
    });
  };

  const endDrawing = () => {
    setIsDrawing(false);
    setAllStrokes(prevAllStrokes => [...prevAllStrokes, currentStroke]);
    setCurrentStroke([]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    allStrokes.forEach(stroke => {
      context.beginPath();
      stroke.forEach((point, index) => {
        if (index === 0) {
          context.moveTo(point.x, point.y);
        } else {
          context.lineTo(point.x, point.y);
        }
      });
      context.lineWidth = 2;
      context.strokeStyle = '#000000';
      context.stroke();
    });

    context.font = '48px serif';
    context.fillText(currentCharacter.character, 40, 80);
  }, [allStrokes, currentCharacter]);

  const selectCharacter = (character: Flashcard) => {
    setCurrentCharacter(character);
    setAllStrokes([]);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
      />
      <div>
        {flashcards.map((card, index) => (
          <button key={index} onClick={() => selectCharacter(card)}>
            {card.character}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WritingCanvas;