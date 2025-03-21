"use client"

import { useState, useRef, useEffect } from "react"
import { Home, Settings, User, Calendar, Menu, X, HelpCircle, GraduationCap, BookOpen, LogOut } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { logoutUser } from "@/services/api/auth"
import { useNavigate } from "react-router-dom"
import colors from "@/constants/colors"

const Sidebar = ({ children }) => {
  const [expanded, setExpanded] = useState(true)
  const [activeItem, setActiveItem] = useState("dashboard")
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const auth = useAuth()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const toggleSidebar = () => {
    setExpanded(!expanded)
  }

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    const response = await logoutUser(auth, navigate)
    setProfileDropdownOpen(false)
  }

  const menuItems = [
    { id: "dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { id: "Study", icon: <BookOpen size={20} />, label: "Study" },
    { id: "profile", icon: <User size={20} />, label: "Profile" },
    { id: "calendar", icon: <Calendar size={20} />, label: "Calendar" },
    { id: "quizzes", icon: <GraduationCap size={20} />, label: "Quizzes" },
    { id: "settings", icon: <Settings size={20} />, label: "Settings" },
    { id: "help", icon: <HelpCircle size={20} />, label: "Help" },
  ]

  const handleItem = (path) => {
    if (path == "Study") navigate(`/study/chapter/1/verse/1`)
    else {
      navigate(`/${path}`)
    }
    setActiveItem(path)
  }

  // Close sidebar when clicking on overlay (mobile-friendly)
  const handleOverlayClick = () => {
    if (expanded) {
      setExpanded(false)
    }
  }

  return (
    <div className="flex relative">
      {/* Overlay - only visible when sidebar is expanded */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/30 transition-opacity duration-300 ease-in-out z-40 md:hidden"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - fixed position with z-index */}
      <div
        className={`fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out ${
          expanded ? "w-64" : "w-20"
        } shadow-md z-50`}
        style={{ backgroundColor: colors.paleBeige }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: colors.warmBeige }}>
          {expanded && (
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primaryRed }}
              >
                <span className="text-white font-bold">S</span>
              </div>
              <h2 className="font-bold" style={{ color: colors.deeperRed }}>
                AnantGita
              </h2>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md focus:outline-none"
            style={{
              backgroundColor: expanded ? colors.offWhite : colors.lightBeige,
              color: colors.darkRed,
            }}
          >
            {expanded ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItem(item.id)}
                  className={`flex items-center w-full p-3 rounded-md transition-colors duration-200 ${
                    expanded ? "justify-start" : "justify-center"
                  }`}
                  style={{
                    backgroundColor: activeItem === item.id ? colors.primaryRed : "transparent",
                    color: activeItem === item.id ? colors.offWhite : colors.deeperRed,
                  }}
                >
                  <span>{item.icon}</span>
                  {expanded && <span className="ml-3">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Profile Section with Dropdown */}
        <div className="border-t w-full absolute bottom-0" style={{ borderColor: colors.warmBeige }} ref={dropdownRef}>
          <button onClick={toggleProfileDropdown} className="w-full p-4 flex items-center focus:outline-none">
            {auth.user && auth.user.avatar ? (
              <img
                src={auth.user.avatar || "/placeholder.svg"}
                alt={auth.user?.name || "User avatar"}
                className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: colors.softRed }}
              >
                <User size={20} color="white" />
              </div>
            )}

            {expanded && (
              <div className="ml-3 text-left">
                <p className="font-medium text-sm" style={{ color: colors.deeperRed }}>
                  {auth.user?.name || "User"}
                </p>
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {profileDropdownOpen && expanded && (
            <div
              className="absolute bottom-full left-0 w-full mb-1 rounded-md shadow-lg z-50"
              style={{ backgroundColor: colors.offWhite }}
            >
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                  style={{ color: colors.deeperRed }}
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Small Screen Dropdown (when sidebar is collapsed) */}
          {profileDropdownOpen && !expanded && (
            <div
              className="absolute left-full bottom-0 ml-1 w-32 rounded-md shadow-lg z-50"
              style={{ backgroundColor: colors.offWhite }}
            >
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                  style={{ color: colors.deeperRed }}
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - with dynamic margin and overlay effect */}
      <div className={`flex-1 transition-all duration-300 min-h-screen ${expanded ? "md:ml-64" : "md:ml-20"} ml-20`}>
        {/* Content wrapper with backdrop filter for desktop */}
        <div className={`relative ${expanded ? "md:backdrop-blur-sm" : ""}`}>
          {/* Optional desktop overlay for a more pronounced effect */}
          {expanded && <div className="absolute inset-0 bg-black/5 hidden md:block" />}

          {/* Actual content */}
          <div className="relative">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

