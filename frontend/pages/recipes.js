import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/navbar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


export default function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [query, setQuery] = useState("");
    const [user, setUser] = useState(null);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    // Get user info from localStorage (if logged in)
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const id = localStorage.getItem("id");
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

    // Search recipes by name
    const handleSearch = async () => {
        try {
            const res = await API.get("/recipes/search", { params: { name: query } });
            setRecipes(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    useEffect(() => {
        if (query === "") {
            fetchRecipes();
        } else {
            const delay = setTimeout(() => handleSearch(), 500);
            return () => clearTimeout(delay);
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



            <div className="relative z-10">
                <Navbar user={user} />
                {/* Search */}
                <div className="max-w-5xl mx-auto mb-10 flex gap-2 my-8">
                    <input
                        className="flex-1 border rounded-lg p-3"
                        placeholder="Search Recipes..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        className="bg-green-600 text-white px-6 rounded-lg hover:bg-green-700"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>

                {/* Recipes List */}
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-15">
                    {recipes.map((r) => (

                        <div
                            key={r.id}
                            className="bg-white p-4 rounded-2xl shadow-lg border"
                        >
                            {/* Image */}
                            {r.image && (
                                <img
                                    src={`http://localhost:8002/${r.image}`}
                                    alt={r.title}
                                    className="w-full h-52 object-cover cursor-pointer"
                                    onClick={() => setSelectedRecipe(r)}
                                />
                            )}

                            <h3 className="text-lg font-semibold mb-2">{r.title}</h3>


                            {/* Role-based buttons */}
                            {user?.role === "creator" && user.id === r.created_by && (
                                <div className="flex gap-2 mt-2">
                                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                        Edit
                                    </button>
                                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                        Delete
                                    </button>
                                </div>
                            )}

                            {user?.role === "follower" && (
                                <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mt-2">
                                    Mark as Cooked
                                </button>
                            )}
                        </div>
                    ))}
                    <Dialog
                        open={!!selectedRecipe}
                        onOpenChange={() => setSelectedRecipe(null)}
                    >
                        <DialogContent className="max-w-lg bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border">
                            {selectedRecipe && (
                                <>
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-semibold">
                                            {selectedRecipe.title}
                                        </DialogTitle>
                                    </DialogHeader>

                                    <div className="space-y-3 text-sm text-gray-700 max-h-[60vh] overflow-y-auto">

                                        {selectedRecipe.image && (
                                            <img
                                                src={`http://localhost:8002/${selectedRecipe.image}`}
                                                alt={selectedRecipe.title}
                                                className="w-full h-40 object-cover rounded-xl"
                                            />
                                        )}

                                        <p className="text-gray-600">
                                            {selectedRecipe.description}
                                        </p>

                                        <p className="text-gray-500">
                                            Cuisine: {selectedRecipe.cuisine || "N/A"} | Difficulty:{" "}
                                            {selectedRecipe.difficulty || "N/A"}
                                        </p>

                                        <p className="text-gray-500">
                                            Prep: {selectedRecipe.prep_time} mins | Cook:{" "}
                                            {selectedRecipe.cook_time} mins | Servings:{" "}
                                            {selectedRecipe.servings}
                                        </p>

                                        <div>
                                            <h4 className="font-semibold mt-2">Ingredients</h4>
                                            <ul className="list-disc ml-5 text-gray-600">
                                                {selectedRecipe.ingredients?.map((ing) => (
                                                    <li key={ing.id}>
                                                        {ing.name} - {ing.quantity}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold mt-2">Steps</h4>
                                            <ol className="list-decimal ml-5 text-gray-600">
                                                {selectedRecipe.steps?.map((step) => (
                                                    <li key={step.id}>{step.instruction}</li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>

                                    {/* Buttons like your card style */}
                                    <DialogFooter className="mt-4 flex gap-2">

                                        <DialogClose asChild>
                                            <button className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">
                                                Close
                                            </button>
                                        </DialogClose>
                                    </DialogFooter>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>



                </div>
            </div>
        </>
    );
}
