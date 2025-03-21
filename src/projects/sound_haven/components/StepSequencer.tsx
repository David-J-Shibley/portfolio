import React, { useState, useEffect, useCallback } from 'react';
import { useAudioContext } from '../contexts/AudioContext';
import SampleService, { DrumType } from '../services/SampleService';

interface StepSequencerProps {
  rows: DrumType[];
  labels: string[];
}

interface SequencerPattern {
  [key: string]: boolean[];
}

const StepSequencer: React.FC<StepSequencerProps> = ({ rows, labels }) => {
  const { audioContext, masterGain, isPlaying, currentStep } = useAudioContext();
  const [samples, setSamples] = useState<Map<DrumType, AudioBuffer>>(new Map());
  const [pattern, setPattern] = useState<SequencerPattern>({});
  
  // Initialize empty pattern
  useEffect(() => {
    const initialPattern: SequencerPattern = {};
    rows.forEach(row => {
      initialPattern[row] = Array(16).fill(false);
    });
    setPattern(initialPattern);
  }, [rows]);
  
  // Load samples
  useEffect(() => {
    if (audioContext) {
      SampleService.setAudioContext(audioContext);
      SampleService.loadAllDrumSamples()
        .then(setSamples)
        .catch(err => console.error('Failed to load samples:', err));
    }
  }, [audioContext]);
  
  // Play sounds on current step
  useEffect(() => {
    if (!isPlaying || !audioContext || !masterGain) return;
    
    rows.forEach(row => {
      if (pattern[row] && pattern[row][currentStep]) {
        const buffer = samples.get(row);
        if (buffer) {
          const source = audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(masterGain);
          source.start(0);
        }
      }
    });
  }, [currentStep, isPlaying, pattern, rows, samples, audioContext, masterGain]);
  
  // Toggle cell state
  const toggleCell = useCallback((row: DrumType, col: number) => {
    setPattern(prev => {
      const newPattern = { ...prev };
      newPattern[row] = [...prev[row]];
      newPattern[row][col] = !newPattern[row][col];
      return newPattern;
    });
  }, []);
  
  // Clear pattern
  const clearPattern = () => {
    const emptyPattern: SequencerPattern = {};
    rows.forEach(row => {
      emptyPattern[row] = Array(16).fill(false);
    });
    setPattern(emptyPattern);
  };
  
  return (
    <div className="bg-dj-light p-4 rounded-lg">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Step Sequencer</h3>
        <button 
          onClick={clearPattern}
          className="px-3 py-1 text-sm bg-dj-muted hover:bg-dj-accent rounded-md transition-colors"
        >
          Clear
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {rows.map((row, rowIndex) => (
            <div key={row} className="flex items-center mb-2">
              <div className="w-16 text-right pr-2 text-sm text-gray-300">{labels[rowIndex]}</div>
              <div className="flex">
                {Array(16).fill(0).map((_, colIndex) => (
                  <div 
                    key={colIndex}
                    className={`
                      step-sequencer-cell
                      ${pattern[row]?.[colIndex] ? 'step-sequencer-cell-active' : ''}
                      ${currentStep === colIndex && isPlaying ? 'step-sequencer-cell-playing' : ''}
                    `}
                    onClick={() => toggleCell(row, colIndex)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Step indicators */}
      <div className="flex mt-2 pl-16">
        {[1, 5, 9, 13].map(step => (
          <div key={step} className="text-xs text-gray-500 w-[128px] text-center">
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepSequencer;
