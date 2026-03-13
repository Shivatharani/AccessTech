import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import './i18n'
import "./index.css"

import { GoogleOAuthProvider } from "@react-oauth/google"
import { ThemeProvider } from "next-themes"

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="409494262537-2d259tnhsuhvesq0q120dfc5t50r0fdr.apps.googleusercontent.com">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <App />
      </ThemeProvider>
  </GoogleOAuthProvider>
)