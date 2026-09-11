import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Web Speech API interface declarations for browser compatibility
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

interface VoiceComplaintInputProps {
  onTranscriptComplete: (transcript: string) => void;
}

export const VoiceComplaintInput: React.FC<VoiceComplaintInputProps> = ({ onTranscriptComplete }) => {
  const { i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      // Select speech language based on active app language
      if (i18n.language === 'te') {
        recognition.lang = 'te-IN';
      } else if (i18n.language === 'hi') {
        recognition.lang = 'hi-IN';
      } else {
        recognition.lang = 'en-IN';
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (err: Event) => {
        console.warn('Speech recognition error:', err);
        setErrorMessage('Could not access microphone or audio is unclear. Please type your problem.');
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition init failed', e);
      setIsSupported(false);
    }
  }, [i18n.language]);

  const toggleListening = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    setErrorMessage(null);

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (transcript.trim()) {
        onTranscriptComplete(transcript.trim());
      }
    } else {
      setTranscript('');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition', err);
        setErrorMessage('Failed to start microphone. Please check permissions.');
      }
    }
  };

  const handleApplyTranscript = () => {
    if (transcript.trim()) {
      onTranscriptComplete(transcript.trim());
      setIsListening(false);
      recognitionRef.current?.stop();
    }
  };

  if (!isSupported) {
    return (
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <MicOff className="w-4 h-4 text-slate-400" />
          <span>Voice input available on Chrome/Edge/Safari.</span>
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Speak Your Problem</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                {i18n.language === 'te' ? 'తెలుగు (te-IN)' : i18n.language === 'hi' ? 'हिन्दी (hi-IN)' : 'English (en-IN)'}
              </span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Tap the mic and speak naturally in your chosen language
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleListening}
          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            isListening
              ? 'bg-rose-600 text-white shadow-lg animate-pulse ring-4 ring-rose-200'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
          }`}
        >
          {isListening ? (
            <>
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>Stop & Process</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" />
              <span>Start Speaking</span>
            </>
          )}
        </button>
      </div>

      {/* Real-time Listening Wave / Transcript Display */}
      {isListening && (
        <div className="p-3 bg-white/90 backdrop-blur-xs rounded-xl border border-emerald-300 text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Listening... Speak clearly into your microphone</span>
          </div>
          <p className="italic text-slate-800 min-h-[30px] font-medium">
            {transcript || 'Say something like: "Garbage has not been collected in our street for 3 days"'}
          </p>
        </div>
      )}

      {/* Processed Transcript Confirmation */}
      {!isListening && transcript.trim() && (
        <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs space-y-2">
          <p className="font-semibold text-slate-700">Transcribed Voice Text:</p>
          <p className="text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-medium">
            "{transcript}"
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setTranscript('')}
              className="px-2.5 py-1 text-slate-500 hover:text-slate-700 text-[11px]"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleApplyTranscript}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Fill & Suggest Category</span>
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
