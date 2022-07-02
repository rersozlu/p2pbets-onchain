import styles from "./App.module.css";
import { Web3Context } from "./contexts/Web3Context";
import { BetsContext } from "./contexts/BetsContext";
import Navbar from "./components/Navbar";
import PopupBet from "./components/PopupBet";
import { useContext } from "react";

function App() {
  const [betsData, setBetsData] = useContext(BetsContext);
  return (
    <div className={styles.App}>
      <Navbar />
      {betsData && <PopupBet betObject={betsData[0]} />}
    </div>
  );
}

export default App;
