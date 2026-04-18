import { Link, useNavigate } from "react-router-dom";
import { useBlockchain } from "../context/BlockchainContext";

function Navbar() {
  const { account, connectWallet } = useBlockchain();
  const navigate = useNavigate();

  return (
    <nav style={navStyle}>
      <div style={innerStyle}>
        <Link to="/" style={logoStyle}>
          FundChain
        </Link>

        <div style={linksStyle}>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/campaigns" style={linkStyle}>Campaigns</Link>
          <Link to="/create" style={linkStyle}>Start a Campaign</Link>
        </div>

        <div>
          {account ? (
            <div style={accountStyle}>
              <span style={dotStyle}></span>
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          ) : (
            <button onClick={connectWallet} style={btnStyle}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

const navStyle = {
  backgroundColor: "#fff",
  borderBottom: "1px solid #e2e8f0",
  padding: "0 40px",
  height: "64px",
  display: "flex",
  alignItems: "center",
  position: "sticky",
  top: 0,
  zIndex: 100,
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
};

const innerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  maxWidth: "1100px",
  margin: "0 auto"
};

const logoStyle = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#2563eb",
  textDecoration: "none",
  letterSpacing: "-0.5px"
};

const linksStyle = {
  display: "flex",
  gap: "32px"
};

const linkStyle = {
  textDecoration: "none",
  color: "#475569",
  fontSize: "15px",
  fontWeight: "500"
};

const accountStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: "#f0fdf4",
  border: "1px solid #bbf7d0",
  borderRadius: "20px",
  padding: "6px 14px",
  fontSize: "13px",
  color: "#166534",
  fontWeight: "500"
};

const dotStyle = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: "#22c55e",
  display: "inline-block"
};

const btnStyle = {
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "9px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600"
};

export default Navbar;