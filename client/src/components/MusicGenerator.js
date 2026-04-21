import React, { useEffect } from 'react';

// Music generation utility using Web Audio API
class MusicSynthesizer {
  static generateMelody(seed) {
    // Seeded random number generator
    const rng = this.seededRandom(seed);
    
    // Musical scales and chord progressions
    const scales = {
      major: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10],
      pentatonic: [0, 2, 4, 7, 9],
    };

    const chordProgressions = [
      [0, 4, 7],      // I
      [2, 5, 9],      // ii
      [4, 7, 11],     // iii
      [5, 9, 0],      // IV
      [7, 11, 2],     // V
      [9, 0, 4],      // vi
    ];

    const baseFrequency = 440; // A4
    const scale = scales[Object.keys(scales)[Math.floor(rng() * 3)]];
    
    // Generate melody notes (in Hz)
    const notes = [];
    const duration = 0.25; // Quarter note
    const tempo = 120; // BPM
    
    // Generate 16 notes for an 8-bar phrase
    for (let i = 0; i < 16; i++) {
      const octaveOffset = Math.floor(rng() * 2) - 1; // -1, 0, or 1 octave
      const scaleIndex = Math.floor(rng() * scale.length);
      const semitone = scale[scaleIndex] + (octaveOffset * 12);
      const frequency = baseFrequency * Math.pow(2, semitone / 12);
      notes.push(frequency);
    }

    return { notes, duration, tempo };
  }

  static seededRandom(seed) {
    return function() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }

  static synthesizeAudio(seed) {
    return new Promise((resolve) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const { notes, duration, tempo } = this.generateMelody(seed);
      
      const beatDuration = (60 / tempo) * duration;
      let currentTime = audioContext.currentTime;

      // Create reverb effect using convolver
      const dry = audioContext.createGain();
      const wet = audioContext.createGain();
      const convolver = audioContext.createConvolver();
      const dryGain = audioContext.createGain();
      const wetGain = audioContext.createGain();
      
      dryGain.gain.value = 0.8;
      wetGain.gain.value = 0.2;
      
      dry.connect(dryGain);
      wet.connect(convolver);
      convolver.connect(wetGain);
      dryGain.connect(audioContext.destination);
      wetGain.connect(audioContext.destination);

      // Generate notes with envelope
      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const envelope = audioContext.createGain();
        
        oscillator.frequency.value = frequency;
        oscillator.type = index % 4 === 0 ? 'sine' : index % 4 === 1 ? 'triangle' : 'square';
        
        // ADSR envelope
        const startTime = currentTime + index * beatDuration;
        const endTime = startTime + beatDuration;
        
        envelope.gain.setValueAtTime(0, startTime);
        envelope.gain.linearRampToValueAtTime(0.7, startTime + beatDuration * 0.1);
        envelope.gain.exponentialRampToValueAtTime(0.3, startTime + beatDuration * 0.5);
        envelope.gain.exponentialRampToValueAtTime(0.01, endTime);
        
        oscillator.connect(envelope);
        envelope.connect(dry);
        envelope.connect(wet);
        
        oscillator.start(startTime);
        oscillator.stop(endTime);
      });

      // Resolve after all notes complete
      const totalDuration = notes.length * beatDuration * 1000;
      setTimeout(() => resolve(), totalDuration);
    });
  }
}

function MusicGenerator() {
  useEffect(() => {
    // Make the synthesizer globally available
    window.MusicSynthesizer = MusicSynthesizer;
  }, []);

  return null;
}

export default MusicGenerator;

// Export for use in other components
export { MusicSynthesizer };
