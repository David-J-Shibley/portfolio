export const drumSamples = {
    kick: '../sounds/kick.wav',
    snare: '../sounds/kick.wav',
    hihat: '../sounds/kick.wav',
    clap: '../sounds/kick.wav',
    tom: '../sounds/kick.wav',
    crash: '../sounds/kick.wav',
    rim: '../sounds/kick.wav',
    shaker: '../sounds/kick.wav',
  };
  
  export type DrumType = keyof typeof drumSamples;
  
  class SampleService {
    private sampleCache: Map<string, AudioBuffer> = new Map();
    private audioContext: AudioContext | null = null;
    
    setAudioContext(context: AudioContext) {
      this.audioContext = context;
    }

    async loadAudio(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    
            console.log('Response Headers:', response.headers);
            
            const arrayBuffer = await response.arrayBuffer();
            console.log('ArrayBuffer Size:', arrayBuffer.byteLength);
    
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            return await audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    
    async loadSample(url: string): Promise<AudioBuffer> {
        this.loadAudio('/sounds/kick.wav')
            .then(decodedBuffer => console.log('Decoded successfully:', decodedBuffer))
            .catch(error => console.error('Decoding failed:', error));

      if (!this.audioContext) {
        throw new Error('Audio context not initialized');
      }
      
      // Check if sample is already cached
      if (this.sampleCache.has(url)) {
        return this.sampleCache.get(url) as AudioBuffer;
      }
      
      // Fetch the audio file
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      
      // Decode the audio data
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      // Cache the decoded buffer
      this.sampleCache.set(url, audioBuffer);
      
      return audioBuffer;
    }
    
    async loadAllDrumSamples(): Promise<Map<DrumType, AudioBuffer>> {
      const result = new Map<DrumType, AudioBuffer>();
      
      const promises = Object.entries(drumSamples).map(async ([key, url]) => {
        const buffer = await this.loadSample(url);
        result.set(key as DrumType, buffer);
      });
      
      await Promise.all(promises);
      return result;
    }
  }
  
  export default new SampleService();