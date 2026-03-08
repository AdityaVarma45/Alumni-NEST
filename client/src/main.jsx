import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ChatProvider>

        {/* GLOBAL TOAST ENGINE */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
          }}
        />

        <App />

      </ChatProvider>
    </AuthProvider>
  </StrictMode>
);