import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";
import API from "../services/api";
import { toast } from "react-toastify";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("follower");
  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !email || !password) return alert("Fill all fields");

    try {
      await API.post("/register", { username, email, password, role });
      toast.success("Registered successfully!");
      router.push("/login");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Registration failed");
    }
  };

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
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded shadow p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
            <input type="text" placeholder="Username" className="w-full border p-2 mb-3 rounded" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="email" placeholder="Email" className="w-full border p-2 mb-3 rounded" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full border p-2 mb-3 rounded" value={password} onChange={e => setPassword(e.target.value)} />

            <div className="mb-4">
              <label className="mr-4">
                <input type="radio" value="follower" checked={role === "follower"} onChange={e => setRole(e.target.value)} className="mr-1" /> Follower
              </label>
              <label>
                <input type="radio" value="creator" checked={role === "creator"} onChange={e => setRole(e.target.value)} className="mr-1" /> Creator
              </label>
            </div>

            <button onClick={handleRegister} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">Register</button>
          </div>
        </div>
      </div>

    </>
  );
}
