import Footer from "./Footer"
import Header from "./Header"
import "./layout.css"
const DefaultLayout = ({ children }) => {
  return (
    <div className="default-layout">
      <Header />
      <main className="default-main">{children}</main>
      <Footer />
    </div>
  )
}
export default DefaultLayout
