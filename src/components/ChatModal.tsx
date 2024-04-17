import React, { useState } from 'react';
import './ChatModal.css';

interface InfoModalProps {
  onClose: () => void;
}

const ChatModal: React.FC<InfoModalProps> = ({ onClose }) => {
  const [doNotShowAgain, setDoNotShowAgain] = useState<boolean>(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDoNotShowAgain(event.target.checked);
  };

  const handleClose = () => {
    if (doNotShowAgain) {
      localStorage.setItem('showChatModal', 'false');
    }
    onClose();
  };

  return (
    <div className="modal-background">
      <div className="modal-content">
        <h3>Welcome to the AI Tutor Chat!</h3>
        <p>This interactive chat feature allows you to converse with an AI language instructor. You can type your messages in either english or japanese (you might have to enable a japanese keyboard on your device).
        <br />
        <br />
        For added learning, you can tap on any response from the AI to see its translation. This feature is designed to enhance your language learning experience by providing instant translations and engaging conversations.
        <br />
        <br />
        Remember, you can always revisit this info by accessing the help section in the chat.
        </p>
        <div className="modal-footer">
          <label>
            <input type="checkbox" checked={doNotShowAgain} onChange={handleCheckboxChange} />
            Don't show this again
          </label>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
