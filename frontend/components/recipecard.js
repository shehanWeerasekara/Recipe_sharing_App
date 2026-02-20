import Link from "next/link";

export default function RecipeCard({ recipe }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">

      {/* Image */}
      {recipe.image && (
        <img
          src={`http://localhost:8002/${recipe.image}`}
          alt={recipe.title}
          className="w-full h-52 object-cover"
        />
      )}

      {/* Content */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {recipe.title}
        </h2>

        <p className="text-gray-500 mt-3 text-sm line-clamp-3">
          {recipe.description}
        </p>

        <Link
          href={`/recipes/${recipe.id}`}
          className="inline-block mt-5 text-green-600 font-semibold hover:text-green-800 transition"
        >
          View Recipe →
        </Link>
      </div>

    </div>
  );
}
