import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/navbar";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);

  // Fetch user from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("id"); // stored as string
    if (token && role && id) {
      setUser({ id: Number(id), role });
    }
  }, []);

  // Fetch all recipes
  const fetchRecipes = async () => {
    try {
      const res = await API.get("/recipes");
      setRecipes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Search recipes
  const handleSearch = async () => {
    try {
      const res = await API.get("/recipes/search", {
        params: { name: query.trim() || undefined } // undefined instead of empty string
      });
      console.log(res.data);
      setRecipes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch recipes on mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Auto-search as user types
  useEffect(() => {
    if (query === "") {
      fetchRecipes();
    } else {
      const delayDebounce = setTimeout(() => handleSearch(), 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [query]);

  return (
    <>
      {/* Background Video */}
      <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/bg1.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Navbar />
        {/* Hero Section */}
        <div className=" bg-opacity-80 p-10 mt-20">
          <div className="max-w-5xl mx-auto text-center mb-10">
            <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_3px_black] drop-shadow-[0_0_3px_black] drop-shadow-[0_0_3px_black] drop-shadow-[0_0_3px_black] drop-shadow-[0_0_3px_black] mb-4">Welcome to RecipeHub 🍳</h1>
            <p className="text-lg text-white font-bold drop-shadow-[0_0_3px_black] drop-shadow-[0_0_3px_black] drop-shadow-[0_0_3px_black] drop-shadow-[0_0_3px_black] drop-shadow-[0_0_3px_black] mb-4">
              {user
                ? user.role === "creator"
                  ? "Manage your recipes and inspire followers!"
                  : "Follow step-by-step recipes and track your cooking!"
                : "Discover recipes from creators around the platform. Browse, search, and find your next favorite dish!"}
            </p>
          </div>

          {/* Roles Section - only for visitors */}
          {!user && (
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl shadow-lg border">
                <h2 className="text-xl font-semibold mb-2">👩‍🍳 Recipe Creator</h2>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Create new recipes with detailed information</li>
                  <li>Add multiple steps with instructions</li>
                  <li>Upload images and videos for each step</li>
                  <li>Specify ingredients with quantities</li>
                  <li>Set cooking time, difficulty level, and cuisine type</li>
                  <li>Edit or delete their own recipes</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border">
                <h2 className="text-xl font-semibold mb-2">👥 Recipe Follower</h2>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Browse all available recipes</li>
                  <li>Search recipes by name or ingredients</li>
                  <li>Filter recipes by difficulty, time, or cuisine</li>
                  <li>View complete recipe details</li>
                  <li>Follow recipes in step-by-step cooking mode</li>
                  <li>Track their cooking history</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>

  );
}
