import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

import "@/assets/tailwind.css"
import { Blocked } from "@/features/blocked/blocked"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Blocked />
  </StrictMode>
)
