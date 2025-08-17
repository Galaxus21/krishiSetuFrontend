import { StyleSheet, css } from 'aphrodite';
import KrishiSetuLogo from '../assets/logo.png';
import { Dropdown } from 'antd';
import { Button } from 'antd'; // Import Button from antd
import { useTranslation } from 'react-i18next';
import type { MenuProps } from 'antd';




const langMenuItems = [
  {key: 'en', label: 'English'},
  {key: 'hi', label: 'हिंदी'},
  {key: 'pn', label: 'ਪੰਜਾਬੀ'},
  {key: 'mr', label: 'मराठी'},
  {key: 'te', label: 'తెలుగు'},
  {key: 'kn', label: 'ಕನ್ನಡ'},
]

const Header = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange: MenuProps['onClick'] = ({ key }) => {
    i18n.changeLanguage(key);
  };

  return (
    <div className={css(styles.header)}>
        <div className={css(styles.logoContainer)}>
          <img src={KrishiSetuLogo} alt="AgriMitra Logo" className={css(styles.img)} />
        </div>
        <div>
          <Dropdown menu={{items: langMenuItems, onClick: handleLanguageChange}}>
            <Button>{t('language')}</Button>
          </Dropdown>
        </div>
    </div>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '70px',
    boxSizing: 'border-box',
    boxShadow: '0px 1px 10px #aaa',
    position: "sticky",
    background: 'white',
    top: "0px",
    zIndex: 100,
    padding: '1rem',
  },
  searchContainer: {},
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    // color: '#0d141c',
  },
  iconWrapper: {
    width: '1rem',
    height: '1rem',
  },
  img:{
    height: '40px',
    width: 'auto',
    objectFit: 'contain', // Corrected object-fit property
  },
});

export default Header;