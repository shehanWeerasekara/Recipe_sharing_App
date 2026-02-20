import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import API from "../../services/api";

export default function RecipeDetail() {
  const router=useRouter();
  const {id}=router.query;
  const [recipe,setRecipe]=useState(null);

  useEffect(()=>{
    if(id) API.get(`/recipes/${id}`).then(res=>setRecipe(res.data)).catch(console.log);
  },[id]);

  if(!recipe) return <p>Loading...</p>;

  return <>
    <Navbar/>
    <div className="max-w-2xl mx-auto mt-6 px-4">
      <h1 className="text-3xl font-bold">{recipe.title}</h1>
      <p className="mt-2">{recipe.description}</p>
      <p className="mt-1 text-gray-500">Cuisine: {recipe.cuisine} | Difficulty: {recipe.difficulty}</p>
      <h2 className="text-xl font-bold mt-4">Ingredients</h2>
      <ul className="list-disc ml-5">{recipe.ingredients?.map(i=><li key={i.id}>{i.quantity} {i.name}</li>)}</ul>
      <h2 className="text-xl font-bold mt-4">Steps</h2>
      <ol className="list-decimal ml-5">{recipe.steps?.map(s=><li key={s.id}>{s.instruction}</li>)}</ol>
    </div>
  </>;
}
