import { useState } from "react";
import { ethers } from "ethers";
import poolAbi from "./contracts/BetPoolFactory.json"
function App() {
  const [web3Data, setWeb3Data] = useState({});
  const [userData, setUserData] = useState({});
  const [allPools, setAllPools] = useState([])
  //admin page is only accesible via localhost, not deployed yet!
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

    async function deployNewBet() {
      const factoryContract = new ethers.Contract("0x7BAf7630E74851a80c60aC160e5327815953fb5b", poolAbi.abi, web3Data.signer);
      const newPool = await factoryContract.createNewBetPool(userData.timeDifference)
      await newPool.wait()
      return newPool.address
    }

  async function getAllData() {
    try{
      const allPools = await fetch("https://p2pbets-api.vercel.app/bets");
      const json = await allPools.json()
      setAllPools(json)
    }catch(e){
      console.log(e)
    }
  }

  async function getNewId() {
    const myBets = await fetch("https://p2pbets-api.vercel.app/bets");
    const json = await myBets.json();
    return json.length;
  }
  function handleChange(e) {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function updateData() {
      fetch(`https://p2pbets-api.vercel.app/bets/${userData.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: userData.isClosed === "y" ? true : false,
          winner: userData.winner,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          password: userData.password,
        },
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
  }

  async function deleteData() {
      fetch(`https://p2pbets-api.vercel.app/bets/${userData.id}`, {
        method: "DELETE",
        headers: {
          password: userData.password,
        },
      })
        .then((res) => res.json())
        .then((json) => console.log(json));
  }

  async function postData() {
      let newId = await getNewId();
      const newAddress = await deployNewBet()
      newId += 1;
      fetch(`https://p2pbets-api.vercel.app/bets`, {
        method: "POST",
        body: JSON.stringify({
          id: newId,
          contractAddress: newAddress,
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
          password: userData.password,
        },
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
  }

  function dateToUnix(date){
    const dateArray = date.split("-")
    const currentTime = Math.floor(Date.now() / 1000)
    const unix = new Date(dateArray[1] != 0 ? dateArray[0] : dateArray[0] - 1, dateArray[1] != 0 ? dateArray[1] - 1 : "12", dateArray[2]).getTime()
    setUserData(prev => ({...prev, timeDifference: (unix / 1000) - currentTime}))
    return unix / 1000
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
      <input type="date" value={userData.contractDate} onChange={(e) => setUserData(prev => ({...prev, [e.target.name] : dateToUnix(e.target.value.toString())}))} name="contractDate" />
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
      <p>Date to View</p>
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
      <p>Admin Pass</p>
      <input
        name="password"
        type="password"
        value={userData.password}
        onChange={handleChange}
      />

      <button onClick={updateData}>Update!</button>

      <button onClick={deleteData}>Delete!</button>

      <button onClick={postData}>Post new bet</button>

      {allPools.length > 0 && allPools.map((item,index) => {
        return (<div className="bet">
          <p>ID: {item.id}</p>
          <p>Cont. Address: {item.contractAddress}</p>
          <p>Team A: {item.teamA}</p>
          <p>Team B: {item.teamB}</p>
          <p>Date: {item.date}</p>
          <p>Status: {!item.status ? "open" : "closed"}</p>
          <p>Winner: {item.winner}</p>
          <br/>
        </div>)
      })}
    </div>
  );
}

export default App;
