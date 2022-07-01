import styles from "./App.module.css";
import { Web3ContextProvider } from "./contexts/Web3Context";
import Navbar from "./components/Navbar";
import Featured from "./components/Featured";

function App() {
  return (
    <Web3ContextProvider>
      <div className={styles.App}>
        <Navbar />
        <Featured />
      </div>
    </Web3ContextProvider>
  );
}

export default App;
