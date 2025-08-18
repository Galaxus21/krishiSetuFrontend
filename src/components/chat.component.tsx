// import { Input, Button, type MenuProps } from "antd";
import { css, StyleSheet } from "aphrodite";
// import { useTranslation } from "react-i18next";
// import { useSpeechToText } from "../hooks/useSpeechRecognition";
import { useState, useEffect } from "react";
// import { AudioOutlined } from "@ant-design/icons";
import { useLocation } from "../hooks/useLocation";
import type { MenuProps } from "antd";
import AssistantMenu from "./chatSubComponents/assistantMenu.component";
import { CropRecommender, DiseaseDetector, GeneralQuery, GovtSchemeAdvisor } from "./chatSubComponents/assistants.component";


const AIChatComponent = () => {

  // const { t } = useTranslation();
  useLocation();
  
  const items = [
    { key: 'generalQuery', label: 'General Query' },
    { key: 'diseaseDetector', label: 'Detect Disease' },
    { key: 'cropRecommender', label: 'Crop Recommendation' },
    { key: 'govtScheme', label: 'Govt Scheme Advisor'}
  ] as const;

  type MenuStates = typeof items[number]['key']

  const [menuState, setMenuState] = useState<MenuStates>('generalQuery')


  const handleMenuChange:  MenuProps['onClick'] = (e) => {
    setMenuState(e.key as MenuStates);
  }

  function menuComponent() {
    switch(menuState) {
      case 'generalQuery':
        return <GeneralQuery />
      case 'cropRecommender':
        return <CropRecommender />
      case 'diseaseDetector':
        return <DiseaseDetector />
      case 'govtScheme':
        return <GovtSchemeAdvisor />
    }
  }

  return (
    <div className={css(styles.container)}>
      <AssistantMenu items={items} onClick={handleMenuChange} menuState={menuState}/>
      {menuComponent()}
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    flexDirection:'column',
  },
})

export default AIChatComponent;
