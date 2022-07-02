import styles from "./App.module.css";
import { BetsContext, BetsContextProvider } from "./contexts/BetsContext";
import { Web3ContextProvider } from "./contexts/Web3Context";
import Navbar from "./components/Navbar";
import PopupBet from "./components/PopupBet";
import { useContext } from "react";

function App() {
  return (
    <Web3ContextProvider>
      <BetsContextProvider>
        <div className={styles.App}>
          <Navbar />
          <PopupBet />
        </div>
      </BetsContextProvider>
    </Web3ContextProvider>
  );
}

export default App;
