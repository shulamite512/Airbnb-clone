import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

function AuthInitializer({ children }) {
  const initAuth = useAuthStore((s) => s.initAuth);
  useEffect(() => {
    initAuth();
  }, []);
  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthInitializer>
        <App />
      </AuthInitializer>
    </BrowserRouter>
  </React.StrictMode>
);
