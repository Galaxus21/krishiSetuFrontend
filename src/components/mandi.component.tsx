import { css, StyleSheet } from 'aphrodite';
import { useState, useEffect, type ChangeEvent, useRef } from 'react';
import { AgentService, type FarmerProfile } from '../utils/services/agent';


// --- Helper function to parse the raw log into chat messages ---
const parseAgentLog = (logString: string) => {
    const lines = logString.split('\n').filter(line => line.trim() !== '');
    const chatMessages = [];
    let currentThought = '';

    for (const line of lines) {
        if (line.includes("Thought:") || line.includes("Final Answer:")) {
            // Combine multi-line thoughts into a single bubble
            if (currentThought) {
                chatMessages.push({ sender: 'agent', text: currentThought.trim() });
            }
            currentThought = line.replace(/Thought:|Final Answer:/g, '').trim();
        } else if (line.includes("Action:") || line.includes("Action Input:")) {
            currentThought += `\n${line.trim()}`;
        } else {
            // If there was a thought being built, push it first
            if (currentThought) {
                chatMessages.push({ sender: 'agent', text: currentThought.trim() });
                currentThought = '';
            }
            // Push the system/observation message
            chatMessages.push({ sender: 'system', text: line.trim() });
        }
    }
    // Add any remaining thought
    if (currentThought) {
        chatMessages.push({ sender: 'agent', text: currentThought.trim() });
    }

    return chatMessages;
};


// --- Main Agent Component ---
const Mandi = () => {
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  // The log state will now store structured chat messages
  type AgentChat = {sender: 'agent' | 'system', text: string}[]
  const [agentChat, setAgentChat] = useState<AgentChat>([]);
  
  const agentService = AgentService.getInstance();
  const logEl = useRef<HTMLDivElement>(null);

  const [farmerState, setFarmerState] = useState<FarmerProfile>({
    farmer_name: "Ramesh Kumar",
    commodity: "Basmati Rice",
    grade: "A",
    minimum_price: 3500,
    location: "Karnal, Haryana",
  });

  function handleStateChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const newValue = name === 'minimum_price' ? parseFloat(value) || 0 : value;
    setFarmerState(prev => ({ ...prev, [name]: newValue }));
  }

  const handleRunAgent = async () => {
    setIsAgentRunning(true);
    setAgentChat([{sender: 'system', text: "✅ Activating agent... Sending profile to the backend."}]);

    try {
      const response = await agentService.runAgent(farmerState);
      // Parse the raw log into a chat format
      const parsedChat = parseAgentLog(response.agent_run_log);
      setAgentChat(parsedChat as AgentChat);
    } catch (error: any) {
      setAgentChat([{ sender: 'system', text: `❌ Error: ${error.message}` }]);
    } finally {
      setIsAgentRunning(false);
    }
  };
  
  useEffect(() => {
    if (logEl.current) {
        logEl.current.scrollTop = logEl.current.scrollHeight;
    }
  }, [agentChat]);

  return (
    <div className={css(styles.pageContainer)}>
      <div className={css(styles.agentDashboard)}>
        <header className={css(styles.header)}>
          <h1 className={css(styles.headerTitle)}>Proactive Sales Agent</h1>
          <div className={css(styles.statusIndicator, isAgentRunning && styles.statusActive)}>
            {isAgentRunning ? 'Running' : 'Idle'}
          </div>
        </header>
        <div className={css(styles.contentArea)}>
          {/* Settings Panel */}
          <div className={css(styles.panel, styles.settingsPanel)}>
            <h2 className={css(styles.panelTitle)}>Your Settings</h2>
            <div className={css(styles.settingItem)}>
                <span className={css(styles.settingLabel)}>Farmer:</span>
                <input className={css(styles.input)} name='farmer_name' value={farmerState.farmer_name} onChange={handleStateChange} />
            </div>
            <div className={css(styles.settingItem)}>
                <span className={css(styles.settingLabel)}>Commodity & Grade:</span>
                <div style={{display: 'flex', gap: '10px'}}>
                    <input className={css(styles.input) } style={{flex: 2}} name='commodity' value={farmerState.commodity} onChange={handleStateChange} />
                    <input className={css(styles.input)} style={{flex: 1}} name='grade' value={farmerState.grade} onChange={handleStateChange} />
                </div>
            </div>
            <div className={css(styles.settingItem)}>
                <span className={css(styles.settingLabel)}>Minimum Price (₹ per quintal):</span>
                <input className={css(styles.input)} type="number" name='minimum_price' value={farmerState.minimum_price} onChange={handleStateChange} />
            </div>
            <div className={css(styles.settingItem)}>
                <span className={css(styles.settingLabel)}>Location:</span>
                <input className={css(styles.input)} name='location' value={farmerState.location} onChange={handleStateChange} />
            </div>
            <button
                onClick={handleRunAgent}
                disabled={isAgentRunning}
                className={css(styles.button, isAgentRunning && styles.buttonDisabled)}
            >
                {isAgentRunning ? 'Searching...' : 'Find Deals Now'}
            </button>
          </div>
          {/* Log Panel - Now a Chat Display */}
          <div className={css(styles.panel, styles.logPanel)}>
            <h2 className={css(styles.panelTitle)}>Agent Negotiation Chat</h2>
            <div id="agent-log" ref={logEl} className={css(styles.logContainer)}>
                {agentChat.length > 0 ? (
                    agentChat.map((msg, index) => (
                        <div key={index} className={css(styles.messageBubble, msg.sender === 'agent' ? styles.agentBubble : styles.systemBubble)}>
                            <p className={css(styles.messageText)}>{msg.text}</p>
                        </div>
                    ))
                ) : (
                    <p className={css(styles.logPlaceholder)}>Agent is idle. Click "Find Deals Now" to start.</p>
                )}
            </div>
          </div>
        </div>
      </div>
      <div className={css(styles.agentDashboard)} style={{padding:'1rem'}}>
        <div className={css(styles.note)}>
            <strong>Note:</strong> This is just for a demo, so you can only test for the limited values of 'Commodity' and 'Grade' listed below.
        </div>

        <h3>Values that will result in Successful Matches</h3>
        <ul>
            <li><strong>Commodity:</strong> Basmati Rice, <strong>Grade:</strong> A</li>
            <li><strong>Commodity:</strong> Lokwan Wheat, <strong>Grade:</strong> A</li>
            <li><strong>Commodity:</strong> Wheat, <strong>Grade:</strong> A</li>
            <li><strong>Commodity:</strong> Turmeric, <strong>Grade:</strong> A</li>
            <li><strong>Commodity:</strong> Jute, <strong>Grade:</strong> A</li>
            <li><strong>Commodity:</strong> Chickpeas, <strong>Grade:</strong> A</li>
            <li><strong>Commodity:</strong> Coffee Beans, <strong>Grade:</strong> A</li>
            <li><strong>Commodity:</strong> Cotton, <strong>Grade:</strong> B</li>
        </ul>

        <hr />

        <h3>For a "Similar Match"</h3>
        <ul>
            <li><strong>Commodity:</strong> Wheat, <strong>Grade:</strong> A</li>
        </ul>
        
        <hr />

        <h3>For a "No Match" Scenario</h3>

        <p className={css(styles.scenarioSubtitle)}>1. A correct commodity with an incorrect grade:</p>
        <ul>
            <li><strong>Commodity:</strong> Basmati Rice, <strong>Grade:</strong> B</li>
            <li><strong>Commodity:</strong> Cotton, <strong>Grade:</strong> A</li>
        </ul>

        <p className={css(styles.scenarioSubtitle)}>2. A commodity not present in the database:</p>
        <ul>
            <li><strong>Commodity:</strong> Soybean, <strong>Grade:</strong> A</li>
            <li><strong>Commodity:</strong> Maize, <strong>Grade:</strong> A</li>
        </ul>
      </div>
    </div>
  );
};

// --- Inline Styles for the Component ---
const styles = StyleSheet.create({
  pageContainer: { display: 'flex', flexDirection:'column', rowGap:'20px', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#F5F5F5', fontFamily: "'Inter', sans-serif", padding: '1rem' },
  agentDashboard: { width: '100%', maxWidth: '1200px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', backgroundColor: '#4CAF50', color: 'white' },
  headerTitle: { margin: 0, fontSize: '1.5rem', fontWeight: 600 },
  statusIndicator: { backgroundColor: '#6c757d', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 500 },
  statusActive: { backgroundColor: '#ff9800' },
  contentArea: { display: 'grid', gridTemplateColumns: '1fr 2fr' },
  panel: { padding: '1.5rem' },
  panelTitle: { marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem', color: '#333', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.5rem' },
  settingsPanel: { backgroundColor: '#FAFAFA', borderRight: '1px solid #e0e0e0' },
  settingItem: { marginBottom: '1rem' },
  settingLabel: { display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' },
  input: { width: '100%', padding: '8px 12px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' },
  button: { width: '100%', padding: '0.75rem', fontSize: '1rem', fontWeight: 600, color: 'white', backgroundColor: '#4CAF50', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '1rem' },
  buttonDisabled: { backgroundColor: '#9E9E9E', cursor: 'not-allowed' },
  logPanel: { display: 'flex', flexDirection: 'column' },
  logContainer: { flex: 1, backgroundColor: '#fdfdfd', border: '1px solid #eee', borderRadius: '8px', padding: '1rem', overflowY: 'auto', height: '400px', display: 'flex', flexDirection: 'column', gap: '12px' },
  logPlaceholder: { color: '#999', textAlign: 'center', margin: 'auto', fontFamily: "'Inter', sans-serif" },
  messageBubble: { maxWidth: '85%', padding: '10px 14px', borderRadius: '18px', lineHeight: 1.5, whiteSpace: 'pre-wrap' },
  systemBubble: { backgroundColor: '#f0f0f0', color: '#333', alignSelf: 'flex-start', borderBottomLeftRadius: '4px' },
  agentBubble: { backgroundColor: '#4CAF50', color: 'white', alignSelf: 'flex-end', borderBottomRightRadius: '4px' },
  messageText: { margin: 0 },
  
  settingValue: {
    fontSize: '1rem',
    fontWeight: 500,
    color: '#333',
  },
  
  
  logEntry: {
    margin: '0 0 0.25rem 0',
  },
  logTime: {
    color: '#999',
    marginRight: '0.75rem',
  },
  
  note:{
    backgroundColor: '#fff3cd',
    borderLeft: '4px solid #ffc107',
    padding: '15px',
    borderRadius: '4px',
    fontStyle: 'italic',
  },
  scenarioSubtitle : {
      fontWeight: 'bold',
      marginTop: '20px',
      marginBottom: '10px',
      color: '#6c757d',
  },
  

})

export default Mandi;