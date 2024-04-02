import React, { useState, useEffect } from 'react';
import { hiraganaKatakanaData } from '../data/flashcardData'; // Adjust the path as needed
import { kanjiData } from '../data/flashcardDataKanji'; // Import Kanji data
import { CharacterSelectionModal, FilterOptions } from './CharacterSelectionModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './Flashcard.css';

import './Flashcard.css';
import { log } from 'console';

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

  // Swipe feature
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const [mouseStart, setMouseStart] = useState<number>(0);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [fadeCard, setFadeCard] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);

  const fadeOutDuration = 150; // Duration of the swipe away animation / This should match the duration of the swipe away animation
  const fadeInDuration = 100; // Duration of the swipe in animation / Match this duration to your fade-in effect duration


  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(event.targetTouches[0].clientX);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(event.targetTouches[0].clientX);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const touchEnd = event.changedTouches[0].clientX;
    setTouchEnd(touchEnd);

    const touchDistance = touchStart - touchEnd;
    if (Math.abs(touchDistance) > 50) { // Swipe detected
        setIsSwiping(true);
        if (touchDistance > 0) {
            handleNext();
        } else {
            handlePrevious();
        }
    }

    // Wait for a bit after swipe to reset isSwiping to allow for animation to complete
    setTimeout(() => setIsSwiping(false), fadeOutDuration);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setMouseStart(event.clientX);
    setIsMouseDown(true);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isMouseDown) {
        const mouseEnd = event.clientX;
        const threshold = 50; // Reduced threshold for swipe detection
        if (Math.abs(mouseStart - mouseEnd) > threshold) {
            // Detected a swipe, now determine the direction
            setIsSwiping(true);
            if (mouseStart - mouseEnd > threshold) {
                handleNext();
                setIsMouseDown(false); // End the swipe after detection
            } else if (mouseStart - mouseEnd < -threshold) {
                handlePrevious();
                setIsMouseDown(false); // End the swipe after detection
            }
        }
    }
  };

  const handleMouseUp = () => {
      setIsMouseDown(false);
  };

  const handleMouseLeave = () => {
      setIsMouseDown(false); // Reset on mouse leave to prevent stuck state
  };



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
        setCurrentIndex(0);
    }
  };

  // Adjust how currentIndex is used based on shuffle mode
  const getCurrentCard = () => {
    const index = isShuffled ? shuffledIndexes[currentIndex % shuffledIndexes.length] : currentIndex % filteredFlashcards.length;
    return filteredFlashcards[index];
  };

  const { character, pronunciation, meaning, romaji, type } = getCurrentCard();

  const handleFlip = () => {
    console.log("isSwiping: ", isSwiping);
    console.log("flipping");
    
    if (!isSwiping) {
        setIsFlipped(!isFlipped);
    }
  };
  const handleNext = () => {
    setIsFlipped(false);
    setSwipeDirection('left');

    setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredFlashcards.length);
        setSwipeDirection(null);
        setFadeCard(true);
        setTimeout(() => {
          setFadeCard(false);
          setIsSwiping(false);  // Re-enable click actions after the transition
        }, fadeInDuration); // Match this duration to your fade-in effect duration
    }, fadeOutDuration); // This should match the duration of the swipe away animation
  };

  const handlePrevious = () => {
      setIsFlipped(false);
      setSwipeDirection('right');

      setTimeout(() => {
          setCurrentIndex((prevIndex) => prevIndex === 0 ? filteredFlashcards.length - 1 : prevIndex - 1);
          setSwipeDirection(null);
          setFadeCard(true);
          setTimeout(() => {
            setFadeCard(false);
            setIsSwiping(false);  // Re-enable click actions after the transition
          }, fadeInDuration); // Match this duration to your fade-in effect duration
      }, fadeOutDuration); // This should match the duration of the swipe away animation
  };


  const handleCharacterSelectionClick = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <div className="flashcard-container">
        <FontAwesomeIcon icon={faShuffle} onClick={handleShuffle} className={`shuffle ${isShuffled ? 'active' : ''}`} />
        <div className={`flashcard ${isFlipped ? 'flipped' : ''} ${swipeDirection === 'left' ? 'swipe-left' : swipeDirection === 'right' ? 'swipe-right' : ''} ${fadeCard ? 'flashcard-enter-active' : 'flashcard-enter'}`} 
          onClick={handleFlip}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}>
          <div className="front">
          <div className="character" style={{ fontSize: type === "Kanji" ? "130px" : (type === "Hiragana-Yoon" || type === "Katakana-Yoon") ? "150px" : "220px" }}>{character}</div>
            <div className="pronunciation">{pronunciation}</div>
          </div>
          <div className="back">
            <div className="meaning">{meaning}</div>
            <div className="romaji">{romaji}</div>
          </div>
        </div>
        <div className="navigation">
          {/* <FontAwesomeIcon icon={faArrowLeft} onClick={handlePrevious} className='arrows' /> */}
          <button onClick={handleCharacterSelectionClick}>Change Character Type</button>
          {/* <FontAwesomeIcon icon={faArrowRight} onClick={handleNext} className='arrows' /> */}
        </div>
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
