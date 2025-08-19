import { css, StyleSheet } from "aphrodite";
import React, { useEffect, useRef, useState } from "react";
import { useSpeechToText } from "../../hooks/useSpeechRecognition";
import { AudioOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { Assistant, type LocationData } from "../../utils/services/assistant";
import { useLocation } from "../../hooks/useLocation";
import { useTranslation } from "react-i18next";



const BugIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h-4a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4"></path>
    <path d="m15 18-3-3 3-3"></path>
    <path d="M20 16l-4-4"></path>
    <path d="m12 12 8 8"></path>
    <path d="M2 12h6"></path>
    <path d="M7 12v-2"></path>
    <path d="M7 12v2"></path>
  </svg>
);

const QuestionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);


// --- Component for Advisory-based Chat (General Query) ---
const GeneralAdviceChatBox = ({ title, icon, inputPlaceholder }:{title:string, icon: React.JSX.Element, inputPlaceholder:string}) => {
  const {t} = useTranslation();
  const { transcript, listening, startListening, stopListening, resetTranscript } = useSpeechToText();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([{ sender: 'assistant', text: [
    t("generalQueryDis0"),
    t("generalQueryDis1"),
    t("generalQueryDis2")
  ].join('<br />')  }]);
  const [isLoading, setIsLoading] = useState(false);
  const { location: geo } = useLocation();

  const assistant = Assistant.getInstance();

  const handleSend = async () => {
    if (!inputText || isLoading) return;

    const userMessage = { sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    resetTranscript();
    setIsLoading(true);

    const locationData: LocationData = {
        latitude: geo.latitude,
        longitude: geo.longitude,
        crop: inputText,
        language: "English",
    };

    try {
      const response = await assistant.getAdvisory(locationData);
      const assistantMessage = { sender: 'assistant', text: response.advisory_report };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = { sender: 'assistant', text: "Sorry, I couldn't get a response. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (transcript) setInputText(transcript);
  }, [transcript]);

  const messageContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div style={styles.chatBox}>
        <ChatHeader title={title} icon={icon} />
        <div ref={messageContainerRef} style={styles.chatBoxMessages}>
            {messages.map((msg, index) => (
                <MessageBubble key={index} sender={msg.sender} text={msg.text} />
            ))}
            {isLoading && <div style={styles.loadingIndicator}>Assistant is typing...</div>}
        </div>
        <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            handleSend={handleSend}
            isLoading={isLoading}
            listening={listening}
            startListening={startListening}
            stopListening={stopListening}
            resetTranscript={resetTranscript}
            inputPlaceholder={inputPlaceholder}
        />
    </div>
  );
};


// --- DEDICATED Component for Disease Detection (handles file uploads) ---
const DiseaseDetectorChatBox = ({ title, icon, inputPlaceholder }: {title:string, icon: React.JSX.Element, inputPlaceholder:string}) => {
    const {t} = useTranslation();
    const { transcript, listening, startListening, stopListening, resetTranscript } = useSpeechToText();
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState([{ sender: 'assistant', text: [t("detectDiseaseDis0"),t("detectDiseaseDis1"),t("detectDiseaseDis2"),t("detectDiseaseDis3"),t("detectDiseaseDis4"),t("detectDiseaseDis5"),t("detectDiseaseDis6")].join('<br />') }]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const assistant = Assistant.getInstance();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setMessages(prev => [...prev, { sender: 'assistant', text: `Selected file: **${file.name}**. Add any context and press send.` }]);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleSend = async () => {
        if (isLoading || !selectedFile) {
            if (!selectedFile) {
                 setMessages(prev => [...prev, { sender: 'assistant', text: "Please upload an image first." }]);
            }
            return;
        }

        const userMessage = { sender: 'user', text: inputText || `Analyzing image: ${selectedFile.name}` };
        setMessages(prev => [...prev, userMessage]);
        setInputText("");
        resetTranscript();
        setIsLoading(true);

        try {
            const response = await assistant.identifyDisease(selectedFile, "Plant", inputText);
            const assistantMessage = { sender: 'assistant', text: response.analysis };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage = { sender: 'assistant', text: "Sorry, I couldn't analyze the image. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setSelectedFile(null);
        }
    };
    
    useEffect(() => {
        if (transcript) setInputText(transcript);
    }, [transcript]);

    const messageContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className={css(styles.chatBox)}>
            <ChatHeader title={title} icon={icon} />
            <div ref={messageContainerRef} className={css(styles.chatBoxMessages)}>
                {messages.map((msg, index) => (
                    <MessageBubble key={index} sender={msg.sender} text={msg.text} />
                ))}
                {isLoading && <div className={css(styles.loadingIndicator)}>Assistant is analyzing...</div>}
            </div>
            <ChatInput
                inputText={inputText}
                setInputText={setInputText}
                handleSend={handleSend}
                isLoading={isLoading}
                listening={listening}
                startListening={startListening}
                stopListening={stopListening}
                resetTranscript={resetTranscript}
                inputPlaceholder={inputPlaceholder}
                showUploadButton={true}
                onUploadClick={handleUploadClick}
            />
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
        </div>
    );
};


// --- Helper Sub-components for UI ---
const ChatHeader = ({ title, icon }: {title:string, icon: React.JSX.Element}) => (
    <div className={css(styles.chatBoxHeader)}>
        <div className={css(styles.chatBoxIcon)}>{icon}</div>
        <h3 className={css(styles.chatBoxTitle)}>{title}</h3>
    </div>
);

const MessageBubble = ({ sender, text }: {sender:string, text:string}) => (
    <div className={css(styles.messageBubble, sender === 'user' ? styles.userBubble : styles.assistantBubble)}>
        <p className={css(styles.messageText)} dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }} />
    </div>
);

interface ChatInputProps {
  inputText: string;
  setInputText: (value: string) => void;
  handleSend: () => void;
  isLoading: boolean;
  listening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript?: () => void;
  inputPlaceholder: string;
  showUploadButton?: boolean; // Optional prop
  onUploadClick?: () => void;   // Optional prop
}

const ChatInput = ({ inputText, setInputText, handleSend, isLoading, listening, startListening, stopListening, inputPlaceholder, showUploadButton = false, onUploadClick = () => {} }: ChatInputProps) => (
    <div className={css(styles.chatBoxInputArea)}>
        {showUploadButton && (
            <Button icon={<UploadOutlined />} onClick={onUploadClick} className={css(styles.uploadButton)}>Upload</Button>
        )}
        <Input
            placeholder={inputPlaceholder}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onPressEnter={handleSend}
            disabled={isLoading}
            suffix={<AudioOutlined
                onClick={() => listening ? stopListening() : startListening()}
                spin={listening}
                style={{ fontSize: 16, color: listening ? '#ff4d4f' : '#1677ff', cursor: 'pointer' }}
            />}
        />
        <Button type="primary" onClick={handleSend} loading={isLoading} className={css(styles.sendButton)}>
            Send
        </Button>
    </div>
);


// --- Final Exported Components ---
export const DiseaseDetector = () => <DiseaseDetectorChatBox title="Disease Detector" icon={<BugIcon />} inputPlaceholder="Type symptoms here..." />;
export const GeneralAdvice = () => <GeneralAdviceChatBox title="General Advice" icon={<QuestionIcon />} inputPlaceholder="Type your crop name..." />;


// --- Inline Styles ---
const styles = StyleSheet.create({
    chatBox: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', height: '450px', overflow: 'hidden' },
    chatBoxHeader: { display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eee', backgroundColor: '#FAFAFA' },
    chatBoxIcon: { color: '#4CAF50', marginRight: '0.75rem' },
    chatBoxTitle: { margin: 0, fontSize: '1.2rem', fontWeight: 500, color: '#444' },
    chatBoxMessages: { flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' },
    messageBubble: { maxWidth: '85%', padding: '10px 14px', borderRadius: '18px', lineHeight: 1.5 },
    assistantBubble: { backgroundColor: '#f0f0f0', color: '#333', alignSelf: 'flex-start', borderBottomLeftRadius: '4px' },
    userBubble: { backgroundColor: '#4CAF50', color: 'white', alignSelf: 'flex-end', borderBottomRightRadius: '4px' },
    messageText: { margin: 0 },
    loadingIndicator: { alignSelf: 'flex-start', color: '#888', fontSize: '0.9rem', fontStyle: 'italic' },
    chatBoxInputArea: { display: 'flex', alignItems: 'center', padding: '0.75rem', borderTop: '1px solid #eee', backgroundColor: '#FFF', gap: '8px' },
    uploadButton: { },
    sendButton: { backgroundColor: '#4CAF50' },
})
