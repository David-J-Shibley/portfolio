import React, { useRef, useEffect } from 'react';
import { useAudioContext } from '../contexts/AudioContext';

const AudioVisualizer: React.FC = () => {
  const { getAnalyser, isPlaying } = useAudioContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    const analyser = getAnalyser();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Correctly size the canvas
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    const bufferLength = analyser?.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      
      analyser.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#8B5CF6');
        gradient.addColorStop(0.5, '#D946EF');
        gradient.addColorStop(1, '#F97316');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };
    
    if (isPlaying) {
      draw();
    }
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [getAnalyser, isPlaying]);
  
  return (
    <div className="bg-dj-light p-4 rounded-lg h-48">
      <h3 className="text-lg font-bold text-white mb-2">Visualizer</h3>
      <canvas 
        ref={canvasRef} 
        className="w-full h-32 rounded-md bg-dj-dark/50"
      />
    </div>
  );
};

export default AudioVisualizer;