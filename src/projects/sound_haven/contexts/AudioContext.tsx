import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface AudioContextType {
  audioContext: AudioContext | null;
  masterGain: GainNode | null;
  bpm: number;
  setBpm: (bpm: number) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  currentStep: number;
  createOscillator: (frequency: number, type: OscillatorType) => OscillatorNode;
  playBuffer: (buffer: AudioBuffer) => void;
  getAnalyser: () => AnalyserNode;
}

const AudioContextProvider = createContext<AudioContextType | undefined>(undefined);

export const useAudioContext = () => {
  const context = useContext(AudioContextProvider);
  if (context === undefined) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [masterGain, setMasterGain] = useState<GainNode | null>(null);
  const [bpm, setBpm] = useState<number>(120);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  const analyserRef = useRef<AnalyserNode | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Initialize the audio context
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(ctx);
    
    // Create master gain node
    const gain = ctx.createGain();
    gain.gain.value = 0.7; // Default volume
    gain.connect(ctx.destination);
    setMasterGain(gain);
    
    // Create analyzer for visualizations
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    gain.connect(analyser);
    analyserRef.current = analyser;
    
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      ctx.close(); // Clean up audio context
    };
  }, []);
  
  useEffect(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (isPlaying && audioContext) {
      const stepTime = (60 / bpm) * 1000 / 4; // 16th notes
      
      intervalRef.current = window.setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % 16); // 16 steps per bar
      }, stepTime);
    }
    
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isPlaying, bpm, audioContext]);
  
  const togglePlay = () => {
    if (audioContext?.state === 'suspended') {
      audioContext.resume();
    }
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      setCurrentStep(0); // Reset to beginning when stopped
    }
  };
  
  const createOscillator = (frequency: number, type: OscillatorType = 'sine') => {
    if (!audioContext || !masterGain) return {} as OscillatorNode;
    
    const osc = audioContext.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency;
    
    return osc;
  };
  
  const playBuffer = (buffer: AudioBuffer) => {
    if (!audioContext || !masterGain) return;
    
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(masterGain);
    source.start();
  };
  
  const getAnalyser = () => {
    if (!analyserRef.current && audioContext) {
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      if (masterGain) masterGain.connect(analyser);
      analyserRef.current = analyser;
    }
    return analyserRef.current as AnalyserNode;
  };
  
  const value = {
    audioContext,
    masterGain,
    bpm,
    setBpm,
    isPlaying,
    togglePlay,
    currentStep,
    createOscillator,
    playBuffer,
    getAnalyser,
  };
  
  return (
    <AudioContextProvider.Provider value={value}>
      {children}
    </AudioContextProvider.Provider>
  );
};