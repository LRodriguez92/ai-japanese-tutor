import React, { useState, useEffect } from 'react';
import { hiraganaKatakanaData } from '../data/flashcardData'; // Adjust the path as needed
import { kanjiData } from '../data/flashcardDataKanji'; // Import Kanji data
import { CharacterSelectionModal, FilterOptions } from './CharacterSelectionModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';
import './Flashcard.css';

import './Flashcard.css';

const Flashcard = () => {
  const getInitialFilterOptions = (): FilterOptions => {
    const savedFilters = localStorage.getItem('filterOptions');
    return savedFilters ? JSON.parse(savedFilters) : {
      Hiragana: true,
      Katakana: true,
      Kanji: true,
      "Hiragana-Dakuon": true,
      "Hiragana-Handakuon": true,
      "Hiragana-Yoon": true,
      "Katakana-Dakuon": true,
      "Katakana-Handakuon": true,
      "Katakana-Yoon": true
    };
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(getInitialFilterOptions());
  const [isShuffled, setIsShuffled] = useState(false); 
  const [shuffledIndexes, setShuffledIndexes] = useState<number[]>([]); 

  useEffect(() => {
    // Save to localStorage whenever filterOptions changes
    localStorage.setItem('filterOptions', JSON.stringify(filterOptions));
  }, [filterOptions]);

  // Combine Hiragana/Katakana and Kanji data
  const allFlashcards = [...hiraganaKatakanaData, ...kanjiData];

  const filteredFlashcards = allFlashcards.filter(card => {
    const option = filterOptions[card.type as keyof FilterOptions]; // Using 'as keyof FilterOptions' for type assertion
    return option !== undefined ? option : false; // Default to false if the type does not exist in filterOptions
  });

  // Shuffle flashcards function
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Toggle shuffle mode and reset to the first character when turned off
  const handleShuffle = () => {
    setIsShuffled(!isShuffled);
    if (!isShuffled) {
        // Shuffle flashcards and update shuffledIndexes
        const shuffled = shuffleArray(filteredFlashcards.map((_, index) => index));
        setShuffledIndexes(shuffled);
    } else {
        // Reset to original order and set currentIndex to 0 to show the first character
        setShuffledIndexes([]);
        setCurrentIndex(0); // Reset currentIndex to 0
    }
  };

  // Adjust how currentIndex is used based on shuffle mode
  const getCurrentCard = () => {
    const index = isShuffled ? shuffledIndexes[currentIndex % shuffledIndexes.length] : currentIndex % filteredFlashcards.length;
    return filteredFlashcards[index];
  };

  const { character, pronunciation, meaning, romaji } = getCurrentCard();

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
        <button onClick={handleShuffle}>
          <FontAwesomeIcon icon={faShuffle} /> Shuffle
        </button>
        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <div className="front">
          <div className="character" style={{ fontSize: filteredFlashcards[currentIndex].type === "Kanji" ? "130px" : (filteredFlashcards[currentIndex].type === "Hiragana-Yoon" || filteredFlashcards[currentIndex].type === "Katakana-Yoon") ? "150px" : "220px" }}>{character}</div>
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
