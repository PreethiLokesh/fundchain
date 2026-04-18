import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBlockchain } from "../context/BlockchainContext";
import { ethers } from "ethers";

function Home() {
  const { campaigns, connectWallet, account, loadCampaigns, contract } = useBlockchain();
  const navigate = useNavigate();

  useEffect(() => {
    if (contract) loadCampaigns(contract);
  }, [contract]);

  const totalRaised = campaigns.reduce((acc, c) => acc + Number(ethers.formatEther(c.amountRaised)), 0);

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={heroStyle}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div style={badgeStyle}>Powered by Blockchain</div>
          <h1 style={heroTitleStyle}>
            Fund Ideas That <span style={{ color: "#2563eb" }}>Matter</span>
          </h1>
          <p style={heroSubStyle}>
            A decentralized crowdfunding platform where every transaction is
            transparent, trustless, and secured by smart contracts.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/campaigns")} style={primaryBtnStyle}>
              Explore Campaigns
            </button>
            {account ? (
              <button onClick={() => navigate("/create")} style={secondaryBtnStyle}>
                Start a Campaign
              </button>
            ) : (
              <button onClick={connectWallet} style={secondaryBtnStyle}>
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={statsRowStyle}>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{campaigns.length}</div>
          <div style={statLabelStyle}>Total Campaigns</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{totalRaised.toFixed(2)} ETH</div>
          <div style={statLabelStyle}>Total Raised</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>100%</div>
          <div style={statLabelStyle}>Transparent</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>0%</div>
          <div style={statLabelStyle}>Platform Fee</div>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b" }}>Recent Campaigns</h2>
          <button onClick={() => navigate("/campaigns")} style={viewAllStyle}>
            View all →
          </button>
        </div>

        {campaigns.length === 0 ? (
          <div style={emptySyle}>
            <p style={{ fontSize: "18px", color: "#64748b" }}>No campaigns yet.</p>
            <button onClick={() => navigate("/create")} style={primaryBtnStyle}>
              Create First Campaign
            </button>
          </div>
        ) : (
          <div style={gridStyle}>
            {campaigns.slice(0, 3).map((c, i) => {
              const goal = Number(ethers.formatEther(c.goal));
              const raised = Number(ethers.formatEther(c.amountRaised));
              const percent = Math.min((raised / goal) * 100, 100).toFixed(0);
              const deadline = new Date(Number(c.deadline) * 1000);
              const daysLeft = Math.max(0, Math.ceil((deadline - Date.now()) / (1000 * 60 * 60 * 24)));

              return (
                <div key={i} style={campaignCardStyle} onClick={() => navigate(`/campaign/${i}`)}>
                  <div style={cardHeaderStyle}>
                    <span style={categoryStyle}>Campaign #{i + 1}</span>
                    <span style={daysStyle}>{daysLeft} days left</span>
                  </div>
                  <h3 style={cardTitleStyle}>{c.title}</h3>
                  <p style={cardDescStyle}>{c.description.slice(0, 80)}...</p>
                  <div style={progressBarBgStyle}>
                    <div style={{ ...progressBarFillStyle, width: `${percent}%` }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                    <span style={raisedStyle}>{raised} ETH raised</span>
                    <span style={percentStyle}>{percent}%</span>
                  </div>
                  <div style={goalStyle}>Goal: {goal} ETH</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* How it works */}
      <div style={howStyle}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px" }}>
          <h2 style={{ textAlign: "center", fontSize: "24px", fontWeight: "700", color: "#1e293b", marginBottom: "40px" }}>
            How It Works
          </h2>
          <div style={stepsStyle}>
            {[
              { step: "01", title: "Connect Wallet", desc: "Connect your crypto wallet to get started on the platform." },
              { step: "02", title: "Create Campaign", desc: "Set your goal, deadline and description for your campaign." },
              { step: "03", title: "Receive Funds", desc: "Supporters donate ETH directly to your smart contract." },
              { step: "04", title: "Withdraw", desc: "Withdraw funds instantly when your goal is reached." },
            ].map((item, i) => (
              <div key={i} style={stepCardStyle}>
                <div style={stepNumberStyle}>{item.step}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", marginBottom: "8px" }}>{item.title}</h3>
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

const heroStyle = {
  background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
  padding: "80px 20px",
  textAlign: "center"
};

const badgeStyle = {
  display: "inline-block",
  backgroundColor: "#dbeafe",
  color: "#1d4ed8",
  padding: "6px 16px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "600",
  marginBottom: "20px"
};

const heroTitleStyle = {
  fontSize: "48px",
  fontWeight: "800",
  color: "#1e293b",
  marginBottom: "20px",
  lineHeight: "1.2"
};

const heroSubStyle = {
  fontSize: "18px",
  color: "#475569",
  marginBottom: "36px",
  lineHeight: "1.7"
};

const primaryBtnStyle = {
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "14px 28px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "600"
};

const secondaryBtnStyle = {
  backgroundColor: "white",
  color: "#2563eb",
  border: "2px solid #2563eb",
  padding: "14px 28px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "600"
};

const statsRowStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "24px",
  padding: "40px 20px",
  flexWrap: "wrap",
  backgroundColor: "#fff",
  borderBottom: "1px solid #e2e8f0"
};

const statCardStyle = {
  textAlign: "center",
  padding: "20px 40px"
};

const statNumberStyle = {
  fontSize: "32px",
  fontWeight: "800",
  color: "#2563eb"
};

const statLabelStyle = {
  fontSize: "14px",
  color: "#64748b",
  marginTop: "4px"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "24px"
};

const campaignCardStyle = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "24px",
  border: "1px solid #e2e8f0",
  cursor: "pointer",
  transition: "transform 0.2s",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
};

const cardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "12px"
};

const categoryStyle = {
  fontSize: "12px",
  color: "#2563eb",
  fontWeight: "600",
  backgroundColor: "#eff6ff",
  padding: "4px 10px",
  borderRadius: "20px"
};

const daysStyle = {
  fontSize: "12px",
  color: "#64748b"
};

const cardTitleStyle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#1e293b",
  marginBottom: "8px"
};

const cardDescStyle = {
  fontSize: "14px",
  color: "#64748b",
  marginBottom: "16px",
  lineHeight: "1.6"
};

const progressBarBgStyle = {
  backgroundColor: "#e2e8f0",
  borderRadius: "4px",
  height: "8px",
  overflow: "hidden"
};

const progressBarFillStyle = {
  backgroundColor: "#2563eb",
  height: "100%",
  borderRadius: "4px",
  transition: "width 0.3s"
};

const raisedStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#1e293b"
};

const percentStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#2563eb"
};

const goalStyle = {
  fontSize: "13px",
  color: "#64748b",
  marginTop: "4px"
};

const viewAllStyle = {
  backgroundColor: "transparent",
  border: "none",
  color: "#2563eb",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600"
};

const emptySyle = {
  textAlign: "center",
  padding: "60px 0",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px"
};

const howStyle = {
  backgroundColor: "#f8fafc",
  padding: "60px 0",
  borderTop: "1px solid #e2e8f0"
};

const stepsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "24px"
};

const stepCardStyle = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "24px",
  border: "1px solid #e2e8f0",
  textAlign: "center"
};

const stepNumberStyle = {
  fontSize: "28px",
  fontWeight: "800",
  color: "#92bdf7",
  marginBottom: "12px"
};

export default Home;