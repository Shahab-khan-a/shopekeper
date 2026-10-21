import { Platform } from 'react-native';

export interface BoltaGallaOptions {
  amount: number;
  method: 'cash' | 'online' | 'udhaar';
  providerName?: string;
  customerName?: string;
  language?: 'en' | 'ur';
}

/**
 * Play a synthesized, crisp cash-register / bell chime using Web Audio API.
 * Requires 0 external audio files and works offline seamlessly.
 */
export function playCashRegisterChime(): void {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;

  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Harmonic bell chime: Dual tones (587Hz D5 + 880Hz A5 + 1174Hz D6)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15); // D6

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now); // A5
    osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.15); // A6

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.55);
    osc2.stop(now + 0.55);
  } catch {
    // Graceful silent fallback if AudioContext is blocked by browser policy
  }
}

/**
 * "Bolta Galla" Urdu & English Voice Confirmation Box.
 * Speaks the payment confirmation aloud just like a commercial POS soundbox.
 */
export function announceBoltaGalla(options: BoltaGallaOptions): void {
  const { amount, method, providerName = 'Online', customerName = '', language = 'ur' } = options;

  // 1. Always play the celebratory counter chime first
  playCashRegisterChime();

  // 2. Synthesize voice if speech synthesis is available
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    let textToSpeak = '';
    const roundedAmount = Math.round(amount);

    if (language === 'ur') {
      if (method === 'cash') {
        textToSpeak = `الحمدللہ! ${roundedAmount} روپے نقد وصول ہوئے۔ شکریہ!`;
      } else if (method === 'online') {
        textToSpeak = `${providerName} پر ${roundedAmount} روپے موصول ہوئے۔ شکریہ!`;
      } else {
        const cText = customerName ? customerName : 'گاہک';
        textToSpeak = `${cText} کے کھاتے میں ${roundedAmount} روپے درج ہوئے۔`;
      }
    } else {
      if (method === 'cash') {
        textToSpeak = `Alhamdulillah! ${roundedAmount} rupees cash received. Thank you!`;
      } else if (method === 'online') {
        textToSpeak = `${roundedAmount} rupees received via ${providerName}. Thank you!`;
      } else {
        const cText = customerName ? customerName : 'Customer';
        textToSpeak = `${roundedAmount} rupees recorded in credit for ${cText}.`;
      }
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const voices = window.speechSynthesis.getVoices();

    if (language === 'ur') {
      const urduVoice = voices.find(
        (v) => v.lang.toLowerCase().startsWith('ur') || v.lang.toLowerCase().startsWith('hi')
      );
      if (urduVoice) {
        utterance.voice = urduVoice;
      }
      utterance.lang = urduVoice ? urduVoice.lang : 'ur-PK';
    } else {
      const enVoice = voices.find((v) => v.lang.toLowerCase().includes('en-pk') || v.lang.toLowerCase().includes('en-in')) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('en'));
      if (enVoice) {
        utterance.voice = enVoice;
      }
      utterance.lang = 'en-US';
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Small delay so chime finishes cleanly before voice speaks
    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance);
      } catch {}
    }, 180);
  } catch (e) {
    console.warn('Bolta Galla voice announce failed:', e);
  }
}
