
// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import Navbar from "../components/navbar";
// import API from "../services/api";

// export default function Profile() {
//   const router = useRouter();
//   const [token, setToken] = useState(null);
//   const [username, setUsername] = useState("");
//   const [bio, setBio] = useState("");
//   const [profilePic, setProfilePic] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [message, setMessage] = useState("");
//   const [role, setRole] = useState("");
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const t = localStorage.getItem("token");
//       if (!t) {
//         router.push("/login");
//       } else {
//         setToken(t);
//         fetchProfile(t);
//       }
//     }
//   }, []);

//   const fetchProfile = async (t) => {
//     try {
//       const res = await API.get("/users/me", {
//         headers: { Authorization: `Bearer ${t}` },
//       });
//       setUsername(res.data.username);
//       setBio(res.data.bio || "");
//       setPreview(
//         res.data.profile_pic
//           ? `http://localhost:8002/${res.data.profile_pic}`
//           : ""
//       );
//       setRole(res.data.role || "follower");

//       if (res.data.role === "creator") {
//         setRecipes(res.data.recipes || []);
//       }
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setProfilePic(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async () => {
//     if (!username) {
//       alert("Username cannot be empty!");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("username", username);
//     formData.append("bio", bio);
//     if (profilePic) formData.append("profile_pic", profilePic);

//     try {
//       const res = await API.patch("/users/me", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       setMessage(res.data.message);
//       alert("Profile updated successfully!");
//     } catch (err) {
//       console.log(err);
//       alert("Failed to update profile");
//     }
//   };

//   const handleView = (recipe) => {
//     alert(
//       `Title: ${recipe.title}\nDescription: ${recipe.description}\nCuisine: ${recipe.cuisine}\nDifficulty: ${recipe.difficulty}`
//     );
//   };

//   const handleDelete = async (recipeId) => {
//     if (!confirm("Are you sure you want to delete this recipe?")) return;

//     try {
//       await API.delete(`/recipes/${recipeId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert("Recipe deleted!");
//       setRecipes(recipes.filter((r) => r.id !== recipeId));
//     } catch (err) {
//       console.log(err);
//       alert("Failed to delete recipe");
//     }
//   };

//   return (
//     <>
//       {/* Background Video */}
//       <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden">
//         <video
//           autoPlay
//           loop
//           muted
//           playsInline
//           className="w-full h-full object-cover"
//         >
//           <source src="/bg1.mp4" type="video/mp4" />
//         </video>
//         <div className="absolute top-0 left-0 w-full h-full bg-black/25"></div>
//       </div>

//       <div className="relative z-10">
//         <Navbar />

//         <div className="min-h-screen py-12">
//           <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-12 border border-gray-200">

//             <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
//               👤 Profile Information
//             </h2>

//             {message && (
//               <div className="p-3 mt-4 bg-green-100 text-green-800 rounded-xl shadow-sm">
//                 {message}
//               </div>
//             )}

//             <div className="space-y-6 mt-6">
//               <div className="flex items-center gap-6">
//                 <label className="w-1/3 font-medium text-gray-700">Username</label>
//                 <input
//                   className="w-2/3 border border-gray-300 rounded-xl p-3 focus:ring-4 focus:ring-green-300 outline-none shadow-sm hover:shadow-md transition"
//                   placeholder="Your username"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                 />
//               </div>

//               <div className="flex items-start gap-6">
//                 <label className="w-1/3 font-medium text-gray-700 pt-2">Bio</label>
//                 <textarea
//                   className="w-2/3 border border-gray-300 rounded-xl p-3 focus:ring-4 focus:ring-green-300 outline-none shadow-sm hover:shadow-md transition"
//                   rows="4"
//                   placeholder="Write something about yourself..."
//                   value={bio}
//                   onChange={(e) => setBio(e.target.value)}
//                 />
//               </div>

//               <div className="flex items-center gap-6">
//                 <label className="w-1/3 font-medium text-gray-700">Profile Picture</label>
//                 <div className="w-2/3 flex flex-col gap-3">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="cursor-pointer"
//                   />
//                   {preview && (
//                     <img
//                       src={preview}
//                       alt="Preview"
//                       className="w-32 h-32 object-cover rounded-full border border-gray-300 shadow-md"
//                     />
//                   )}
//                 </div>
//               </div>
//             </div>

//             <button
//               onClick={handleSubmit}
//               className="w-full mt-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-2xl shadow-lg hover:shadow-2xl transition-all font-semibold"
//             >
//               Save Changes
//             </button>

//             {/* ---------------- Capabilities Section ---------------- */}
//             <div className="mt-12">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Capabilities</h2>

//               {role === "follower" && (
//                 <div className="mt-4 space-y-1 text-gray-700">
//                   <p>✅ Browse all available recipes</p>
//                   <p>✅ Search recipes by name or ingredients</p>
//                   <p>✅ Filter recipes by difficulty, time, or cuisine</p>
//                   <p>✅ View complete recipe details</p>
//                   <p>✅ Follow recipes in step-by-step cooking mode</p>
//                   <p>✅ Track your cooking history</p>
//                 </div>
//               )}

//               {role === "creator" && (
//                 <div className="mt-4 text-gray-700">
//                   <p>✅ Create new recipes with detailed information</p>
//                   <p>✅ Add multiple steps with instructions</p>
//                   <p>✅ Upload images and videos for each step</p>
//                   <p>✅ Specify ingredients with quantities</p>
//                   <p>✅ Set cooking time, difficulty level, and cuisine type</p>
//                   <p>✅ Edit or delete your own recipes</p>

//                   <h3 className="text-xl font-semibold mt-8 mb-4">Your Recipes:</h3>
//                   {recipes.length > 0 ? (
//                     recipes.map((recipe) => (
//                       <div
//                         key={recipe.id}
//                         className="bg-white rounded-2xl shadow-md border p-4 mb-4 hover:shadow-lg transition"
//                       >
//                         <h4 className="text-lg font-semibold text-gray-900">{recipe.title}</h4>
//                         <p className="text-gray-600">{recipe.description}</p>
//                         <p className="text-sm text-gray-500">
//                           Cuisine: {recipe.cuisine || "N/A"} | Difficulty: {recipe.difficulty || "N/A"}
//                         </p>
//                         <div className="flex gap-2 mt-3">
//                           <button
//                             onClick={() => handleView(recipe)}
//                             className="bg-blue-500 text-white px-3 py-1 rounded-xl hover:bg-blue-600 transition"
//                           >
//                             View
//                           </button>
//                           <button
//                             onClick={() => router.push(`/create?id=${recipe.id}`)}
//                             className="bg-blue-500 text-white px-3 py-1 rounded-xl hover:bg-blue-600 transition"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(recipe.id)}
//                             className="bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600 transition"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-gray-500">You haven't created any recipes yet.</p>
//                   )}
//                 </div>
//               )}
//             </div>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import Navbar from "../components/navbar";
// import API from "../services/api";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { toast } from "react-toastify";

// export default function Profile() {
//   const router = useRouter();
//   const [token, setToken] = useState(null);
//   const [username, setUsername] = useState("");
//   const [bio, setBio] = useState("");
//   const [profilePic, setProfilePic] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [role, setRole] = useState("");
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const t = localStorage.getItem("token");
//       if (!t) {
//         router.push("/login");
//       } else {
//         setToken(t);
//         fetchProfile(t);
//       }
//     }
//   }, []);

//   const fetchProfile = async (t) => {
//     try {
//       const res = await API.get("/users/me", { headers: { Authorization: `Bearer ${t}` } });
//       setUsername(res.data.username);
//       setBio(res.data.bio || "");
//       setPreview(res.data.profile_pic ? `http://localhost:8002/${res.data.profile_pic}` : "");
//       setRole(res.data.role || "follower");
//       if (res.data.role === "creator") setRecipes(res.data.recipes || []);
//     } catch (err) {
//       console.log(err);
//       toast.error("Failed to load profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setProfilePic(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async () => {
//     if (!username) return toast.warning("Username cannot be empty!");
//     const formData = new FormData();
//     formData.append("username", username);
//     formData.append("bio", bio);
//     if (profilePic) formData.append("profile_pic", profilePic);

//     try {
//       await API.patch("/users/me", formData, {
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
//       });
//       toast.success("Profile updated successfully!");
//     } catch (err) {
//       console.log(err);
//       toast.error("Failed to update profile");
//     }
//   };

//   const handleView = (recipe) => {
//     toast.info(
//       `Title: ${recipe.title}\nDescription: ${recipe.description}\nCuisine: ${recipe.cuisine}\nDifficulty: ${recipe.difficulty}`,
//       { autoClose: 4000 }
//     );
//   };

//   const handleDelete = async (recipeId) => {
//     if (!confirm("Are you sure you want to delete this recipe?")) return;
//     try {
//       await API.delete(`/recipes/${recipeId}`, { headers: { Authorization: `Bearer ${token}` } });
//       setRecipes(recipes.filter((r) => r.id !== recipeId));
//       toast.success("Recipe deleted successfully!");
//     } catch (err) {
//       console.log(err);
//       toast.error("Failed to delete recipe");
//     }
//   };

//   if (loading) return <p className="text-center mt-20 text-white">Loading profile...</p>;

//   return (
//     <>
//       {/* Background */}
//       <div className="fixed inset-0 -z-10">
//         <video autoPlay loop muted playsInline className="w-full h-full object-cover">
//           <source src="/bg1.mp4" type="video/mp4" />
//         </video>
//         <div className="absolute inset-0 bg-black/50"></div>
//       </div>

//       <div className="relative z-10 min-h-screen pb-12">
//         <Navbar />

//         <div className="max-w-4xl mx-auto mt-16 p-6">
//           <Card className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl">
//             <CardHeader>
//               <CardTitle className="text-3xl text-center mb-4">👤 Profile Information</CardTitle>
//             </CardHeader>

//             <CardContent className="space-y-6">
//               {/* Username */}
//               <div className="flex flex-col md:flex-row items-center gap-4">
//                 <label className="w-32 font-medium text-gray-700">Username</label>
//                 <Input
//                   className="flex-1"
//                   placeholder="Your username"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                 />
//               </div>

//               {/* Bio */}
//               <div className="flex flex-col md:flex-row items-start gap-4">
//                 <label className="w-32 font-medium text-gray-700 pt-2">Bio</label>
//                 <Textarea
//                   className="flex-1"
//                   rows={4}
//                   placeholder="Write something about yourself..."
//                   value={bio}
//                   onChange={(e) => setBio(e.target.value)}
//                 />
//               </div>

//               {/* Profile Picture */}
//               <div className="flex flex-col md:flex-row items-center gap-4">
//                 <label className="w-32 font-medium text-gray-700">Profile Picture</label>
//                 <div className="flex flex-col gap-3">
//                   <input type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer" />
//                   {preview && (
//                     <img
//                       src={preview}
//                       alt="Preview"
//                       className="w-32 h-32 object-cover rounded-full border border-gray-300 shadow-md"
//                     />
//                   )}
//                 </div>
//               </div>

//               <Button onClick={handleSubmit} className="w-full mt-4">
//                 Save Changes
//               </Button>
//             </CardContent>
//           </Card>

//           {/* Capabilities Section */}
//           <div className="mt-12">
//             <h2 className="text-2xl font-bold text-white mb-4">Your Capabilities</h2>

//             {role === "follower" && (
//               <ul className="list-disc list-inside text-white space-y-1">
//                 <li>Browse all available recipes</li>
//                 <li>Search recipes by name or ingredients</li>
//                 <li>Filter recipes by difficulty, time, or cuisine</li>
//                 <li>View complete recipe details</li>
//                 <li>Follow recipes in step-by-step cooking mode</li>
//                 <li>Track your cooking history</li>
//               </ul>
//             )}

//             {role === "creator" && (
//               <>
//                 <ul className="list-disc list-inside text-white space-y-1">
//                   <li>Create new recipes with detailed information</li>
//                   <li>Add multiple steps with instructions</li>
//                   <li>Upload images and videos for each step</li>
//                   <li>Specify ingredients with quantities</li>
//                   <li>Set cooking time, difficulty level, and cuisine type</li>
//                   <li>Edit or delete your own recipes</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold text-white mt-8 mb-4">Your Recipes</h3>
//                 {recipes.length > 0 ? (
//                   recipes.map((recipe) => (
//                     <Card key={recipe.id} className="mb-4 bg-white/90 shadow-lg rounded-2xl">
//                       <CardContent>
//                         <h4 className="text-lg font-semibold text-gray-900">{recipe.title}</h4>
//                         <p className="text-gray-600">{recipe.description}</p>
//                         <p className="text-sm text-gray-500">
//                           Cuisine: {recipe.cuisine || "N/A"} | Difficulty: {recipe.difficulty || "N/A"}
//                         </p>
//                         <div className="flex gap-2 mt-3">
//                           <Button size="sm" variant="outline" onClick={() => handleView(recipe)}>
//                             View
//                           </Button>
//                           <Button size="sm" variant="outline" onClick={() => router.push(`/create?id=${recipe.id}`)}>
//                             Edit
//                           </Button>
//                           <Button size="sm" variant="destructive" onClick={() => handleDelete(recipe.id)}>
//                             Delete
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))
//                 ) : (
//                   <p className="text-white">You haven't created any recipes yet.</p>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
 
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";
import API from "../services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function Profile() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");
  const [role, setRole] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("token");
      if (!t) router.push("/login");
      else {
        setToken(t);
        fetchProfile(t);
      }
    }
  }, []);

  const fetchProfile = async (t) => {
    try {
      const res = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${t}` },
      });

      setUsername(res.data.username);
      setBio(res.data.bio || "");
      setPreview(
        res.data.profile_pic
          ? `http://localhost:8002/${res.data.profile_pic}`
          : ""
      );
      setRole(res.data.role);
      setRecipes(res.data.recipes || []);
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!username) return toast.warning("Username cannot be empty");

    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    if (profilePic) formData.append("profile_pic", profilePic);

    try {
      await API.patch("/users/me", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes(recipes.filter((r) => r.id !== id));
      toast.success("Recipe deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading)
    return <p className="text-center mt-20 text-white">Loading...</p>;

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/bg1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 min-h-screen">
        <Navbar />

        <div className="max-w-7xl mx-auto mt-16 px-6 grid md:grid-cols-3 gap-8">

          {/* LEFT PANEL */}
          <Card className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-6">
            <CardContent className="flex flex-col items-center text-center space-y-4">
              <img
                src={
                  preview ||
                  "https://ui-avatars.com/api/?name=" + username
                }
                alt="avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
              />

              <h2 className="text-xl font-bold">{username}</h2>
              <p className="text-sm text-gray-500 capitalize">{role}</p>

              <div className="w-full pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Recipes</span>
                  <span className="font-semibold">
                    {recipes.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RIGHT PANEL */}
          <div className="md:col-span-2 space-y-8">

            {/* EDIT PROFILE */}
            <Card className="bg-white/95 backdrop-blur-xl shadow-xl rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-6">
                Edit Profile
              </h3>

              <div className="space-y-5">
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <Textarea
                  placeholder="Your bio..."
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />

                <div>
                  <label className="text-sm text-gray-500">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-2"
                  />
                </div>

                <Button onClick={handleSubmit} className="w-full">
                  Save Changes
                </Button>
              </div>
            </Card>

            {/* RECIPES GRID */}
            {role === "creator" && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Your Recipes
                </h3>

                {recipes.length === 0 ? (
                  <p className="text-white/80">
                    You haven't created any recipes yet.
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {recipes.map((recipe) => (
                      <Card
                        key={recipe.id}
                        className="bg-white shadow-lg rounded-2xl hover:shadow-2xl transition-all"
                      >
                        <CardContent className="p-5 space-y-2">
                          <h4 className="font-semibold text-lg">
                            {recipe.title}
                          </h4>

                          <p className="text-sm text-gray-600 line-clamp-2">
                            {recipe.description}
                          </p>

                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{recipe.cuisine || "N/A"}</span>
                            <span>{recipe.difficulty || "N/A"}</span>
                          </div>

                          <div className="flex gap-2 pt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                router.push(`/create?id=${recipe.id}`)
                              }
                            >
                              Edit
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleDelete(recipe.id)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}