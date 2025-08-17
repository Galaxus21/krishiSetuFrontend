import { Input, Button } from "antd";
import { css, StyleSheet } from "aphrodite";
import { useTranslation } from "react-i18next";
import { useSpeechToText } from "../hooks/useSpeechRecognition";
import { useState, useEffect } from "react";
import { AudioOutlined } from "@ant-design/icons";

const AIChatComponent = () => {

  const { t } = useTranslation();

  const { 
    transcript,
    listening, 
    startListening, 
    stopListening, 
    // resetTranscript,
  } = useSpeechToText();

  const [inputText, setInputText] = useState("");

  // const [_location, setLocation] = useState({ latitude:0, longitude: 0});

  // useEffect(() => {
  //   if ("geolocation" in navigator) {
  //       navigator.geolocation.getCurrentPosition(
  //           (position) => {
  //               setLocation({
  //                   latitude: position.coords.latitude,
  //                   longitude: position.coords.longitude,
  //               });
  //               console.log(`Latitude: ${position.coords.latitude},Longitude ${position.coords.longitude}`);
  //           },
  //           (err) => {
  //               console.warn(`Err Occured: ${err.message}`);
  //           },
  //           { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 } // Optional options
  //       );
  //   } else {
  //       console.warn("Geolocation is not supported by your browser.");
  //   }
  // }, []);

  const handleVoiceInputToggle = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    if (transcript) {
      console.log(`Transcript: ${transcript}`);
      setInputText(transcript);
    }
  }, [transcript]);

  return (
    <div className={css(styles.container)}>
      <div style={{border: '0px solid black', }}>
        <Input 
          placeholder={t('askMeAnything')} 
          className={css(styles.input)}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          suffix={<AudioOutlined
            onClick={handleVoiceInputToggle}
            spin={listening}
            style={{
              fontSize: 16,
              color: '#1677ff',
            }}
          />}
        />
        <Button 
          type="text"
          onClick={handleVoiceInputToggle}
          loading={listening}
        >
          {/* {listening ? '⏹️' : '🎙️'} */}
        </Button>
        <p className={css(styles.p)}>Transcript: {transcript}</p>
        <p className={css(styles.p)}>Input Text: {inputText}</p>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem'
  },
  input: {
    width: '100%',
    height: '3rem',
    border: 'none',
  },
  p: {
    border:'1px solid black'
  }

})

export default AIChatComponent;
