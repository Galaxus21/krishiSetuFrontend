import { css, StyleSheet } from "aphrodite";
import { Menu, type MenuProps } from 'antd';

// type MenuItem = Required<MenuProps>['items'][number];

export default function AssistantMenu({onClick, items, menuState}:{onClick: MenuProps['onClick'], items: any, menuState: string}){

    return <Menu
                onClick={onClick}
                mode="horizontal"
                items={items}
                selectedKeys={[menuState]}
                className={css(styles.main)}
            />
};
  
const styles = StyleSheet.create({
    main: {
        alignContent: 'center',
        justifyContent: 'center',
        color: 'black',
        background: 'white',
        fontSize:'15px',
        borderRadius:'20px',
        padding:'8px',
        // fontWeight:'bold',
        margin: '0px 0 40px 0px',
        width:'100%'

    },
})