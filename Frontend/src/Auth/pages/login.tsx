import { IndianRupee, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setIsSigningUp(true);
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setIsSigningUp(false);
        alert(data.message);
        return;
      }
      // Set budget here
      // alert("Sign Up successful.");
      localStorage.setItem("token", data.user.token);
      localStorage.setItem("userId", data.user.id);

      navigate(`/expenses/${new Date().toLocaleDateString("en-CA")}`);
    } catch (err) {
      console.log("Error: ", err);
    }
    setIsSigningUp(false);
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setIsLoggingIn(false);
        alert(data.message);
        return;
      }
      // alert(data.message);
      localStorage.setItem("token", data.user.token);
      localStorage.setItem("userId", data.user.id);
      navigate(`/expenses/${new Date().toLocaleDateString("en-CA")}`);
    } catch (err) {
      console.log(err);
    }
    setIsLoggingIn(false);
  };
  return (
    <div className={styles.login}>
      <div className={styles.INRIcon}>
        <IndianRupee color="white" />
      </div>

      <h2 className={styles.h2}>AI-Powered Expense Tracker</h2>
      <p className={styles.text1}>Manage your finances with ease</p>

      <div className={styles.authBox}>
        <div className={styles.twoButtons}>
          <button
            onClick={() => {
              setIsSignup(false);
              setMode("login");
            }}
            className={
              mode === "login" ? styles.authButton : styles.inactiveAuthButton
            }
          >
            Log In
          </button>
          <button
            onClick={() => {
              setIsSignup(true);
              setMode("signup");
            }}
            className={
              mode === "signup" ? styles.authButton : styles.inactiveAuthButton
            }
          >
            Sign Up
          </button>
        </div>
        <form className={styles.loginForm} onSubmit={(e) => e.preventDefault()}>
          {isSignup && (
            <div className={styles.lAndI}>
              <label htmlFor="fullName">Full Name</label>
              <input
                required
                type="text"
                id="fullName"
                name="fullName"
                onChange={(e) => setFullName(e.target.value)}
                className={styles.input}
              />
            </div>
          )}
          <div className={styles.lAndI}>
            <label htmlFor="email">Email Address</label>
            <input
              required
              type="email"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.lAndI}>
            <label htmlFor="password">Password</label>
            <input
              required
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </div>

          {isSignup ? (
            <button className={styles.authButton} onClick={handleSignUp}>
              {isSigningUp ? (
                <LoaderCircle className={styles.spin} />
              ) : (
                "Sign Up"
              )}
            </button>
          ) : (
            <button className={styles.authButton} onClick={handleLogin}>
              {isLoggingIn ? (
                <LoaderCircle className={styles.spin} />
              ) : (
                "Log In"
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
