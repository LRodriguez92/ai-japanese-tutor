import './App.css';
import Flashcard from './components/Flashcard';
import WritingCanvas from './components/WritingCanvas';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <WritingCanvas referenceCharacter="你" />
      </header>
    </div>
  );
}

export default App;
