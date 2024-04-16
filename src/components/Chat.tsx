import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import InfoModal from './InfoModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop, faPlay, faPause, faTrash } from '@fortawesome/free-solid-svg-icons';
import WaveSurfer from 'wavesurfer.js';
import './Chat.css';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: {
    japanese: string;
    english: string;
  };
  audioUrl?: string; // URL for playing back the audio
  showEnglish: boolean;
}


const Chat: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [showModal, setShowModal] = useState(() => {
    return localStorage.getItem('showModal') !== 'false';
  });

  // Audio state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string>('');

  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);

  const waveformRef = useRef(null); // Ref for the waveform container
  const [waveSurfer, setWaveSurfer] = useState<any>(null); // To store the WaveSurfer instance
  const [isPlaying, setIsPlaying] = useState(false);

  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const toggleRecording = () => {
    if (recordingStatus === 'idle' || recordingStatus === 'recorded') {
      // Start recording
      setIsRecording(true);
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const newMediaRecorder = new MediaRecorder(stream);
          setMediaRecorder(newMediaRecorder);
  
          const audioChunks: BlobPart[] = [];
          newMediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
          };
  
          newMediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { 'type' : 'audio/wav' });
            setRecordedAudio(audioBlob);
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioBlobUrl(audioUrl);
            // Update recording status to 'recorded' but don't send automatically
            setRecordingStatus('recorded');
          };
  
          newMediaRecorder.start();
          setRecordingStatus('recording');
        })
        .catch(error => {
          console.error("Error accessing the microphone:", error);
          alert("Error accessing the microphone. Please ensure it is not being used by another application and try again.");
          setIsRecording(false);
          setRecordingStatus('idle');
        });
    } else if (recordingStatus === 'recording' && mediaRecorder) {
      // Stop recording
      setIsRecording(false);
      mediaRecorder.stop();
      setRecordingStatus('idle');
    }
  };

  const sendRecordedAudioMessage = async () => {
    if (!recordedAudio) return;

    try {
      const formData = new FormData();
      formData.append('audio', recordedAudio);

      // Assuming your backend is set up to handle audio file uploads and conversion
      const response = await axios.post('http://localhost:3001/api/openai/audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { japanese, english } = response.data;
      setChatHistory(prev => [...prev, { 
        sender: 'ai', 
        text: { japanese, english }, 
        showEnglish: false 
      }]);
      // Reset the recorded audio, recording status, and audio URL after sending
      deleteRecording()
    } catch (error) {
      console.error('Error sending audio message:', error);
      alert("Error sending audio message. Please try again.");
    }
  };

  const deleteRecording = () => {
    if (waveSurfer) {
      waveSurfer.destroy();
      setWaveSurfer(null);
    }
    setRecordingStatus('idle');
    setAudioBlobUrl('');
    setRecordedAudio(null);
    setIsRecording(false);
  };

  const togglePlayback = () => {
    if (waveSurfer) {
      if (waveSurfer.isPlaying()) {
        waveSurfer.pause();
      } else {
        waveSurfer.play();
      }
      // setIsPlaying(!isPlaying);
    }
  };

  const scrollToBottom = () => {
    const chatHistoryEl = chatHistoryRef.current;
    if (chatHistoryEl) {
      chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;
    }
  };
  
  const sendMessage = async () => {
    if (!input.trim() && !recordedAudio) return;
    const userMessage: string = input;
    setChatHistory(prev => [...prev, { sender: 'user', text: { japanese: userMessage, english: '' }, showEnglish: false }]);
    setInput('');
    
    try {
      const response = await axios.post('https://fair-jade-crab-toga.cyclic.app/api/openai'||'http://localhost:3001/api/openai', { prompt: userMessage });
      const { japanese, english } = response.data;
      setChatHistory(prev => [...prev, { sender: 'ai', text: { japanese, english }, showEnglish: false }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const toggleTranslation = (index: number) => {
    setChatHistory(prev => prev.map((msg, i) => {
      if (i === index && msg.sender === 'ai') {
        return { ...msg, showEnglish: !msg.showEnglish };
      }
      return msg;
    }));
  };
  
  useEffect(scrollToBottom, [chatHistory]);

  useEffect(() => {
    console.log('Effect running', { audioBlobUrl, waveSurfer });
    if (audioBlobUrl && waveformRef.current && !waveSurfer) {
      console.log('Initializing WaveSurfer');
        const ws: WaveSurfer = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: '#7DE2D1',
            progressColor: '#FFFAFB',
            cursorWidth: 0,
            barWidth: 2,
            barRadius: 3,
            height: 50,
            normalize: true,
        });
        ws.load(audioBlobUrl);

        ws.on('play', () => setIsPlaying(true));
        ws.on('pause', () => setIsPlaying(false));

        setWaveSurfer(ws);

        return () => {
          console.log('Destroying WaveSurfer');
          ws.destroy(); // Cleanup on component unmount or when audioBlobUrl changes
        }
    }
  }, [audioBlobUrl]);
  
  return (
    <div className='chat-container'>
      {showModal && <InfoModal onClose={() => setShowModal(false)} />}
      <div ref={chatHistoryRef} className="chat-history">
        {chatHistory.map((msg, index) => (
          <div className={`message-wrapper ${msg.sender}`} key={index} onClick={() => msg.sender === 'ai' && toggleTranslation(index)}>
            <div className={`message ${msg.sender}`}>
              {msg.sender === 'ai'
                ? (msg.showEnglish ? msg.text.english : msg.text.japanese)
                : msg.text.japanese // User messages in Japanese
              }
            </div>
            {msg.sender === 'ai' && <div className="translate-text">Tap to translate</div>}
          </div>
        ))}
      </div>
      <div className="input-area">
        {recordingStatus === 'recorded' ? (
          <>
          <FontAwesomeIcon 
            icon={isPlaying ? faPause : faPlay}
            className='playback-button'
            onClick={togglePlayback}
          />
          <div ref={waveformRef} className="waveform-container"></div>
        </>
        ) : (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message"
          />
        )}
        {/* <FontAwesomeIcon 
          onClick={recordingStatus === 'recorded' ? deleteRecording : toggleRecording}
          icon={recordingStatus === 'recorded' ? faTrash : (isRecording ? faStop : faMicrophone)}
          className='icon-button'
        /> */}
        <button onClick={recordedAudio ? sendRecordedAudioMessage : sendMessage}>
          {recordedAudio ? "Send Audio" : "Send"}
        </button>
      </div>
    </div>
  );
  
  
};

export default Chat;
