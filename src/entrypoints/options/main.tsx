import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

import "@/assets/tailwind.css"
import { Options } from "@/features/options/options"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Options />
  </StrictMode>
)
