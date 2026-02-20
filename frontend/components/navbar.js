import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);

  const updateAuthStatus = () => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setRole(storedRole || null);
  };

  useEffect(() => {
    updateAuthStatus();
    router.events.on("routeChangeComplete", updateAuthStatus);
    return () => router.events.off("routeChangeComplete", updateAuthStatus);
  }, [router.events]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    setIsLoggedIn(false);
    setRole(null);
    router.push("/login");
  };
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false); // scrolling down
      } else {
        setShowNavbar(true); // scrolling up
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <nav className={`sticky top-0 backdrop-blur-m transition-all duration-300 ${showNavbar ? "opacity-100" : "opacity-0"}`}>

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <h1
          className="text-2xl font-black tracking-wide text-white cursor-pointer hover:text-green-400 transition duration-300"
          onClick={() => router.push("/")}
        >
          RecipeHub
        </h1>

        {/* Navigation Links */}
        <div className="flex gap-3 items-center">

          <Link
            href="/"
            className="px-4 py-2 rounded-lg text-gray-200 font-bold hover:text-green-400 hover:bg-white/10 transition duration-300"
          >
            Home
          </Link>

          <Link
            href="/recipes"
            className="px-4 py-2 rounded-lg text-gray-200 font-bold hover:text-green-400 hover:bg-white/10 transition duration-300"
          >
            Recipes
          </Link>

          {/* Only creators see Create */}
          {isLoggedIn && role === "creator" && (
            <Link
              href="/create"
              className="px-5 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-md transition duration-300"
            >
              Create
            </Link>
          )}

          {/* Profile */}
          {isLoggedIn && (
            <Link
              href="/profile"
              className="px-4 py-2 rounded-lg text-gray-200 font-bold hover:text-green-400 hover:bg-white/10 transition duration-300"
            >
              Profile
            </Link>
          )}

          {/* Login / Logout */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 shadow-md transition duration-300"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-md transition duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );

}
