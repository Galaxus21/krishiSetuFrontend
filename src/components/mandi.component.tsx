import { css, StyleSheet } from 'aphrodite';
import { useState, useEffect, type ChangeEvent } from 'react';
import { AgentService, type FarmerProfile } from '../utils/services/agent';


// --- Main Agent Component ---
const Mandi = () => {
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [agentLog, setAgentLog] = useState<{text: string, time: Date}[]>([]);
  
  const agentService = AgentService.getInstance();

  const [farmerState, setFarmerState] = useState<FarmerProfile>({
    farmer_name: "Ramesh Kumar",
    commodity: "Basmati Rice",
    grade: "A",
    minimum_price: 3500,
    location: "Karnal, Haryana",
  })

  function handleStateChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    
    const newValue = name === 'minimum_price' ? parseFloat(value) || 0 : value;

    setFarmerState(prev => ({
        ...prev,
        [name]: newValue
    }));
  }


  const addLogEntry = (message: string) => {
    setAgentLog(prev => [...prev, { text: message, time: new Date() }]);
  };

  const handleRunAgent = async () => {
    setIsAgentRunning(true);
    setAgentLog([]);

    addLogEntry("✅ Activating agent... Sending profile to the backend.");

    try {
      const response = await agentService.runAgent(farmerState);
      const logs = response.agent_run_log.split('\n').filter(line => line.trim() !== '');
      const formattedLogs = logs.map(logText => ({ text: logText, time: new Date() }));
      setAgentLog(formattedLogs);
    } catch (error: any) {
      addLogEntry(`❌ Error: ${error.message}`);
    } finally {
      setIsAgentRunning(false);
    }
  };
  
  useEffect(() => {
    const logElement = document.getElementById('agent-log');
    if (logElement) {
      logElement.scrollTop = logElement.scrollHeight;
    }
  }, [agentLog]);


  const dynamicStyles = StyleSheet.create({
    contentArea: {
      gridTemplateColumns: '1fr 2fr',
    },
    settingsPanel: {
      borderRight: '1px solid #e0e0e0',
      borderBottom: 'none',
    }
  })

  return (
    <div className={css(styles.pageContainer)}>
      <div className={css(styles.agentDashboard)}>
        <header className={css(styles.header)}>
          <h1 className={css(styles.headerTitle)}>Proactive Sales Agent</h1>
          <div className={css(styles.statusIndicator, isAgentRunning && styles.statusActive)}>
            {isAgentRunning ? 'Running' : 'Idle'}
          </div>
        </header>

        <div className={css(dynamicStyles.contentArea, styles.contentArea)}>
          <div className={css(dynamicStyles.settingsPanel,styles.panel,styles.settingsPanel)}>
            <h2 className={css(styles.panelTitle)}>Your Settings</h2>
            <div className={css(styles.settingItem)}>
                <span className={css(styles.settingLabel)}>Farmer:</span>
                <span className={css(styles.settingValue)}><input name='farmer_name' value={farmerState.farmer_name} onChange={handleStateChange} /></span>
            </div>
            <div className={css(styles.settingItem)}>
              <span className={css(styles.settingLabel)}>Commodity:</span>
              <span className={css(styles.settingValue)}><input name='commodity' value={farmerState.commodity} onChange={handleStateChange} /> <br /> (Grade<input value={farmerState.grade} name='grade' onChange={handleStateChange} />)</span>
            </div>
            <div className={css(styles.settingItem)}>
              <span className={css(styles.settingLabel)}>Minimum Price:</span>
              <span className={css(styles.settingValue)}>₹<input name='minimum_price' value={farmerState.minimum_price} onChange={handleStateChange} /> / quintal</span>
            </div>
            <div className={css(styles.settingItem)}>
              <span className={css(styles.settingLabel)}>Location:</span>
              <span className={css(styles.settingValue)}><input name='location' value={farmerState.location} onChange={handleStateChange} /></span>
            </div>
            <button
              onClick={handleRunAgent}
              disabled={isAgentRunning}
              className={css(styles.button, isAgentRunning && styles.buttonDisabled)}
            >
              {isAgentRunning ? 'Searching...' : 'Find Deals Now'}
            </button>
          </div>

          <div className={css(styles.panel, styles.logPanel)}>
            <h2 className={css(styles.panelTitle)}>Agent Log</h2>
            <div id="agent-log" className={css(styles.logContainer)}>
              {agentLog.length > 0 ? (
                agentLog.map((log, index) => (
                  <p key={index} className={css(styles.logEntry)}>
                    <span className={css(styles.logTime)}>{log.time.toLocaleTimeString()}</span>
                    {log.text}
                  </p>
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
  pageContainer: {
    display: 'flex',
    flexDirection:'column',
    rowGap:'10px',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#F5F5F5',
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
    padding: '1rem',
  },
  agentDashboard: {
    width: '100%',
    maxWidth: '1200px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  statusIndicator: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 500,
  },
  statusActive: {
    backgroundColor: '#ff9800',
  },
  contentArea: {
    display: 'grid',
  },
  panel: {
    padding: '1.5rem',
  },
  panelTitle: {
    marginTop: 0,
    marginBottom: '1.5rem',
    fontSize: '1.2rem',
    color: '#333',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '0.5rem',
  },
  settingsPanel: {
    backgroundColor: '#FAFAFA',
  },
  settingItem: {
    marginBottom: '1rem',
  },
  settingLabel: {
    display: 'block',
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '0.25rem',
  },
  settingValue: {
    fontSize: '1rem',
    fontWeight: 500,
    color: '#333',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'white',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  buttonDisabled: {
    backgroundColor: '#9E9E9E',
    cursor: 'not-allowed',
  },
  logPanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  logContainer: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '1rem',
    overflowY: 'auto',
    height: '350px',
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    color: '#444',
  },
  logEntry: {
    margin: '0 0 0.25rem 0',
  },
  logTime: {
    color: '#999',
    marginRight: '0.75rem',
  },
  logPlaceholder: {
    color: '#999',
    textAlign: 'center',
    paddingTop: '4rem',
    fontFamily: "'Inter', sans-serif",
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
  }
})

export default Mandi;