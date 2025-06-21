import { Link } from "react-router-dom";
import { useState } from "react";
import logo from '../assets/meditrack-logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-dark-teal text-white px-6 py-4 flex justify-between items-center w-full fixed top-0 z-50">
      <div className="flex items-center space-x-2 sm:ml-2 md:ml-5 lg:ml-10">
        <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex-center space-x-2">
            <img src={logo} alt="logo" width={40} />
            <h1 className="text-2xl font-bold font-poppins">
                <span className="text-aquamarine">Medi</span>
                <span className="text-lightblue">Track</span>
            </h1>
        </Link>
      </div>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 items-center lg:mr-10 md:mr-5 sm:mr-2">
        <a href="#about" className="hover:underline">About Us</a>
        <a href="#helps" className="hover:underline">How it Helps</a>
        <a href="#contact" className="hover:underline">Contact</a>
        <Link to="/login" className="link">
          Login Now
        </Link>
      </div>

      {/* Hamburger button (visible on mobile) */}
      <button
        className="md:hidden text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#256b67] text-white flex flex-col space-y-4 p-4 md:hidden">
          <a href="#about" className="hover:underline" onClick={() => setIsOpen(false)}>About Us</a>
          <a href="#helps" className="hover:underline" onClick={() => setIsOpen(false)}>How it Helps</a>
          <a href="#contact" className="hover:underline" onClick={() => setIsOpen(false)}>Contact</a>
          <Link
            to="/login"
            className="bg-lightblue text-dark-teal px-4 py-2 rounded hover:bg-aquamarine font-semibold text-center"
            onClick={() => setIsOpen(false)}
          >
            Login Now
          </Link>
        </div>
      )}
    </nav>
  );
}