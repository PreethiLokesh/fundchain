import { createContext, useContext, useState } from "react";
import { ethers } from "ethers";
import CrowdFundingABI from "../CrowdFunding.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const BlockchainContext = createContext();

export function BlockchainProvider({ children }) {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  async function connectWallet() {
    try {
      if (!window.ethereum) return alert("Install MetaMask!");
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const _account = accounts[0];
      const _provider = new ethers.BrowserProvider(window.ethereum, "any");
      const _signer = await _provider.getSigner();
      const _contract = new ethers.Contract(CONTRACT_ADDRESS, CrowdFundingABI.abi, _signer);
      setContract(_contract);
      setAccount(_account);
      setLoading(true);
      const data = await _contract.getCampaigns();
      setCampaigns(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Connection failed: " + err.message);
    }
  }

  async function loadCampaigns(_contract) {
    try {
      setLoading(true);
      const c = _contract || contract;
      if (!c) return;
      const data = await c.getCampaigns();
      setCampaigns(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createCampaign(title, description, goal, days) {
    if (!contract) return alert("Connect wallet first!");
    try {
      const goalWei = ethers.parseEther(goal);
      const tx = await contract.createCampaign(title, description, goalWei, parseInt(days));
      await tx.wait();
      const data = await contract.getCampaigns();
      setCampaigns(data);
      return true;
    } catch (err) {
      alert("Error: " + err.message);
      return false;
    }
  }

  async function donate(id, amount) {
    if (!contract) return alert("Connect wallet first!");
    try {
      const tx = await contract.donate(id, { value: ethers.parseEther(amount) });
      await tx.wait();
      const data = await contract.getCampaigns();
      setCampaigns(data);
      return true;
    } catch (err) {
      alert("Error: " + err.message);
      return false;
    }
  }

  async function withdraw(id) {
  if (!contract) return alert("Connect wallet first!");
  try {
    const tx = await contract.withdraw(id);
    await tx.wait();
    alert("Withdrawn successfully! Funds sent to your wallet.");
    try {
      const data = await contract.getCampaigns();
      setCampaigns(data);
    } catch (e) {
      console.log("Reload skipped");
    }
    return true;
  } catch (err) {
    if (err.message.includes("Goal not reached")) alert("Goal not reached yet!");
    else if (err.message.includes("Already withdrawn")) alert("Already withdrawn!");
    else alert("Error: " + err.message);
    return false;
  }
}

  return (
    <BlockchainContext.Provider value={{
      contract, account, campaigns, loading,
      connectWallet, loadCampaigns, createCampaign, donate, withdraw
    }}>
      {children}
    </BlockchainContext.Provider>
  );
}

export function useBlockchain() {
  return useContext(BlockchainContext);
}