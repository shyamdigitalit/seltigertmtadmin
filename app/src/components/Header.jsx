import React from "react";
import ShyamLogo from "/shyamlogo.png";

const Header = ({ brandName = "SEL Tiger - ADMIN", isLoggedIn = true, onLogin, onLogout }) => {
  return (
    <header style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <img src={ShyamLogo} width={100} alt="" />
          <span>{brandName}</span>
        </div>

        <div style={styles.actions}>
          {isLoggedIn ? (
            <button style={{ ...styles.btn, ...styles.logout }} onClick={onLogout}>
              Logout
            </button>
          ) : (
            <button style={{ ...styles.btn, ...styles.login }} onClick={onLogin}>
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

const styles = {
  wrapper: {
    marginTop: "-18px",
    width: "100%",
    padding: "12px 16px",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "#fff",
    borderRadius: "8px",
    padding: "5px 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: "2px solid lightgray",
    boxShadow: "0 3px 3px rgba(0,0,0,0.12)",
  },
  brand: {
    display: "flex", alignItems: "center", gap: "12px",
    fontSize: "22px",
    fontWeight: 700,
    letterSpacing: "0.5px",
    color: "#333",
  },
  actions: {
    display: "flex",
    gap: "12px",
  },
  
  btn: {
    padding: "9px 22px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "0.3px",
    transition: "all 0.25s ease",
    boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
  },

  login: {
    background: "linear-gradient(135deg, #43cea2, #185a9d)",
    color: "#fff",
  },

  logout: {
    background: "linear-gradient(135deg, #ff512f, #dd2476)",
    color: "#fff",
  },

};
