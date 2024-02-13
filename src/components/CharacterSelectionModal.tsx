import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import './CharacterSelectionModal.css';

interface CharacterSelectionModalProps {
  showModal: boolean;
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  closeModal: () => void;
}

export interface FilterOptions {
[key: string]: boolean; // Allows dynamic access with string keys
  Hiragana: boolean;
  Katakana: boolean;
  Kanji: boolean;
  "Hiragana-Dakuon": boolean;
  "Hiragana-Handakuon": boolean;
  "Hiragana-Yoon": boolean;
  "Katakana-Dakuon": boolean;
  "Katakana-Handakuon": boolean;
  "Katakana-Yoon": boolean;
}

export const CharacterSelectionModal: React.FC<CharacterSelectionModalProps> = ({
  showModal,
  filterOptions,
  setFilterOptions,
  closeModal,
}) => {

  if (!showModal) return null;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const currentlyChecked = Object.values(filterOptions).filter(value => value).length;
    if (!checked && currentlyChecked === 1) {
        alert("At least one character type must be selected.");
        return; // Stop the function from proceeding further
    }
    setFilterOptions(prev => ({ ...prev, [name]: checked }));
  };

  const handleCheckAll = () => {
    setFilterOptions({
      Hiragana: true,
      Katakana: true,
      Kanji: true,
      "Hiragana-Dakuon": true,
      "Hiragana-Handakuon": true,
      "Hiragana-Yoon": true,
      "Katakana-Dakuon": true,
      "Katakana-Handakuon": true,
      "Katakana-Yoon": true,
    });
  };
  
  const handleUncheckAll = () => {
    setFilterOptions({
      Hiragana: true, // Keep Hiragana checked
      Katakana: false,
      Kanji: false,
      "Hiragana-Dakuon": false,
      "Hiragana-Handakuon": false,
      "Hiragana-Yoon": false,
      "Katakana-Dakuon": false,
      "Katakana-Handakuon": false,
      "Katakana-Yoon": false,
    });
  };

  return (
    <div className={`modal ${showModal ? 'show' : 'hide'}`}>
      <div className="modal-content">
        <div className="modal-header">
          <FontAwesomeIcon icon={faX} onClick={closeModal} className="close-button" />
          <h2>Choose Characters</h2>
        </div>
        <div className="modal-body">
          <form>
            <label>
              <input
                type="checkbox"
                name="Hiragana"
                checked={filterOptions.Hiragana}
                onChange={handleChange}
              />
              Hiragana
            </label>
            <label>
              <input
                type="checkbox"
                name="Hiragana-Dakuon"
                checked={filterOptions["Hiragana-Dakuon"]}
                onChange={handleChange}
              />
              Hiragana Dakuon
            </label>
            <label>
              <input
                type="checkbox"
                name="Hiragana-Handakuon"
                checked={filterOptions["Hiragana-Handakuon"]}
                onChange={handleChange}
              />
              Hiragana Handakuon
            </label>
            <label>
              <input
                type="checkbox"
                name="Hiragana-Yoon"
                checked={filterOptions["Hiragana-Yoon"]}
                onChange={handleChange}
              />
              Hiragana Yoon
            </label>
            <label>
              <input
                type="checkbox"
                name="Katakana"
                checked={filterOptions.Katakana}
                onChange={handleChange}
              />
              Katakana
            </label>
            <label>
              <input
                type="checkbox"
                name="Katakana-Dakuon"
                checked={filterOptions["Katakana-Dakuon"]}
                onChange={handleChange}
              />
              Katakana Dakuon
            </label>
            <label>
              <input
                type="checkbox"
                name="Katakana-Handakuon"
                checked={filterOptions["Katakana-Handakuon"]}
                onChange={handleChange}
              />
              Katakana Handakuon
            </label>
            <label>
              <input
                type="checkbox"
                name="Katakana-Yoon"
                checked={filterOptions["Katakana-Yoon"]}
                onChange={handleChange}
              />
              Katakana Yoon
            </label>
            <label>
              <input
                type="checkbox"
                name="Kanji"
                checked={filterOptions.Kanji}
                onChange={handleChange}
              />
              Kanji
            </label>
          </form>
        </div>
        <div className="modal-footer">
            <button onClick={handleCheckAll}>Check All</button>
            <button onClick={handleUncheckAll}>Uncheck All</button>
            <button onClick={() => {
            setFilterOptions(filterOptions);
            closeModal();
            }}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelectionModal;