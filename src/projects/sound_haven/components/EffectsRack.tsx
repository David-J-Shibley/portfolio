import React, { useState } from 'react';
import { useAudioContext } from '../contexts/AudioContext';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { SlidersHorizontal } from 'lucide-react';

const EffectsRack: React.FC = () => {
  const { audioContext, masterGain } = useAudioContext();
  const [reverbEnabled, setReverbEnabled] = useState(false);
  const [reverbAmount, setReverbAmount] = useState(30);
  const [delayEnabled, setDelayEnabled] = useState(false);
  const [delayAmount, setDelayAmount] = useState(20);
  const [volume, setVolume] = useState(70);
  
  // Update master volume
  React.useEffect(() => {
    if (masterGain) {
      masterGain.gain.value = volume / 100;
    }
  }, [volume, masterGain]);
  
  return (
    <div className="bg-dj-light p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-5 h-5 text-dj-accent" />
        <h3 className="text-lg font-bold text-white">Effects</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Volume Control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-300">Master Volume</span>
            <span className="text-sm text-gray-400">{volume}%</span>
          </div>
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0])}
          />
        </div>
        
        {/* Reverb Control */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Reverb</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">{reverbAmount}%</span>
              <Switch
                checked={reverbEnabled}
                onCheckedChange={setReverbEnabled}
              />
            </div>
          </div>
          <Slider
            value={[reverbAmount]}
            min={0}
            max={100}
            step={1}
            disabled={!reverbEnabled}
            onValueChange={(value) => setReverbAmount(value[0])}
          />
        </div>
        
        {/* Delay Control */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Delay</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">{delayAmount}%</span>
              <Switch
                checked={delayEnabled}
                onCheckedChange={setDelayEnabled}
              />
            </div>
          </div>
          <Slider
            value={[delayAmount]}
            min={0}
            max={100}
            step={1}
            disabled={!delayEnabled}
            onValueChange={(value) => setDelayAmount(value[0])}
          />
        </div>
      </div>
    </div>
  );
};

export default EffectsRack;