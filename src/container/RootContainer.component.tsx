import { ConfigProvider } from "antd"
import { css, StyleSheet } from "aphrodite"

export default function RootContainer({children}: {children: React.ReactNode}) {
  return <div className={css(styles.rootContainer)}>
    <ConfigProvider theme={{
            token:{
                colorPrimary: '#4e7b28ff',
                colorBgContainer: '#eeeeee',
            }
    }}>
        {children}
    </ConfigProvider>
  </div>
}

const styles = StyleSheet.create({
  rootContainer: {
    width: '100%',
    minWidth: '650px',
    height: '100vh',
    padding: '1rem 0',
    backgroundColor: '#f8fafc',
    overflowX: 'hidden',
  }
})
