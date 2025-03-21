import React, { useState, useEffect, memo } from 'react';
import { useAudioContext } from '../contexts/AudioContext';
import SampleService, { DrumType, drumSamples } from '../services/SampleService';

interface DrumPadProps {
  type: DrumType;
  color: string;
  label: string;
}

const DrumPad: React.FC<DrumPadProps> = ({ type, color, label }) => {
  const { audioContext, masterGain } = useAudioContext();
  const [isActive, setIsActive] = useState(false);
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  
  useEffect(() => {
    if (audioContext) {
      SampleService.setAudioContext(audioContext);
      SampleService.loadSample(drumSamples[type])
        .then(setBuffer)
        .catch(err => console.error('Failed to load sample:', err));
    }
  }, [audioContext, type]);
  
  const playSound = () => {
    if (!audioContext || !masterGain || !buffer) return;
    
    // Create buffer source
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    
    // Connect to master gain and play
    source.connect(masterGain);
    source.start(0);
    
    // Visual feedback
    setIsActive(true);
    setTimeout(() => setIsActive(false), 100);
  };
  
  return (
    <div 
      className={`drum-pad ${isActive ? 'drum-pad-active' : ''}`} 
      style={{ backgroundColor: color }}
      onClick={playSound}
    >
      {label}
    </div>
  );
};

export default memo(DrumPad);