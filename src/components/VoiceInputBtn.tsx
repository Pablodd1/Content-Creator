import { useState, useRef, useEffect } from 'react';
import { Mic, Loader2 } from 'lucide-react';

interface VoiceInputBtnProps {
  onResult: (text: string) => void;
  lang?: string;
  className?: string;
}

export default function VoiceInputBtn({ onResult, lang = 'es-ES', className = '' }: VoiceInputBtnProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          onResult(text);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } else {
        setIsSupported(false);
      }
    }
  }, [onResult]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = lang;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!isSupported) return null;

  return (
    <button
      onClick={toggleListening}
      className={`p-1.5 rounded transition-colors flex items-center justify-center shrink-0 ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-[#e5e5df] text-stone-500 hover:bg-[#d5d5cf]'} ${className}`}
      title={isListening ? 'Listening...' : 'Click to dictate'}
      type="button"
    >
      {isListening ? <Loader2 size={12} className="animate-spin" /> : <Mic size={12} />}
    </button>
  );
}
