import Sidebar from "../sidebar/Sidebar"
import Footer from "./Footer"
import Header from "./Header"
import "./dashboardLayout.css"

const DashboardLayout = ({ children }) => (
  <div className="dashboard-layout">
    <Sidebar />
    <div className="dashboard-main">
      <Header />
      <main className="content">{children}</main>
      <Footer />
    </div>
  </div>
)
export default DashboardLayout
