import styles from "./PopupBet.module.css";
import { useContext } from "react";
import { Web3Context } from "../contexts/Web3Context";
import { ethers } from "ethers";
function PopupBet(props) {
  const [web3Data, setWeb3Data] = useContext(Web3Context);
  async function handleClick() {
    if (web3Data.signer) {
      const betContract = new ethers.Contract(
        props.betObject.contractAddress,
        props.betObject.abi,
        web3Data.signer
      );
      console.log(betContract);
    } else {
      alert("please connect your wallet");
    }
  }
  return (
    <div className={styles.Popup}>
      <button onClick={handleClick}>click</button>
    </div>
  );
}

export default PopupBet;
