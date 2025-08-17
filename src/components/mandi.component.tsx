import { css, StyleSheet } from 'aphrodite';
import { useState, useEffect } from 'react';

// --- Helper Hook for Responsive Design ---
// This hook detects the window size to apply mobile styles without needing a CSS-in-JS library.


// --- Mock Data: Simulate RFQs on a B2B Platform ---
const mockPlatformRFQs = [
  {
    buyer_id: "BUYER_001",
    buyer_name: "Delhi Grocers",
    commodity: "Basmati Rice",
    quantity_tonnes: 20,
    delivery_location: "Delhi",
    buyer_rating: 4.8
  },
  {
    buyer_id: "BUYER_002",
    buyer_name: "Mumbai Staples",
    commodity: "Wheat",
    quantity_tonnes: 100,
    delivery_location: "Mumbai",
    buyer_rating: 4.5
  },
  {
    buyer_id: "BUYER_003",
    buyer_name: "Punjab Wholesalers",
    commodity: "Basmati Rice",
    quantity_tonnes: 30,
    delivery_location: "Chandigarh",
    buyer_rating: 4.9
  }
];

// --- Helper function to add delays for demo effect ---
const sleep = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Main Agent Component ---
const Mandi = () => {
  // State for the agent's operation
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [agentLog, setAgentLog] = useState<{text:string,time:Date}[]>([]);
  const [finalAlert, setFinalAlert] = useState<{title:string,message:string}|null>(null);

  // Farmer's settings (could be props or from a form)
  const farmerSettings = {
    commodity: "Basmati Rice",
    minPrice: 3500, // per quintal
    location: "Karnal, Haryana"
  };

  // Function to add a new log entry
  const addLog = (message: string) => {
    setAgentLog(prev => [...prev, { text: message, time: new Date() }]);
  };

  // --- The core agent simulation logic ---
  const runAgentSimulation = async () => {
    setIsAgentRunning(true);
    setAgentLog([]);
    setFinalAlert(null);

    addLog(`✅ Agent activated. Monitoring for '${farmerSettings.commodity}' opportunities.`);
    await sleep(1500);

    addLog("🔍 Scanning B2B platform for new RFQs...");
    await sleep(2000);

    const opportunities = mockPlatformRFQs.filter(
      (rfq) => rfq.commodity === farmerSettings.commodity
    );

    if (opportunities.length === 0) {
      addLog(`🟡 No new opportunities found. Will continue monitoring.`);
      setIsAgentRunning(false);
      return;
    }

    addLog(`🎉 Found ${opportunities.length} new opportunities! Analyzing best option...`);
    await sleep(1500);

    // Simple logic: pick the buyer with the highest rating
    const bestOpportunity = opportunities.sort((a, b) => b.buyer_rating - a.buyer_rating)[0];

    addLog(`📈 Best match: ${bestOpportunity.buyer_name} (Rating: ${bestOpportunity.buyer_rating}/5).`);
    await sleep(1500);

    addLog("🤖 Calculating smart price based on buyer's location...");
    await sleep(1000);

    // Simple pricing rule for the demo
    let smartPrice = farmerSettings.minPrice;
    if (bestOpportunity.delivery_location === "Delhi") {
      smartPrice *= 1.05; // 5% premium for a major metro
    }
    smartPrice = Math.round(smartPrice);

    addLog(`💰 Calculated quote: ₹${smartPrice} per quintal.`);
    await sleep(1500);

    addLog(`📤 Submitting quote to ${bestOpportunity.buyer_name}...`);
    await sleep(1000);

    addLog("✅ Quote submitted successfully!");

    // Set the final alert message for the farmer
    setFinalAlert({
      title: "New Deal Found & Quoted!",
      message: `I have sent a quote of ₹${smartPrice}/quintal to '${bestOpportunity.buyer_name}' in ${bestOpportunity.delivery_location} for ${bestOpportunity.quantity_tonnes} tonnes of your rice. I will notify you when they respond.`
    });

    setIsAgentRunning(false);
  };

  useEffect(() => {
    // Scroll to the bottom of the log as new messages appear
    const logElement = document.getElementById('agent-log');
    if (logElement) {
      logElement.scrollTop = logElement.scrollHeight;
    }
  }, [agentLog]);


  const dynamicStyles = StyleSheet.create({
    contentArea: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '0',
    },
    settingsPanel: {
        backgroundColor: '#FAFAFA',
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

        <div className={css(dynamicStyles.contentArea)}>
          {/* Left Panel: Settings */}
          <div className={css(dynamicStyles.settingsPanel, styles.panel)}>
            <h2 className={css(styles.panelTitle)}>Your Settings</h2>
            <div className={css(styles.settingItem)}>
              <span className={css(styles.settingLabel)}>Commodity:</span>
              <span className={css(styles.settingValue)}>{farmerSettings.commodity}</span>
            </div>
            <div className={css(styles.settingItem)}>
              <span className={css(styles.settingLabel)}>Minimum Price:</span>
              <span className={css(styles.settingValue)}>₹{farmerSettings.minPrice} / quintal</span>
            </div>
            <div className={css(styles.settingItem)}>
              <span className={css(styles.settingLabel)}>Location:</span>
              <span className={css(styles.settingValue)}>{farmerSettings.location}</span>
            </div>
            <button
              onClick={runAgentSimulation}
              disabled={isAgentRunning}
              className={css(styles.button,isAgentRunning && styles.buttonDisabled)}
            >
              {isAgentRunning ? 'Searching...' : 'Find Deals Now'}
            </button>
          </div>

          {/* Right Panel: Agent Log & Results */}
          <div className={css(styles.panel,styles.logPanel)}>
            <h2 className={css(styles.panelTitle)}>Agent Log</h2>
            <div id="agent-log" className={css(styles.logContainer)}>
              {agentLog.length > 0 ? (
                agentLog.map((log, index) => (
                  <p key={index} style={styles.logEntry}>
                    <span className={css(styles.logTime)}>{log.time.toLocaleTimeString()}</span>
                    {log.text}
                  </p>
                ))
              ) : (
                <p className={css(styles.logPlaceholder)}>Agent is idle. Click "Find Deals Now" to start.</p>
              )}
            </div>
            {finalAlert && (
              <div className={css(styles.alertBox)}>
                <h3 className={css(styles.alertTitle)}>{finalAlert.title}</h3>
                <p className={css(styles.alertMessage)}>{finalAlert.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Inline Styles Object ---
const styles = StyleSheet.create({
  pageContainer: {
    display: 'flex',
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
    transition: 'background-color 0.3s ease',
  },
  statusActive: {
    backgroundColor: '#ff9800',
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
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
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
    height: '250px',
    marginBottom: '1rem',
  },
  logEntry: {
    margin: '0 0 0.5rem 0',
    fontSize: '0.9rem',
    color: '#444',
  },
  logTime: {
    color: '#999',
    marginRight: '0.5rem',
    fontSize: '0.8rem',
  },
  logPlaceholder: {
    color: '#999',
    textAlign: 'center',
    paddingTop: '4rem',
  },
  alertBox: {
    padding: '1rem',
    backgroundColor: '#E8F5E9', // Light green
    borderLeft: '5px solid #4CAF50',
    borderRadius: '4px',
  },
  alertTitle: {
    margin: '0 0 0.5rem 0',
    color: '#2E7D32', // Darker green
    fontSize: '1.1rem',
  },
  alertMessage: {
    margin: 0,
    color: '#388E3C',
    lineHeight: 1.5,
  },
});

export default Mandi;
