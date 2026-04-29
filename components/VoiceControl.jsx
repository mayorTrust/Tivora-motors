import React, { useState, useRef, useEffect } from 'react';
import { Mic, Loader2, StopCircle, BotMessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

const VoiceControl = () => {
  const [status, setStatus] = useState('offline'); // offline, recording, processing, speaking
  const statusRef = useRef('offline');
  
  useEffect(() => { 
    statusRef.current = status; 
  }, [status]);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const silenceTimeoutRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = processAudio;
      mediaRecorderRef.current.start();

      setStatus('recording');
      checkVolume();
    } catch (e) { console.error("Mic error:", e); }
  };

  const checkVolume = () => {
    if (statusRef.current !== 'recording') return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

    if (volume > 15) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = setTimeout(stopRecording, 2000);
    }
    animationFrameRef.current = requestAnimationFrame(checkVolume);
  };

  const stopRecording = () => {
    cancelAnimationFrame(animationFrameRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setStatus('processing');
    }
  };

  const processAudio = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

    if (audioBlob.size < 5000) {
       setStatus('offline');
       return;
    }

    setStatus('processing');

    try {
      // MOCK: Replace this with your actual backend fetch when ready
      console.log("Simulating backend response...");

      const reply = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(`I've received your input from ${document.title}. Our high-performance systems are ready to assist with your configuration.`);
        }, 1000);
      });

      setStatus('speaking');

      // Clear any previous speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(reply);

      const voices = window.speechSynthesis.getVoices();
      utterance.voice = voices.find(v => v.name.includes('Google')) || voices[0];
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => setStatus('offline');
      window.speechSynthesis.speak(utterance);

    } catch (err) {
      console.error("Simulation error:", err);
      setStatus('offline');
    }
  };

  return (
    <div className="fixed bottom-24 right-8 z-[60]">
      <motion.button
        onClick={status === 'recording' ? stopRecording : startRecording}
        className={`p-5 rounded-full shadow-2xl transition-all duration-500 border ring-1 flex items-center justify-center ${
          status === 'recording' ? 'bg-red-500 border-red-400 animate-pulse' :
          status === 'processing' ? 'bg-amber-500 border-amber-400' :
          status === 'speaking' ? 'bg-emerald-500 border-emerald-400' :
          'bg-black/80 border-white/20'
        }`}
      >
        {status === 'offline' && <Mic className="text-white" />}
        {status === 'recording' && <StopCircle className="text-white" />}
        {status === 'processing' && <Loader2 className="text-white animate-spin" />}
        {status === 'speaking' && <BotMessageSquare className="text-white" />}
      </motion.button>
    </div>
  );
};

export default VoiceControl;
