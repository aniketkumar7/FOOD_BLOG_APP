import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

// MainNavigation component
// This component renders the main navigation for the application using the Navbar component and the Outlet component
const MainNavigation = () => {
  return (
    <>
    <Navbar />
    <Outlet />
    </>
  )
}
export default MainNavigation