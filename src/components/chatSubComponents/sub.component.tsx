import { css, StyleSheet } from "aphrodite";
import { useState } from "react";

// --- SVG Icons (to avoid external libraries) ---
const PlantIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10h10v2a5 5 0 0 1-10 0v-2z"></path>
    <path d="M12 12V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"></path>
    <path d="M12 12v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2"></path>
    <path d="M12 12h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"></path>
    <path d="M12 4V2"></path>
  </svg>
);

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

const GovernmentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
    <path d="M2 17l10 5 10-5"></path>
    <path d="M2 12l10 5 10-5"></path>
  </svg>
);

const QuestionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

// --- Reusable ChatBox Component ---
const ChatBox = ({ title, icon, placeholder, inputPlaceholder, showUploadButton = false }: {title: string, icon: React.JSX.Element, placeholder:string,inputPlaceholder:string,showUploadButton?: boolean}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message) return;
    console.log(`Sending message from "${title}": ${message}`);
    setMessage('');
  };

  const handleUpload = () => {
    console.log(`Upload button clicked in "${title}"`);
  };

  return (
    <div className={css(styles.chatBox)}>
      <div className={css(styles.chatBoxHeader)}>
        <div className={css(styles.chatBoxIcon)}>{icon}</div>
        <h3 className={css(styles.chatBoxTitle)}>{title}</h3>
      </div>
      <div className={css(styles.chatBoxMessages)}>
        <p className={css(styles.placeholderText)}>{placeholder}</p>
      </div>
      <div className={css(styles.chatBoxInputArea)}>
        {showUploadButton && (
          <button onClick={handleUpload} style={{...styles.button, ...styles.uploadButton}}>
            Upload
          </button>
        )}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={inputPlaceholder}
          style={styles.chatInput}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} style={{...styles.button, ...styles.sendButton}}>
          Send
        </button>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function ChatBoxes() {
  
  return (
    
      <main>
        <ChatBox
          title="Crop Recommender"
          icon={<PlantIcon />}
          placeholder="Welcome! Describe your soil, climate, and location to get a crop recommendation."
          inputPlaceholder="e.g., Black soil, 28°C, low rainfall..."
        />
        <ChatBox
          title="Disease Detector"
          icon={<BugIcon />}
          placeholder="Upload a photo of the affected plant or describe its symptoms."
          inputPlaceholder="Type symptoms here..."
          showUploadButton={true}
        />
        <ChatBox
          title="Govt. Scheme Advisor"
          icon={<GovernmentIcon />}
          placeholder="Ask me about financial aid, subsidies, or any government scheme for farmers."
          inputPlaceholder="e.g., PM-KISAN eligibility"
        />
        <ChatBox
          title="Ask Me Anything"
          icon={<QuestionIcon />}
          placeholder="Have other questions about weather, market prices, or farming techniques? Ask here!"
          inputPlaceholder="Type your question..."
        />
      </main>
  );
}

// --- Inline Styles Object ---
// Converted from Aphrodite to a standard JS object for compatibility.
const styles = StyleSheet.create({
  pageContainer: {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#F5F5F5',
    minHeight: '100vh',
    color: '#333',
  },
  header: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '1rem 2rem',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  headerTitle: {
    margin: 0,
    fontSize: '2rem',
    fontWeight: 600,
  },
  gridContainer: {
    display: 'grid',
    gap: '2rem',
  },
  chatBox: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    height: '350px',
    overflow: 'hidden',
  },
  chatBoxHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: '1px solid #eee',
    backgroundColor: '#FAFAFA',
  },
  chatBoxIcon: {
    color: '#4CAF50',
    marginRight: '0.75rem',
  },
  chatBoxTitle: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: 500,
    color: '#444',
  },
  chatBoxMessages: {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
  },
  placeholderText: {
    color: '#666',
    fontSize: '0.95rem',
    lineHeight: 1.5,
    margin: 0,
  },
  chatBoxInputArea: {
    display: 'flex',
    padding: '0.75rem',
    borderTop: '1px solid #eee',
    backgroundColor: '#FFF',
  },
  chatInput: {
    flex: 1,
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 500,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    marginLeft: '0.5rem',
  },
  uploadButton: {
    backgroundColor: '#f0f0f0',
    color: '#555',
    marginRight: '0.5rem',
  },
});