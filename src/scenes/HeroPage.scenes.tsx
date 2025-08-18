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

  const { t } = useTranslation();

  return (<RootContainer>
    <div className={css(styles.buttonDiv)}>
      <Button type={`${state==='mandi'?'primary':'default'}`} onClick={()=>setState('mandi')}>{t('mandi')}</Button>
      <Button type={`${state==='assistant'?'primary':'default'}`} onClick={()=>setState('assistant')}>{t("farmersAssistance")}</Button>
    </div>
    {state==='assistant' ? <AIChatComponent /> : <Mandi />}
  </RootContainer>);
};

const styles = StyleSheet.create({
  buttonDiv: {
    display:'flex',
    justifyContent:'space-around',
    padding:'1rem'
  }
});

export default HeroPage;