import './App.css';
import Navbar from './components/Navbar';
import FlashcardPage from './pages/FlashcardPage';
import WritingCanvas from './components/WritingCanvas';
import Chat from './components/Chat';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
      </header>

        <Routes>
          <Route path="/flashcards" element={<FlashcardPage />} />
          <Route path="/chat" element={<Chat />} />
          {/* Redirect to ChatPage as the default route */}
          <Route path="*" element={<Chat />} />
        </Routes>
    </div>
  );
}

export default App;
