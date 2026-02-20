import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";
import API from "../services/api";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return alert("Please fill all fields");

    try {
      const res = await API.post("/login", { email: email.trim(), password: password.trim() });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role || "follower");
      toast.success("Login successful!");
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid credentials");
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
        <div className="max-w-md w-full bg-white rounded shadow p-6 justify-center ">
          <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
          <input type="email" placeholder="Email" className="w-full border p-3 mb-3 rounded" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full border p-3 mb-3 rounded" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={handleLogin} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">Login</button>
          <p className="mt-4 text-gray-700 text-sm text-center">
            Don't have an account?{" "}
            <span className="text-green-600 cursor-pointer hover:underline" onClick={() => router.push("/register")}>Register here</span>
          </p>
        </div>
      </div>
      </div>
      
    </>
  );
}
