import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBlockchain } from "../context/BlockchainContext";
import { ethers } from "ethers";

function Campaigns() {
  const { campaigns, contract, loadCampaigns, loading } = useBlockchain();
  const navigate = useNavigate();

  useEffect(() => {
    if (contract) loadCampaigns(contract);
  }, [contract]);

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b", marginBottom: "8px" }}>
            All Campaigns
          </h1>
          <p style={{ color: "#64748b", fontSize: "16px" }}>
            Support projects you believe in — fully transparent on blockchain.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
            Loading campaigns...
          </div>
        )}

        {/* Empty */}
        {!loading && campaigns.length === 0 && (
          <div style={emptyStyle}>
            <p style={{ fontSize: "18px", color: "#64748b", marginBottom: "16px" }}>
              No campaigns yet. Be the first!
            </p>
            <button onClick={() => navigate("/create")} style={primaryBtnStyle}>
              Create Campaign
            </button>
          </div>
        )}

        {/* Grid */}
        <div style={gridStyle}>
          {campaigns.map((c, i) => {
            const goal = Number(ethers.formatEther(c.goal));
            const raised = Number(ethers.formatEther(c.amountRaised));
            const percent = Math.min((raised / goal) * 100, 100).toFixed(0);
            const deadline = new Date(Number(c.deadline) * 1000);
            const daysLeft = Math.max(0, Math.ceil((deadline - Date.now()) / (1000 * 60 * 60 * 24)));
            const isCompleted = raised >= goal;

            return (
              <div
                key={i}
                style={cardStyle}
                onClick={() => navigate(`/campaign/${i}`)}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                {/* Card top color bar */}
                <div style={{ ...colorBarStyle, backgroundColor: isCompleted ? "#22c55e" : "#2563eb" }} />

                <div style={{ padding: "20px" }}>
                  {/* Tags */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={tagStyle}>Campaign #{i + 1}</span>
                    <span style={{ ...statusStyle, backgroundColor: isCompleted ? "#f0fdf4" : "",  color: "#166534" }}>
                      {isCompleted ? "Goal Reached!" : `${daysLeft} days left`}
                    </span>
                  </div>

                  {/* Title & desc */}
                  <h3 style={titleStyle}>{c.title}</h3>
                  <p style={descStyle}>
                    {c.description.length > 90 ? c.description.slice(0, 90) + "..." : c.description}
                  </p>

                  {/* Progress */}
                  <div style={progressBgStyle}>
                    <div style={{
                      ...progressFillStyle,
                      width: `${percent}%`,
                      backgroundColor: isCompleted ? "#22c55e" : "#2563eb"
                    }} />
                  </div>

                  {/* Stats */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>{raised} ETH</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>raised of {goal} ETH</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "16px", fontWeight: "700", color: "#2563eb" }}>{percent}%</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>funded</div>
                    </div>
                  </div>

                  {/* Owner */}
                  <div style={ownerStyle}>
                    <div style={avatarStyle}>{c.owner.slice(2, 4).toUpperCase()}</div>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      {c.owner.slice(0, 6)}...{c.owner.slice(-4)}
                    </span>
                  </div>

                  <button style={viewBtnStyle}>View Campaign →</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "24px"
};

const cardStyle = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  overflow: "hidden"
};

const colorBarStyle = {
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

const statusStyle = {
  fontSize: "12px",
  fontWeight: "600",
  backgroundColor: "#eff6ff",
  color: "#1d4ed8",
  padding: "4px 10px",
  borderRadius: "20px"
};

const titleStyle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#1e293b",
  marginBottom: "8px"
};

const descStyle = {
  fontSize: "14px",
  color: "#64748b",
  marginBottom: "16px",
  lineHeight: "1.6"
};

const progressBgStyle = {
  backgroundColor: "#e2e8f0",
  borderRadius: "4px",
  height: "8px",
  overflow: "hidden"
};

const progressFillStyle = {
  height: "100%",
  borderRadius: "4px",
  transition: "width 0.3s"
};

const ownerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "16px",
  paddingTop: "16px",
  borderTop: "1px solid #f1f5f9"
};

const avatarStyle = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  backgroundColor: "#dbeafe",
  color: "#1d4ed8",
  fontSize: "11px",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const viewBtnStyle = {
  width: "100%",
  marginTop: "12px",
  backgroundColor: "#eff6ff",
  color: "#2563eb",
  border: "none",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600"
};

const primaryBtnStyle = {
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "600"
};

const emptyStyle = {
  textAlign: "center",
  padding: "80px 0",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

export default Campaigns;