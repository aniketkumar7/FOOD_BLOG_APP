import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

const MainNavigation = () => {
  return (
    <>
    <Navbar />
    <Outlet />
    </>
  )
}
export default MainNavigation