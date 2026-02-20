// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import Navbar from "../components/navbar";
// import API from "../services/api";

// export default function Create() {
//   const router = useRouter();
//   const { id } = router.query;

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [cuisine, setCuisine] = useState("");
//   const [difficulty, setDifficulty] = useState("Easy");
//   const [prepTime, setPrepTime] = useState(10);
//   const [cookTime, setCookTime] = useState(10);
//   const [servings, setServings] = useState(1);
//   const [ingredients, setIngredients] = useState([{ name: "", quantity: "", order: 1 }]);
//   const [steps, setSteps] = useState([{ step_number: 1, instruction: "", estimated_time: 0 }]);
//   const [recipeImage, setRecipeImage] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [activeTab, setActiveTab] = useState(0); // 0=Basic, 1=Ingredients, 2=Steps, 3=Image

//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//   const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

//   useEffect(() => {
//     if (!token || role !== "creator") router.push("/login");
//     if (id) fetchRecipe(id);
//   }, [id]);

//   const fetchRecipe = async (recipeId) => {
//     try {
//       const res = await API.get(`/recipes/${recipeId}`);
//       const r = res.data;
//       setTitle(r.title);
//       setDescription(r.description);
//       setCuisine(r.cuisine);
//       setDifficulty(r.difficulty);
//       setPrepTime(r.prep_time);
//       setCookTime(r.cook_time);
//       setServings(r.servings);
//       setIngredients(r.ingredients.map((i, j) => ({ ...i, order: j + 1 })));
//       setSteps(r.steps.map((s, j) => ({ ...s, step_number: j + 1 })));
//       if (r.image) setPreview(`http://localhost:8002/${r.image}`);
//     } catch (err) {
//       alert("Failed to load recipe");
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setRecipeImage(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async () => {
//     if (!title || !description) {
//       alert("Title and Description are required");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("cuisine", cuisine);
//     formData.append("difficulty", difficulty);
//     formData.append("prep_time", prepTime);
//     formData.append("cook_time", cookTime);
//     formData.append("servings", servings);
//     formData.append("ingredients", JSON.stringify(ingredients));
//     formData.append("steps", JSON.stringify(steps));
//     if (recipeImage) formData.append("image", recipeImage);

//     try {
//       setLoading(true);
//       if (id) {
//         await API.patch(`/recipes/${id}`, formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         alert("Recipe updated successfully!");
//       } else {
//         await API.post("/recipes", formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         alert("Recipe created successfully!");
//       }
//       router.push("/profile");
//     } catch (err) {
//       console.log(err.response?.data);
//       alert("Failed to save recipe");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const tabs = ["Basic Info", "Ingredients", "Steps", "Image Upload"];

//   return (
//     <>
//       {/* Background */}
//       <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden">
//         <video autoPlay loop muted playsInline className="w-full h-full object-cover">
//           <source src="/bg1.mp4" type="video/mp4" />
//         </video>
//         <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div>
//       </div>

//       <div className="relative z-10 min-h-screen flex flex-col">
//         <Navbar />

//         <div className="flex justify-center mt-12">
//           <div className="w-full max-w-3xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-gray-200">
//             <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
//               {id ? "✏️ Edit Recipe" : "📝 Create New Recipe"}
//             </h2>

//             {/* Tabs */}
//             <div className="flex justify-between mb-6">
//               {tabs.map((tab, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setActiveTab(idx)}
//                   className={`flex-1 text-center py-2 rounded-xl font-medium transition ${
//                     activeTab === idx
//                       ? "bg-green-600 text-white shadow-lg"
//                       : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                   }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>

//             {/* Tab Content */}
//             <div className="space-y-6">
//               {activeTab === 0 && (
//                 <div className="space-y-5">
//                   <input
//                     className="w-full border border-gray-300 rounded-xl p-4 focus:ring-4 focus:ring-green-300 outline-none transition shadow-sm hover:shadow-md"
//                     placeholder="Recipe Title"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                   />
//                   <textarea
//                     className="w-full border border-gray-300 rounded-xl p-4 focus:ring-4 focus:ring-green-300 outline-none transition shadow-sm hover:shadow-md"
//                     rows="4"
//                     placeholder="Short Description"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                   />
//                   <div className="grid grid-cols-2 gap-5">
//                     <input
//                       className="border border-gray-300 rounded-xl p-3 focus:ring-4 focus:ring-green-300 outline-none transition shadow-sm hover:shadow-md"
//                       placeholder="Cuisine (e.g. Italian)"
//                       value={cuisine}
//                       onChange={(e) => setCuisine(e.target.value)}
//                     />
//                     <select
//                       className="border border-gray-300 rounded-xl p-3 focus:ring-4 focus:ring-green-300 outline-none transition shadow-sm hover:shadow-md bg-white"
//                       value={difficulty}
//                       onChange={(e) => setDifficulty(e.target.value)}
//                     >
//                       <option>Easy</option>
//                       <option>Medium</option>
//                       <option>Hard</option>
//                     </select>
//                   </div>
//                 </div>
//               )}

//               {activeTab === 1 && (
//                 <div>
//                   {ingredients.map((ing, i) => (
//                     <div key={i} className="flex gap-4 mb-4">
//                       <input
//                         className="flex-1 border border-gray-300 rounded-xl p-3 focus:ring-4 focus:ring-green-300 outline-none transition shadow-sm hover:shadow-md"
//                         placeholder="Ingredient name"
//                         value={ing.name}
//                         onChange={(e) => {
//                           const updated = [...ingredients];
//                           updated[i].name = e.target.value;
//                           setIngredients(updated);
//                         }}
//                       />
//                       <input
//                         className="w-36 border border-gray-300 rounded-xl p-3 focus:ring-4 focus:ring-green-300 outline-none transition shadow-sm hover:shadow-md"
//                         placeholder="Quantity"
//                         value={ing.quantity}
//                         onChange={(e) => {
//                           const updated = [...ingredients];
//                           updated[i].quantity = e.target.value;
//                           setIngredients(updated);
//                         }}
//                       />
//                     </div>
//                   ))}
//                   <button
//                     className="text-green-600 font-medium hover:text-green-800 transition-all hover:underline"
//                     onClick={() =>
//                       setIngredients([...ingredients, { name: "", quantity: "", order: ingredients.length + 1 }])
//                     }
//                   >
//                     + Add Ingredient
//                   </button>
//                 </div>
//               )}

//               {activeTab === 2 && (
//                 <div>
//                   {steps.map((s, i) => (
//                     <textarea
//                       key={i}
//                       className="w-full border border-gray-300 rounded-xl p-4 mb-4 focus:ring-4 focus:ring-green-300 outline-none transition shadow-sm hover:shadow-md"
//                       rows="3"
//                       placeholder={`Step ${i + 1}`}
//                       value={s.instruction}
//                       onChange={(e) => {
//                         const updated = [...steps];
//                         updated[i].instruction = e.target.value;
//                         setSteps(updated);
//                       }}
//                     />
//                   ))}
//                   <button
//                     className="text-green-600 font-medium hover:text-green-800 transition-all hover:underline"
//                     onClick={() =>
//                       setSteps([...steps, { step_number: steps.length + 1, instruction: "", estimated_time: 0 }])
//                     }
//                   >
//                     + Add Step
//                   </button>
//                 </div>
//               )}

//               {activeTab === 3 && (
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Recipe Image
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="w-full border border-gray-300 rounded-xl p-3 cursor-pointer bg-gray-50 hover:bg-gray-100 focus:ring-4 focus:ring-green-300 transition"
//                   />
//                   {preview && (
//                     <img
//                       src={preview}
//                       className="w-full h-72 object-cover rounded-2xl mt-4 shadow-lg border border-gray-200"
//                     />
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Navigation Buttons */}
//             <div className="flex justify-between mt-8">
//               {activeTab > 0 && (
//                 <button
//                   className="px-6 py-3 bg-gray-300 rounded-xl hover:bg-gray-400 transition"
//                   onClick={() => setActiveTab(activeTab - 1)}
//                 >
//                   Back
//                 </button>
//               )}
//               {activeTab < tabs.length - 1 && (
//                 <button
//                   className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition ml-auto"
//                   onClick={() => setActiveTab(activeTab + 1)}
//                 >
//                   Next
//                 </button>
//               )}
//               {activeTab === tabs.length - 1 && (
//                 <button
//                   className={`px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition ml-auto ${
//                     loading ? "bg-gray-400 cursor-not-allowed" : ""
//                   }`}
//                   onClick={handleSubmit}
//                   disabled={loading}
//                 >
//                   {loading ? "Saving..." : id ? "Update Recipe" : "Publish Recipe"}
//                 </button>
//               )}
//             </div>
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-toastify";

export default function Create() {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [prepTime, setPrepTime] = useState(0);
  const [cookTime, setCookTime] = useState(0);
  const [servings, setServings] = useState(1);
  const [ingredients, setIngredients] = useState([{ id: "ing-1", name: "", quantity: "" }]);
  const [steps, setSteps] = useState([{ id: "step-1", instruction: "" }]);
  const [recipeImage, setRecipeImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  useEffect(() => {
    if (!token || role !== "creator") router.push("/login");
    if (id) fetchRecipe(id);
  }, [id]);

  const fetchRecipe = async (recipeId) => {
    try {
      const res = await API.get(`/recipes/${recipeId}`);
      const r = res.data;
      setTitle(r.title);
      setDescription(r.description);
      setCuisine(r.cuisine);
      setDifficulty(r.difficulty);
      setPrepTime(r.prep_time);
      setCookTime(r.cook_time);
      setServings(r.servings);
      setIngredients(r.ingredients.map((i, idx) => ({ id: `ing-${idx + 1}`, ...i })));
      setSteps(r.steps.map((s, idx) => ({ id: `step-${idx + 1}`, ...s })));
      if (r.image) setPreview(`http://localhost:8002/${r.image}`);
    } catch (err) {
      toast.error("Failed to load recipe");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setRecipeImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      toast.warning("Title & description required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("cuisine", cuisine);
    formData.append("difficulty", difficulty);
    formData.append("prep_time", prepTime);
    formData.append("cook_time", cookTime);
    formData.append("servings", servings);
    formData.append("ingredients", JSON.stringify(ingredients));
    formData.append("steps", JSON.stringify(steps));
    if (recipeImage) formData.append("image", recipeImage);

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // keep auth
        },
      };

      if (id) {
        await API.patch(`/recipes/${id}`, formData, config);
        toast.success("Recipe updated!");
      } else {
        await API.post("/recipes", formData, config);
        toast.success("Recipe created!");
      }
      router.push("/profile");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save recipe");
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = (result, type) => {
    if (!result.destination) return;

    if (type === "ingredients") {
      const items = Array.from(ingredients);
      const [reordered] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reordered);
      setIngredients(items);
    } else {
      const items = Array.from(steps);
      const [reordered] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reordered);
      setSteps(items);
    }
  };

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/bg1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex justify-center mt-16 px-4">
          <Card className="w-full max-w-5xl bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-3xl text-center mb-4">
                {id ? "✏️ Edit Recipe" : "📝 Create Recipe"}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="md:flex md:gap-8">
                {/* Left: Form Tabs */}
                <div className="md:flex-1">
                  <Tabs defaultValue="basic">
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="basic">Basic</TabsTrigger>
                      <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                      <TabsTrigger value="steps">Steps</TabsTrigger>
                    </TabsList>

                    {/* Basic */}
                    <TabsContent value="basic" className="space-y-4">
                      <Input placeholder="Recipe Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                      <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                      <div className="flex gap-4">
                        <Input placeholder="Cuisine" value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
                        <Select value={difficulty} onValueChange={setDifficulty}>
                          <SelectTrigger><SelectValue placeholder="Difficulty" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-4 mt-2">
                        <Input type="number" placeholder="Prep Time (min)" value={prepTime} onChange={(e) => setPrepTime(Number(e.target.value))} />
                        <Input type="number" placeholder="Cook Time (min)" value={cookTime} onChange={(e) => setCookTime(Number(e.target.value))} />
                        <Input type="number" placeholder="Servings" value={servings} onChange={(e) => setServings(Number(e.target.value))} />
                      </div>
                    </TabsContent>

                    {/* Ingredients */}
                    <TabsContent value="ingredients" className="space-y-3">
                      <DragDropContext onDragEnd={(res) => onDragEnd(res, "ingredients")}>
                        <Droppable droppableId="ingredients">
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                              {ingredients.map((ing, i) => (
                                <Draggable key={ing.id} draggableId={ing.id} index={i}>
                                  {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="flex gap-3 items-center bg-gray-50 p-2 rounded-md shadow-sm">
                                      <Input placeholder="Ingredient" value={ing.name} onChange={(e) => {
                                        const updated = [...ingredients];
                                        updated[i].name = e.target.value;
                                        setIngredients(updated);
                                      }} />
                                      <Input placeholder="Quantity" value={ing.quantity} onChange={(e) => {
                                        const updated = [...ingredients];
                                        updated[i].quantity = e.target.value;
                                        setIngredients(updated);
                                      }} />
                                      <Button size="sm" variant="outline" onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))}>❌</Button>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                      <Button variant="outline" onClick={() => setIngredients([...ingredients, { id: `ing-${ingredients.length+1}`, name: "", quantity: "" }])}>+ Add Ingredient</Button>
                    </TabsContent>

                    {/* Steps */}
                    <TabsContent value="steps" className="space-y-3">
                      <DragDropContext onDragEnd={(res) => onDragEnd(res, "steps")}>
                        <Droppable droppableId="steps">
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                              {steps.map((s, i) => (
                                <Draggable key={s.id} draggableId={s.id} index={i}>
                                  {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="flex gap-3 items-center bg-gray-50 p-2 rounded-md shadow-sm">
                                      <Textarea placeholder={`Step ${i + 1}`} value={s.instruction} onChange={(e) => {
                                        const updated = [...steps];
                                        updated[i].instruction = e.target.value;
                                        setSteps(updated);
                                      }} />
                                      <Button size="sm" variant="outline" onClick={() => setSteps(steps.filter((_, idx) => idx !== i))}>❌</Button>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                      <Button variant="outline" onClick={() => setSteps([...steps, { id: `step-${steps.length+1}`, instruction: "" }])}>+ Add Step</Button>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Right: Image & Submit */}
                <div className="md:w-80 mt-6 md:mt-0 flex flex-col gap-4">
                  <Input type="file" accept="image/*" onChange={handleFileChange} />
                  {preview && <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-xl shadow-md border" />}
                  <Button className="mt-auto" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Saving..." : id ? "Update Recipe" : "Publish Recipe"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}