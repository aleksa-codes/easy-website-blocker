import "@/assets/tailwind.css"
import { Popup } from "@/features/popup/popup"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Popup />
  </StrictMode>
)
