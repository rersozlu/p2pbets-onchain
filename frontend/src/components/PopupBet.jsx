import styles from "./PopupBet.module.css";
import { useContext, useEffect, useState } from "react";
import { BetsContext } from "../contexts/BetsContext";
import { Web3Context } from "../contexts/Web3Context";
import { ethers } from "ethers";
function PopupBet({ cardData, closePopup }) {
  const [web3Data, setWeb3Data] = useContext(Web3Context);
  const [betsData, setBetsData] = useContext(BetsContext);
  const [betData, setBetData] = useState({});
  const [userSelection, setUserSelection] = useState({});

  function changeRatio(num) {
    const ratioString = num.toString();
    return (num / 1000).toString();
  }

  async function claimReward(reward) {
    try {
      if (window.ethereum.isConnected()) {
        const betContract = new ethers.Contract(
          betsData[cardData].contractAddress,
          betsData[cardData].abi,
          web3Data.signer
        );
        if (reward === "a") {
          const betTxn = await betContract.claimRewardA();
          await betTxn.wait();
          window.location.reload();
        }
        if (reward === "b") {
          const betTxn = await betContract.claimRewardB();
          await betTxn.wait();
          window.location.reload();
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function placeBet() {
    try {
      if (window.ethereum.isConnected()) {
        const betContract = new ethers.Contract(
          betsData[cardData].contractAddress,
          betsData[cardData].abi,
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
          betsData[cardData].contractAddress,
          betsData[cardData].abi,
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
          <p onClick={closePopup} className={styles.closeBtn}>
            Close
          </p>
          <p className={styles.date}>{betsData[cardData].date}</p>
          <div className={styles.info}>
            <div className={styles.teamA}>
              <img src={betsData[cardData].teamALogo} alt="teamALogo" />
              <p>{betsData[cardData].teamA}</p>
              <p>{betData.optionARatio}</p>
            </div>
            <div className={styles.teamB}>
              <img src={betsData[cardData].teamBLogo} alt="teamBLogo" />
              <p>{betsData[cardData].teamB}</p>
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
              <option value="optionA">{betsData[cardData].teamA}</option>
              <option value="optionB">{betsData[cardData].teamB}</option>
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
            <div className={styles.buttons}>
              <button className={styles.sendBtn} onClick={placeBet}>
                BET
              </button>
              <button
                className={
                  betsData[cardData].status ? styles.sendBtn : styles.grayBtn
                }
                onClick={() => {
                  claimReward(betsData[cardData].winner);
                }}
              >
                CLAIM
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PopupBet;
