import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useCallback } from 'react';

export function useSpeechToText(){
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  
  const startListening = useCallback(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("Browser doesn't support speech recognition.");
      return
    }
    SpeechRecognition.startListening({continuous: true, language: 'en-IN'});
  }, [browserSupportsSpeechRecognition]);

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
  }, []);

  return {
    listening,
    transcript,
    resetTranscript,
    startListening,
    stopListening,
  }
};