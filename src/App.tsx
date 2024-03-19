import './App.css';
import FlashcardPage from './pages/FlashcardPage';
import WritingCanvas from './components/WritingCanvas';
import Chat from './components/Chat';
import { Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <ul>
            <li>
              <Link to="/flashcards">Flashcards</Link>
            </li>
            <li>
              <Link to="/chat">Chat</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/flashcards" element={<FlashcardPage />} />
          <Route path="/chat" element={<Chat />} />
          {/* Redirect to FlashcardPage as the default route */}
          <Route path="*" element={<FlashcardPage />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
