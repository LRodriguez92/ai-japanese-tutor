import React, { useState } from 'react';
import { hiraganaKatakanaData } from '../data/flashcardData'; // Adjust the path as needed
import { kanjiData } from '../data/flashcardDataKanji'; // Import Kanji data
import { CharacterSelectionModal, FilterOptions } from './CharacterSelectionModal';
import './Flashcard.css';

import './Flashcard.css';

const Flashcard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    Hiragana: true,
    Katakana: true,
    Kanji: true,
    "Hiragana-Dakuon": true,
    "Hiragana-Handakuon": true,
    "Hiragana-Yoon": true,
    "Katakana-Dakuon": true,
    "Katakana-Handakuon": true,
    "Katakana-Yoon": true
  });

  // Combine Hiragana/Katakana and Kanji data
  const allFlashcards = [...hiraganaKatakanaData, ...kanjiData];
  const filteredFlashcards = allFlashcards.filter(card => {
    const option = filterOptions[card.type as keyof FilterOptions]; // Using 'as keyof FilterOptions' for type assertion
    return option !== undefined ? option : false; // Default to false if the type does not exist in filterOptions
  });
  const { character, pronunciation, meaning, romaji } = filteredFlashcards[currentIndex % filteredFlashcards.length]; // Adjust currentIndex with modulo for cycling through filtered flashcards
  const handleFlip = () => setIsFlipped(!isFlipped);;

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredFlashcards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? filteredFlashcards.length - 1 : prevIndex - 1));
  };

  const handleCharacterSelectionClick = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <div className="flashcard-container">
        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <div className="front">
            <div className="character" style={{ fontSize: filteredFlashcards[currentIndex].type === "Kanji" ? "130px" : "220px" }}>{character}</div>
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
        <button onClick={handleCharacterSelectionClick}>Choose Characters</button>
      </div>
      <CharacterSelectionModal
        showModal={showModal}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
        closeModal={closeModal}
      />
    </>
  );
};

export default Flashcard;
