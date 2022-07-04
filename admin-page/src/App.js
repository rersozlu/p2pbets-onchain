import { useState } from "react";
import { ethers } from "ethers";
function App() {
  const [web3Data, setWeb3Data] = useState({});
  const [userData, setUserData] = useState({});
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

  async function getAllData() {
    if (
      window.ethereum.selectedAddress == process.env.REACT_APP_ADMIN_ADDRESS
    ) {
      fetch("http://localhost:5000/bets")
        .then((resp) => resp.json())
        .then((json) => console.log(json));
    }
  }

  async function getNewId() {
    const myBets = await fetch("http://localhost:5000/bets");
    const json = await myBets.json();
    return json.length;
  }
  getNewId();
  function handleChange(e) {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function updateData() {
    if (
      window.ethereum.selectedAddress == process.env.REACT_APP_ADMIN_ADDRESS
    ) {
      fetch(`http://localhost:5000/bets/${userData.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: userData.isClosed == "y" ? true : false,
          winner: userData.winner,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    }
  }

  async function deleteData() {
    if (
      window.ethereum.selectedAddress == process.env.REACT_APP_ADMIN_ADDRESS
    ) {
      fetch(`http://localhost:5000/bets/${userData.id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((json) => console.log(json));
    }
  }

  async function postData() {
    if (
      window.ethereum.selectedAddress == process.env.REACT_APP_ADMIN_ADDRESS
    ) {
      const newId = await getNewId();
      fetch(`http://localhost:5000/bets/`, {
        method: "POST",
        body: JSON.stringify({
          id: newId,
          contractAddress: userData.address,
          teamA: userData.nameA,
          teamB: userData.nameB,
          teamALogo: userData.imgA,
          teamBLogo: userData.imgB,
          date: userData.date,
          category: userData.category,
          status: false,
          winner: "none",
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    }
  }

  return (
    <div className="App">
      <button onClick={connectWallet}>Connect wallet</button>
      <button onClick={getAllData}>Get all bets to console</button>
      <h1>Update or Delete Bet</h1>
      <p>ID</p>
      <input
        name="id"
        type="text"
        value={userData.id}
        onChange={handleChange}
      />
      <p>Bets Closed?</p>
      <input
        name="isClosed"
        type="text"
        placeholder="y or n"
        value={userData.isClosed}
        onChange={handleChange}
        defaultValue="n"
      />
      <p>Winner?</p>
      <input
        name="winner"
        type="text"
        placeholder="a or b"
        value={userData.winner}
        onChange={handleChange}
        defaultValue="none"
      />
      <p>Team A Name</p>
      <input
        name="nameA"
        type="text"
        value={userData.nameA}
        onChange={handleChange}
      />
      <p>Team B Name</p>
      <input
        name="nameB"
        type="text"
        value={userData.nameB}
        onChange={handleChange}
      />
      <p>Team A Image</p>
      <input
        name="imgA"
        type="text"
        value={userData.imgA}
        onChange={handleChange}
      />
      <p>Team B Image</p>
      <input
        name="imgB"
        type="text"
        value={userData.imgB}
        onChange={handleChange}
      />
      <p>Date</p>
      <input
        name="date"
        type="text"
        value={userData.date}
        onChange={handleChange}
        placeholder="02.30 TSI,July 03 2022"
      />
      <p>Category</p>
      <input
        name="category"
        type="text"
        value={userData.category}
        onChange={handleChange}
        placeholder="nba / soccer / mma etc."
      />
      <p>Address</p>
      <input
        name="address"
        type="text"
        value={userData.address}
        onChange={handleChange}
        placeholder="nba / soccer / mma etc."
      />

      <button onClick={updateData}>Update!</button>

      <button onClick={deleteData}>Delete!</button>

      <button onClick={postData}>Post new bet</button>
    </div>
  );
}

export default App;
