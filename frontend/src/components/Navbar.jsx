import styles from "./Navbar.module.css";
import logo from "../assets/images/navLogo.png";
import { ethers } from "ethers";
import { Web3Context } from "../contexts/Web3Context";
import { useContext, useEffect } from "react";

function Navbar() {
  const [web3Data, setWeb3Data] = useContext(Web3Context);

  async function connectWallet() {
    
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setWeb3Data((prevData) => ({
          ...prevData,
          provider: provider,
          signer: signer,
        }));
      } else {
        alert("please install metamask");
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setWeb3Data((prevData) => ({
        ...prevData,
        provider: provider,
        signer: signer,
      }));
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div className={styles.Nav}>
      <img src={logo} alt="site-logo" />
      <h2>Home of Decentralized Peer to Peer Bets</h2>
      <button onClick={connectWallet}>
        {web3Data.signer ? "Connected" : "Connect Wallet"}
      </button>
    </div>
  );
}

export default Navbar;
