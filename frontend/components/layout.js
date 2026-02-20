// components/Layout.js
import Navbar from "./navbar";

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Fixed Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/cooking.mp4" type="video/mp4" />
      </video>

      {/* Overlay for readability */}
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-0"></div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
}
