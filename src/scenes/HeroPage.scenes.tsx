import { StyleSheet, css } from 'aphrodite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AIChatComponent from '../components/chat.component';
import RootContainer from '../container/RootContainer.component';
import { Button } from 'antd';
import Mandi from '../components/mandi.component';

type pageState = 'mandi' | 'assistant'

const HeroPage = () => {

  const [state, setState] = useState<pageState>('mandi');

  const [intro, setIntro] = useState(true);

  const demoAction = () => {
    setIntro(false);
  };

  const { t } = useTranslation();

  return (<RootContainer>{
    intro 
    ? 
    <div style={{padding:'4rem'}}>
      <h2 className={css(styles.mainHeading)}>{t('heroPageHeading')}</h2>
      <p className={css(styles.paragraph)}>
        {t('heroPageParagraph')}
      </p>
      <div className={css(styles.buttonContainer)}>
        <button className={css(styles.demoButton)} onClick={demoAction}>
          <span className={css(styles.buttonText)}>{t('heroPageButton')}</span>
        </button>
      </div>
    </div>
    :
    <>
      <div className={css(styles.buttonDiv)}>
        <Button type={`${state==='mandi'?'primary':'default'}`} onClick={()=>setState('mandi')}>{t('mandi')}</Button>
        <Button type={`${state==='assistant'?'primary':'default'}`} onClick={()=>setState('assistant')}>{t("farmersAssistance")}</Button>
      </div>
      {state==='assistant' ? <AIChatComponent /> : <Mandi />}
    </>
    }
    </RootContainer>
    );
};

const styles = StyleSheet.create({
  mainHeading: {
    color: '#1a472a', 
    letterSpacing: '0.01em',
    fontSize: '3rem', 
    fontWeight: 800,
    lineHeight: 1.2,
    padding: '1rem',
    textAlign: 'center',
    margin: '0 0 1rem 0',
    '@media (max-width: 768px)': {
      fontSize: '2.25rem',
    }
  },

  paragraph: {
    color: '#4a5568', 
    fontSize: '1.125rem',
    fontWeight: 400,
    lineHeight: 1.6,
    padding: '0 1rem 1.5rem',
    textAlign: 'center',
    maxWidth: '600px', 
    margin: '0 auto',
  },

  buttonContainer: {
    display: 'flex',
    padding: '1rem',
    justifyContent: 'center',
  },

  demoButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50px', 
    height: '3.5rem',
    padding: '0 2.5rem',
    background: 'linear-gradient(90deg, #4CAF50 0%, #81C784 100%)', 
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    border: 'none',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease', 
    
    ':hover': {
      transform: 'translateY(-3px)', 
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
    }
  },

  buttonText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  buttonDiv: {
    display:'flex',
    justifyContent:'space-around',
    padding:'1rem'
  }
});

export default HeroPage;