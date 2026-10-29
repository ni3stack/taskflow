import { Outlet } from "react-router-dom";
import PublicHeader from "./PublicHeader/PublicHeader";
import PublicFooter from "./PublicFooter/PublicFooter";
import "./PublicLayout.css" 


export default function PublicLayout() {
  return (
    <div className="public-layout">
      <a className="public-layout__skip-link" href="#main-content">
        Skip to main content
      </a>
      <PublicHeader />

      <main className="public-layout__main" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  )
}