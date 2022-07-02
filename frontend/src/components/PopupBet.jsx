import styles from "./PopupBet.module.css";
import { useContext, useEffect, useState } from "react";
import { BetsContext } from "../contexts/BetsContext";
import { Web3Context } from "../contexts/Web3Context";
import { ethers } from "ethers";
function PopupBet(props) {
  const [web3Data, setWeb3Data] = useContext(Web3Context);
  const [betsData, setBetsData] = useContext(BetsContext);
  const [betData, setBetData] = useState({});
  const [userSelection, setUserSelection] = useState({});

  function changeRatio(num) {
    const ratioString = num.toString();
    return ratioString[0] + "." + (num % 1000).toString();
  }

  async function placeBet() {
    try {
      if (window.ethereum.isConnected()) {
        const betContract = new ethers.Contract(
          betsData[0].contractAddress,
          betsData[0].abi,
          web3Data.signer
        );
        if (userSelection.selectedOption == "optionA") {
          const betTxn = await betContract.placeBetA({
            value: ethers.utils.parseEther(userSelection.amount),
          });
          await betTxn.wait();
          window.location.reload();
        }
        if (userSelection.selectedOption == "optionB") {
          const betTxn = await betContract.placeBetB({
            value: ethers.utils.parseEther(userSelection.amount),
          });
          await betTxn.wait();
          window.location.reload();
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function getBetData() {
    try {
      if (web3Data.viewProvider) {
        const betContract = new ethers.Contract(
          betsData[0].contractAddress,
          betsData[0].abi,
          web3Data.viewProvider
        );
        const optionARatio = await betContract.getRatioForA();
        const optionBRatio = await betContract.getRatioForB();
        setBetData((prev) => ({
          ...prev,
          optionARatio: changeRatio(optionARatio),
          optionBRatio: changeRatio(optionBRatio),
        }));

        if (
          userSelection.selectedOption == "optionA" ||
          userSelection.selectedOption == "optionB"
        ) {
          const possibleRatio = await betContract.getNewRatio(
            ethers.utils.parseEther(userSelection.amount),
            userSelection.selectedOption == "optionA" ? 1 : 2
          );
          setBetData((prev) => ({
            ...prev,
            possibleRatio: changeRatio(possibleRatio),
          }));
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getBetData();
  }, [web3Data, userSelection]);

  return (
    <div className={styles.Popup}>
      {betsData.length !== 0 && (
        <>
          <p className={styles.date}>{betsData[0].date}</p>
          <div className={styles.info}>
            <div className={styles.teamA}>
              <img src={betsData[0].teamALogo} alt="teamALogo" />
              <p>{betsData[0].teamA}</p>
              <p>{betData.optionARatio}</p>
            </div>
            <div className={styles.teamB}>
              <img src={betsData[0].teamBLogo} alt="teamBLogo" />
              <p>{betsData[0].teamB}</p>
              <p>{betData.optionBRatio}</p>
            </div>
          </div>
          <div className={styles.userInteract}>
            <select
              onChange={(e) => {
                setUserSelection((prev) => ({
                  ...prev,
                  selectedOption: e.target.value,
                }));
              }}
              name="options"
              id="options"
              className={styles.dropdown}
            >
              <option value="default">--Choose--</option>
              <option value="optionA">{betsData[0].teamA}</option>
              <option value="optionB">{betsData[0].teamB}</option>
            </select>
            <input
              className={styles.selection}
              type="number"
              onChange={(e) =>
                setUserSelection((prev) => ({
                  ...prev,
                  amount: e.target.value,
                }))
              }
              placeholder="Bet Amount (AVAX)"
            />
            {userSelection.selectedOption !== "default" && (
              <p className={styles.possibleratio}>
                Possible ratio of the bet after your play:{" "}
                {betData.possibleRatio == 0 ? "N/A" : betData.possibleRatio}
              </p>
            )}
            <button className={styles.sendBtn} onClick={placeBet}>
              BET
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PopupBet;
