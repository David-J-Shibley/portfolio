import React from 'react';
import { AudioProvider } from '../contexts/AudioContext';
import DrumPad from '../components/DrumPad';
import StepSequencer from '../components/StepSequencer';
import TransportControls from '../components/TransportControls';
import AudioVisualizer from '../components/AudioVisualizer';
import EffectsRack from '../components/EffectsRack';
import { DrumType } from '../services/SampleService';

const DJStudio: React.FC = () => {
  const drumRows: DrumType[] = ['kick', 'snare', 'hihat', 'clap', 'tom', 'crash', 'rim', 'shaker'];
  const drumLabels = ['Kick', 'Snare', 'Hi-Hat', 'Clap', 'Tom', 'Crash', 'Rim', 'Shaker'];
  
  return (
    <AudioProvider>
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="mb-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-dj-accent to-dj-highlight bg-clip-text text-transparent">
              BeatCraft Studio
            </h1>
            <p className="text-gray-400 mt-2">Browser-based Beat Machine for DJs</p>
          </div>
          
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <TransportControls />
              
              <div className="bg-dj-light p-4 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-4">Drum Pads</h3>
                <div className="grid grid-cols-4 gap-3 justify-items-center">
                  <DrumPad type="kick" color="#8B5CF6" label="Kick" />
                  <DrumPad type="snare" color="#D946EF" label="Snare" />
                  <DrumPad type="hihat" color="#F97316" label="Hat" />
                  <DrumPad type="clap" color="#10B981" label="Clap" />
                  <DrumPad type="tom" color="#3B82F6" label="Tom" />
                  <DrumPad type="crash" color="#EF4444" label="Crash" />
                  <DrumPad type="rim" color="#A78BFA" label="Rim" />
                  <DrumPad type="shaker" color="#EC4899" label="Shake" />
                </div>
              </div>
              
              <AudioVisualizer />
            </div>
            
            {/* Right Column */}
            <div className="space-y-4">
              <StepSequencer rows={drumRows} labels={drumLabels} />
              <EffectsRack />
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center text-gray-500 text-sm mt-8">
            <p>BeatCraft Studio - Create professional beats in your browser</p>
          </div>
        </div>
      </div>
    </AudioProvider>
  );
};

export default DJStudio;