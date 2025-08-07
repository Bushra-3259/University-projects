import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const links = [
    { title: "Home", link: "/" },
    { title: "About Us", link: "/about-us" },
    { title: "All Books", link: "/all-books" },
    { title: "Cart", link: "/cart" },
  ];

  return (
    <footer className="bg-zinc-900 text-white py-10 px-4 md:px-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-1">
          <h2 className="text-3xl font-bold text-yellow-100">BookHeaven</h2>
          <p className="text-zinc-400 mt-4">
            Your personal sanctuary for discovering captivating stories and enriching knowledge.
          </p>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {links.map((item, i) => (
              <li key={i}>
                <Link
                  to={item.link}
                  className="text-zinc-400 hover:text-yellow-100 transition-colors duration-300"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Us Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-zinc-400">International Islamic University Chittagong</p>
          <p className="text-zinc-400">Bangladesh</p>
          <p className="text-zinc-400 mt-2">info@bookheaven.com</p>
        </div>

        {/* Social Media Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-zinc-400 hover:text-yellow-100 transition-colors duration-300">
              <FaFacebook size={24} />
            </a>
            <a href="#" className="text-zinc-400 hover:text-yellow-100 transition-colors duration-300">
              <FaTwitter size={24} />
            </a>
            <a href="#" className="text-zinc-400 hover:text-yellow-100 transition-colors duration-300">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
        <p className="text-zinc-500">
          © {new Date().getFullYear()} BookHeaven. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;