import styles from "./App.module.css";
import { BetsContextProvider } from "./contexts/BetsContext";
import { Web3ContextProvider } from "./contexts/Web3Context";
import Navbar from "./components/Navbar";
import AllCards from "./components/AllCards";
import PopupBet from "./components/PopupBet";

import { useState, useContext } from "react";

function App() {
  const [selectedCard, setSelectedCard] = useState("");
  return (
    <Web3ContextProvider>
      <BetsContextProvider>
        <div className={styles.App}>
          <Navbar />
          <AllCards toggleFunction={setSelectedCard} isPopup={selectedCard} />

          {selectedCard > 0 && (
            <PopupBet
              closePopup={() => setSelectedCard("")}
              cardData={selectedCard - 1}
            />
          )}
        </div>
      </BetsContextProvider>
    </Web3ContextProvider>
  );
}

export default App;
