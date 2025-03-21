import React from 'react';
import { useAudioContext } from '../contexts/AudioContext';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Music } from 'lucide-react';

const TransportControls: React.FC = () => {
  const { bpm, setBpm, isPlaying, togglePlay } = useAudioContext();
  
  return (
    <div className="bg-dj-light p-4 rounded-lg flex flex-col md:flex-row items-center gap-4">
      <button
        onClick={togglePlay}
        className="w-12 h-12 rounded-full bg-dj-accent flex items-center justify-center hover:bg-dj-highlight transition-colors"
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 text-white" />
        ) : (
          <Play className="w-6 h-6 text-white ml-1" />
        )}
      </button>
      
      <div className="flex items-center gap-4 flex-1">
        <Music className="w-5 h-5 text-white" />
        <div className="flex flex-col flex-1">
          <div className="flex justify-between text-sm text-gray-400">
            <span>BPM</span>
            <span>{bpm}</span>
          </div>
          <Slider
            value={[bpm]}
            min={60}
            max={180}
            step={1}
            onValueChange={(value) => setBpm(value[0])}
            className="my-2"
          />
        </div>
      </div>
    </div>
  );
};

export default TransportControls;