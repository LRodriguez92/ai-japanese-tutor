import React, { useState } from 'react';
import { hiraganaKatakanaData } from '../data/flashcardData'; // Adjust the path as needed
import { kanjiData } from '../data/flashcardDataKanji'; // Import Kanji data
import './Flashcard.css';

const Flashcard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Combine Hiragana/Katakana and Kanji data
  const allFlashcards = [...hiraganaKatakanaData, ...kanjiData];
  const { character, pronunciation, meaning, romaji } = allFlashcards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allFlashcards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? allFlashcards.length - 1 : prevIndex - 1));
  };

  return (
    <div className="flashcard-container">
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="front">
          <div className="character">{character}</div>
          <div className="pronunciation">{pronunciation}</div>
        </div>
        <div className="back">
          <div className="meaning">{meaning}</div>
          <div className="romaji">{romaji}</div>
        </div>
      </div>
      <div className="navigation">
        <button onClick={handlePrevious}>Previous</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default Flashcard;
