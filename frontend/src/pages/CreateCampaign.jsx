import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlockchain } from "../context/BlockchainContext";

function CreateCampaign() {
  const { createCampaign, account, connectWallet } = useBlockchain();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    goal: "",
    days: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!form.title || !form.description || !form.goal || !form.days) {
      return alert("Please fill in all fields!");
    }
    if (isNaN(form.goal) || Number(form.goal) <= 0) {
      return alert("Please enter a valid goal amount!");
    }
    if (isNaN(form.days) || Number(form.days) <= 0) {
      return alert("Please enter valid number of days!");
    }
    setLoading(true);
    const success = await createCampaign(form.title, form.description, form.goal, form.days);
    setLoading(false);
    if (success) {
      alert("Campaign created successfully!");
      navigate("/campaigns");
    }
  }

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <button onClick={() => navigate(-1)} style={backBtnStyle}>← Back</button>
          <h1 style={{ fontSize: "30px", fontWeight: "800", color: "#1e293b", marginBottom: "8px" }}>
            Start a Campaign
          </h1>
          <p style={{ color: "#64748b", fontSize: "15px" }}>
            Fill in the details below to launch your crowdfunding campaign on the blockchain.
          </p>
        </div>

        {/* Not connected warning */}
        {!account && (
          <div style={warningStyle}>
            <span>You need to connect your wallet first!</span>
            <button onClick={connectWallet} style={connectBtnStyle}>Connect Wallet</button>
          </div>
        )}

        {/* Form */}
        <div style={formCardStyle}>

          <div style={fieldStyle}>
            <label style={labelStyle}>Campaign Title</label>
            <input
              name="title"
              placeholder="e.g. Save the Forests"
              value={form.title}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              placeholder="Describe your campaign and what the funds will be used for..."
              value={form.description}
              onChange={handleChange}
              rows={5}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Funding Goal (ETH)</label>
              <input
                name="goal"
                placeholder="e.g. 2.5"
                value={form.goal}
                onChange={handleChange}
                style={inputStyle}
                type="number"
                min="0"
                step="0.01"
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Duration (Days)</label>
              <input
                name="days"
                placeholder="e.g. 30"
                value={form.days}
                onChange={handleChange}
                style={inputStyle}
                type="number"
                min="1"
              />
            </div>
          </div>

          {/* Preview */}
          {form.title && (
            <div style={previewStyle}>
              <p style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "8px" }}>
                PREVIEW
              </p>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>
                {form.title}
              </h3>
              {form.description && (
                <p style={{ fontSize: "14px", color: "#64748b" }}>{form.description}</p>
              )}
              <div style={{ display: "flex", gap: "20px", marginTop: "12px" }}>
                {form.goal && (
                  <span style={{ fontSize: "13px", color: "#2563eb", fontWeight: "600" }}>
                    Goal: {form.goal} ETH
                  </span>
                )}
                {form.days && (
                  <span style={{ fontSize: "13px", color: "#64748b" }}>
                    Duration: {form.days} days
                  </span>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !account}
            style={{
              ...submitBtnStyle,
              opacity: loading || !account ? 0.6 : 1,
              cursor: loading || !account ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Creating Campaign..." : "Launch Campaign"}
          </button>
        </div>

        {/* Info box */}
        <div style={infoBoxStyle}>
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1e293b", marginBottom: "12px" }}>
            How it works
          </h3>
          {[
            "Your campaign is stored permanently on the blockchain",
            "Donors send ETH directly to the smart contract",
            "You can withdraw funds only when goal is reached",
            "If goal is not met, donors can claim a refund"
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
              <span style={{ color: "#2563eb", fontWeight: "700" }}>✓</span>
              <span style={{ fontSize: "14px", color: "#475569" }}>{item}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

const backBtnStyle = {
  backgroundColor: "transparent",
  border: "none",
  color: "#64748b",
  cursor: "pointer",
  fontSize: "14px",
  padding: "0",
  marginBottom: "16px",
  display: "block"
};

const warningStyle = {
  backgroundColor: "#fff7ed",
  border: "1px solid #fed7aa",
  borderRadius: "10px",
  padding: "16px 20px",
  marginBottom: "24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "#9a3412",
  fontSize: "14px"
};

const connectBtnStyle = {
  backgroundColor: "#ea580c",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600"
};

const formCardStyle = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "32px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  marginBottom: "24px"
};

const fieldStyle = {
  marginBottom: "20px"
};

const labelStyle = {
  display: "block",
  fontSize: "14px",
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
  color: "#1e293b",
  boxSizing: "border-box",
  outline: "none",
  fontFamily: "Arial"
};

const previewStyle = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "20px"
};

const submitBtnStyle = {
  width: "100%",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer"
};

const infoBoxStyle = {
  backgroundColor: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: "12px",
  padding: "24px"
};

export default CreateCampaign;