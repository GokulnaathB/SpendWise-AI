import { IndianRupee, Menu } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

import styles from "./PostLoginLayout.module.css";
import _styles from "./sideMenu.module.css";
import __styles from "./header.module.css";

export default function PostLoginLayout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const [showSideMenu, setShowSideMenu] = useState(false);

  return (
    <>
      {showSideMenu && (
        <div className={_styles.overlay}>
          <div className={_styles.sideMenu}>
            <div className={_styles.close}>
              <button onClick={() => setShowSideMenu(false)}>X</button>
            </div>
            <div>
              <button
                onClick={() => {
                  setShowSideMenu(false);
                  navigate(
                    `/expenses/${new Date().toLocaleDateString("en-CA")}`,
                  );
                }}
              >
                Home
              </button>
            </div>
            <div>
              <button
                onClick={() => {
                  setShowSideMenu(false);
                  navigate("/budgeting");
                }}
              >
                Budgeting
              </button>
            </div>
            <div>
              <button
                onClick={() => {
                  setShowSideMenu(false);
                  navigate("/dashboard");
                }}
              >
                Dashboard
              </button>
            </div>
            <div>
              <button
                onClick={() => {
                  setShowSideMenu(false);
                  navigate("/howToSave");
                }}
              >
                Tips for saving
              </button>
            </div>
            <div>
              <button
                onClick={() => {
                  setShowSideMenu(false);
                  navigate("/downloadExpenses");
                }}
              >
                Download expenses
              </button>
            </div>
          </div>
        </div>
      )}
      <header className={styles.hdr}>
        <Menu
          onClick={() => setShowSideMenu(true)}
          size={35}
          cursor={`pointer`}
          className="no-print"
        />
        <h1>
          <span className={__styles.INRIcon}>
            <IndianRupee color="white" />
          </span>{" "}
          <span className={__styles.appName}>Expense Tracker</span>
        </h1>
        <button onClick={handleLogout} className={__styles.logoutButton}>
          <span className="no-print">Logout</span>
        </button>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}
