import { StyleSheet, css } from 'aphrodite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AIChatComponent from '../components/chat.component';
import RootContainer from '../container/RootContainer.component';

const HeroPage = () => {

  const [intro, setIntro] = useState(true);

  const demoAction = () => {
    setIntro(false);
  };

  const { t } = useTranslation();

  return (<RootContainer>
  {intro ? <div>
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
    :<AIChatComponent />
    }
  </RootContainer>);
};

const styles = StyleSheet.create({
  
  mainHeading: {
    color: '#0d141c',
    letterSpacing: '0.025em',
    fontSize: '28px',
    fontWeight: 700,
    lineHeight: 1.25,
    padding: '1.25rem 1rem 0.75rem',
    textAlign: 'center',
    margin: 0,
  },
  paragraph: {
    color: '#0d141c',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    padding: '0.25rem 1rem 0.75rem',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    padding: '0.75rem 1rem',
    justifyContent: 'center',
  },
  demoButton: {
    display: 'flex',
    minWidth: '84px',
    maxWidth: '480px',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: '0.5rem',
    height: '3rem',
    padding: '0 1.25rem',
    backgroundColor: '#0d80f2',
    color: '#f8fafc',
    fontSize: '1rem',
    fontWeight: 700,
    lineHeight: 1.5,
    letterSpacing: '0.015em',
    border: 'none',
    ':hover': {
        opacity: 0.9
    }
  },
  buttonText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

export default HeroPage;