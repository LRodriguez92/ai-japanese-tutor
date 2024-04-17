import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';
import './FlashcardModal.css';

interface InfoModalProps {
  onClose: () => void;
}

const FlashcardModal: React.FC<InfoModalProps> = ({ onClose }) => {
  const [doNotShowAgain, setDoNotShowAgain] = useState<boolean>(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDoNotShowAgain(event.target.checked);
  };

  const handleClose = () => {
    if (doNotShowAgain) {
      localStorage.setItem('showFlashcardModal', 'false');
    }
    onClose();
  };

  return (
    <div className="modal-background">
      <div className="modal-content">
        <h3>Let's learn some Kana!</h3>
        <br />
        <p>
          Use this interactive tool to enhance your language learning experience. Here are a few tips on how to use the Flashcard component effectively:
          <br />
          <br />
          <ul>
            <li><strong>Swipe right:</strong> Move to the next card.</li>
            <li><strong>Swipe left:</strong> Go back to the previous card.</li>
            <li><strong>Press the shuffle icon:</strong> <FontAwesomeIcon icon={faShuffle} /> This will shuffle the order of the flashcards.</li>
            <li><strong>Click the "Change Kana" button:</strong> <button className="demo-button">Change Kana</button> This allows you to select which Kana you want to practice learning.</li>
          </ul>
        </p>
        <div className="modal-footer">
          <label>
            <input type="checkbox" checked={doNotShowAgain} onChange={handleCheckboxChange} />
            &nbsp; Don't show this again
          </label>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardModal;
