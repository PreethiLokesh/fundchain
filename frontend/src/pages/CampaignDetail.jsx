import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlockchain } from "../context/BlockchainContext";
import { ethers } from "ethers";

function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { campaigns, account, donate, withdraw, contract, loadCampaigns } = useBlockchain();
  const [donateAmount, setDonateAmount] = useState("");
  const [donating, setDonating] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    if (contract) loadCampaigns(contract);
  }, [contract]);

  const campaign = campaigns[parseInt(id)];

  if (!campaign) {
    return (
      <div style={{ textAlign: "center", padding: "80px", color: "#64748b" }}>
        <p style={{ fontSize: "18px" }}>Campaign not found.</p>
        <button onClick={() => navigate("/campaigns")} style={primaryBtnStyle}>
          Back to Campaigns
        </button>
      </div>
    );
  }

  const goal = Number(ethers.formatEther(campaign.goal));
  const raised = Number(ethers.formatEther(campaign.amountRaised));
  const percent = Math.min((raised / goal) * 100, 100).toFixed(0);
  const deadline = new Date(Number(campaign.deadline) * 1000);
  const daysLeft = Math.max(0, Math.ceil((deadline - Date.now()) / (1000 * 60 * 60 * 24)));
  const isOwner = account && campaign.owner.toLowerCase() === account.toLowerCase();
  const isGoalReached = raised >= goal;
  const isExpired = Date.now() > deadline.getTime();

  async function handleDonate() {
    if (!donateAmount || isNaN(donateAmount) || Number(donateAmount) <= 0) {
      return alert("Enter a valid amount!");
    }
    setDonating(true);
    const success = await donate(parseInt(id), donateAmount);
    setDonating(false);
    if (success) {
      alert("Donated successfully!");
      setDonateAmount("");
    }
  }

  async function handleWithdraw() {
    setWithdrawing(true);
    await withdraw(parseInt(id));
    setWithdrawing(false);
  }

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        <button onClick={() => navigate("/campaigns")} style={backBtnStyle}>
          ← Back to Campaigns
        </button>

        <div style={layoutStyle}>

          {/* Left — campaign info */}
          <div style={{ flex: 2 }}>
            <div style={cardStyle}>

              {/* Status bar */}
              <div style={{
                ...statusBarStyle,
                backgroundColor: isGoalReached ? "#22c55e" : "#2563eb"
              }} />

              <div style={{ padding: "28px" }}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
                  <span style={tagStyle}>Campaign #{parseInt(id) + 1}</span>
                  {isGoalReached && <span style={successTagStyle}>Goal Reached!</span>}
                  {isExpired && !isGoalReached && <span style={expiredTagStyle}>Expired</span>}
                  {!isExpired && !isGoalReached && (
                    <span style={activeTagStyle}>{daysLeft} days left</span>
                  )}
                </div>

                <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1e293b", marginBottom: "12px" }}>
                  {campaign.title}
                </h1>

                <p style={{ fontSize: "15px", color: "#475569", lineHeight: "1.8", marginBottom: "24px" }}>
                  {campaign.description}
                </p>

                {/* Progress */}
                <div style={progressBgStyle}>
                  <div style={{
                    ...progressFillStyle,
                    width: `${percent}%`,
                    backgroundColor: isGoalReached ? "#22c55e" : "#2563eb"
                  }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", marginBottom: "24px" }}>
                  <div>
                    <div style={{ fontSize: "24px", fontWeight: "800", color: "#1e293b" }}>{raised} ETH</div>
                    <div style={{ fontSize: "13px", color: "#64748b" }}>raised of {goal} ETH goal</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "24px", fontWeight: "800", color: "#2563eb" }}>{percent}%</div>
                    <div style={{ fontSize: "13px", color: "#64748b" }}>funded</div>
                  </div>
                </div>

                {/* Stats row */}
                <div style={statsRowStyle}>
                  <div style={statItemStyle}>
                    <div style={statValueStyle}>{goal} ETH</div>
                    <div style={statLabelStyle}>Goal</div>
                  </div>
                  <div style={statItemStyle}>
                    <div style={statValueStyle}>{daysLeft}</div>
                    <div style={statLabelStyle}>Days Left</div>
                  </div>
                  <div style={statItemStyle}>
                    <div style={statValueStyle}>{deadline.toLocaleDateString()}</div>
                    <div style={statLabelStyle}>Deadline</div>
                  </div>
                </div>

                {/* Owner */}
                <div style={ownerBoxStyle}>
                  <div style={avatarStyle}>{campaign.owner.slice(2, 4).toUpperCase()}</div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>Campaign Owner</div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
                      {campaign.owner.slice(0, 10)}...{campaign.owner.slice(-6)}
                    </div>
                  </div>
                  {isOwner && (
                    <span style={youStyle}>You</span>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Right — actions */}
          <div style={{ flex: 1 }}>

            {/* Donate card */}
            <div style={actionCardStyle}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>
                Support this Campaign
              </h3>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Amount (ETH)</label>
                <input
                  type="number"
                  placeholder="0.1"
                  value={donateAmount}
                  onChange={e => setDonateAmount(e.target.value)}
                  style={inputStyle}
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Quick amounts */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                {["0.1", "0.5", "1", "2"].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setDonateAmount(amt)}
                    style={quickAmtStyle}
                  >
                    {amt} ETH
                  </button>
                ))}
              </div>

              <button
                onClick={handleDonate}
                disabled={donating || isExpired}
                style={{
                  ...donateBtnStyle,
                  opacity: donating || isExpired ? 0.6 : 1,
                  cursor: donating || isExpired ? "not-allowed" : "pointer"
                }}
              >
                {donating ? "Processing..." : isExpired ? "Campaign Ended" : "Donate Now"}
              </button>

              {isExpired && !isGoalReached && (
                <p style={{ fontSize: "12px", color: "#64748b", marginTop: "10px", textAlign: "center" }}>
                  This campaign has ended. Goal was not reached.
                </p>
              )}
            </div>

            {/* Withdraw card — only for owner */}
            {isOwner && (
              <div style={withdrawCardStyle}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
                  Withdraw Funds
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
                  {isGoalReached
                    ? "Your goal is reached! You can withdraw now."
                    : "You can withdraw only after goal is reached."}
                </p>
                <button
                  onClick={handleWithdraw}
                  disabled={withdrawing || !isGoalReached || campaign.withdrawn}
                  style={{
                    ...withdrawBtnStyle,
                    opacity: withdrawing || !isGoalReached || campaign.withdrawn ? 0.5 : 1,
                    cursor: withdrawing || !isGoalReached || campaign.withdrawn ? "not-allowed" : "pointer"
                  }}
                >
                  {campaign.withdrawn
                    ? "Already Withdrawn"
                    : withdrawing
                    ? "Processing..."
                    : "Withdraw Funds"}
                </button>
              </div>
            )}

            {/* Blockchain info */}
            <div style={infoCardStyle}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>
                Blockchain Info
              </h3>
              {[
                { label: "Network", value: "Hardhat Local" },
                { label: "Contract", value: "0x5FbDB...80aa3" },
                { label: "Chain ID", value: "31337" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{item.label}</span>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#1e293b" }}>{item.value}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

const primaryBtnStyle = {
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "600",
  marginTop: "16px"
};

const backBtnStyle = {
  backgroundColor: "transparent",
  border: "none",
  color: "#64748b",
  cursor: "pointer",
  fontSize: "14px",
  padding: "0",
  marginBottom: "24px",
  display: "block"
};

const layoutStyle = {
  display: "flex",
  gap: "24px",
  alignItems: "flex-start",
  flexWrap: "wrap"
};

const cardStyle = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  overflow: "hidden",
  marginBottom: "24px"
};

const statusBarStyle = {
  height: "6px",
  width: "100%"
};

const tagStyle = {
  fontSize: "12px",
  color: "#2563eb",
  fontWeight: "600",
  backgroundColor: "#eff6ff",
  padding: "4px 10px",
  borderRadius: "20px"
};

const successTagStyle = {
  fontSize: "12px",
  color: "#166534",
  fontWeight: "600",
  backgroundColor: "#f0fdf4",
  padding: "4px 10px",
  borderRadius: "20px"
};

const expiredTagStyle = {
  fontSize: "12px",
  color: "#991b1b",
  fontWeight: "600",
  backgroundColor: "#fef2f2",
  padding: "4px 10px",
  borderRadius: "20px"
};

const activeTagStyle = {
  fontSize: "12px",
  color: "#92400e",
  fontWeight: "600",
  backgroundColor: "#fffbeb",
  padding: "4px 10px",
  borderRadius: "20px"
};

const progressBgStyle = {
  backgroundColor: "#e2e8f0",
  borderRadius: "6px",
  height: "12px",
  overflow: "hidden"
};

const progressFillStyle = {
  height: "100%",
  borderRadius: "6px",
  transition: "width 0.3s"
};

const statsRowStyle = {
  display: "flex",
  gap: "16px",
  backgroundColor: "#f8fafc",
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "20px"
};

const statItemStyle = {
  flex: 1,
  textAlign: "center"
};

const statValueStyle = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#1e293b"
};

const statLabelStyle = {
  fontSize: "12px",
  color: "#64748b",
  marginTop: "4px"
};

const ownerBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  backgroundColor: "#f8fafc",
  borderRadius: "10px",
  padding: "12px 16px"
};

const avatarStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  backgroundColor: "#dbeafe",
  color: "#1d4ed8",
  fontSize: "12px",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const youStyle = {
  marginLeft: "auto",
  fontSize: "12px",
  fontWeight: "600",
  backgroundColor: "#dbeafe",
  color: "#1d4ed8",
  padding: "4px 10px",
  borderRadius: "20px"
};

const actionCardStyle = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "24px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  marginBottom: "16px"
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#374151",
  marginBottom: "8px"
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  boxSizing: "border-box",
  outline: "none"
};

const quickAmtStyle = {
  backgroundColor: "#f1f5f9",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  padding: "6px 12px",
  fontSize: "12px",
  cursor: "pointer",
  fontWeight: "600",
  color: "#475569"
};

const donateBtnStyle = {
  width: "100%",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer"
};

const withdrawCardStyle = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "20px",
  border: "1px solid #e2e8f0",
  marginBottom: "16px"
};

const withdrawBtnStyle = {
  width: "100%",
  backgroundColor: "#16a34a",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer"
};

const infoCardStyle = {
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  padding: "20px",
  border: "1px solid #e2e8f0"
};

export default CampaignDetail;