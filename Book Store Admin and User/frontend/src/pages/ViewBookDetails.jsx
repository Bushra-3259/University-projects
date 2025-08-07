import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCartShopping } from "react-icons/fa6";
import { GoHeartFill } from "react-icons/go";
import { GrLanguage } from "react-icons/gr";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Loader from "./Loader";

const ViewBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [Book, setBook] = useState();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBook = async () => {
      try {
        const res = await axios.get(
          `http://localhost:1000/api/v1/get-book-by-id/${id}`
        );
        setBook(res.data.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };
    fetchBook();
  }, [id]);

  const headers = {
    bookid: id,
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Function to show a notification message and have it fade out
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleFavourite = async () => {
    if (!isLoggedIn) {
      showNotification("Please log in to add to favourites.");
      return;
    }
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/add-to-favourite",
        {},
        { headers }
      );
      showNotification(response.data.message);
    } catch (error) {
      showNotification("An error occurred. Please try again.");
      console.log(error);
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      showNotification("Please log in to add to cart.");
      return;
    }
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/add-to-cart",
        {},
        { headers }
      );
      showNotification(response.data.message);
    } catch (error) {
      showNotification("An error occurred. Please try again.");
      console.log(error);
    }
  };

  const handleDeleteBook = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:1000/api/v1/delete-book",
        { headers }
      );
      showNotification(response.data.message);
      navigate("/all-books");
    } catch (error) {
      showNotification("An error occurred. Please try again.");
      console.log(error);
    }
  };

  return (
    <>
      {/* Notification Popup */}
      {notification && (
        <div className="fixed top-20 right-5 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out z-50">
          {notification}
        </div>
      )}

      {!Book && (
        <div className="h-screen bg-zinc-900 flex items-center justify-center">
          <Loader />
        </div>
      )}

      {Book && (
        <div className="bg-zinc-900 px-4 md:px-12 py-8 text-white min-h-screen">
          <div className="container mx-auto flex flex-col lg:flex-row items-start gap-8">
            {/* Left Side: Book Image and Action Buttons */}
            <div className="w-full lg:w-1/3 lg:sticky top-24">
              <div className="bg-zinc-800 p-4 rounded-lg flex flex-col items-center shadow-lg">
                <img
                  src={Book.url}
                  alt={Book.title}
                  className="h-auto max-h-[60vh] w-full object-contain rounded"
                />
                <div className="w-full mt-4">
                  {isLoggedIn && role !== "admin" && (
                    <div className="flex flex-col gap-4">
                      <button
                        onClick={handleFavourite}
                        className="w-full flex items-center justify-center gap-2 bg-white text-zinc-900 font-semibold py-3 rounded hover:bg-zinc-200 transition-all duration-300"
                      >
                        <GoHeartFill /> Add to Favourites
                      </button>
                      <button
                        onClick={handleAddToCart}
                        className="w-full flex items-center justify-center gap-2 bg-yellow-100 text-zinc-900 font-semibold py-3 rounded hover:bg-yellow-200 transition-all duration-300"
                      >
                        <FaCartShopping /> Add to Cart
                      </button>
                    </div>
                  )}
                  {isLoggedIn && role === "admin" && (
                    <div className="flex flex-col gap-4">
                      <Link
                        to={`/update-book/${id}`}
                        className="w-full text-center flex items-center justify-center gap-2 bg-white text-zinc-900 font-semibold py-3 rounded hover:bg-zinc-200 transition-all duration-300"
                      >
                        <FaRegEdit /> Edit Book
                      </Link>
                      <button
                        onClick={handleDeleteBook}
                        className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-semibold py-3 rounded hover:bg-red-600 transition-all duration-300"
                      >
                        <MdDelete /> Delete Book
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Book Details */}
            <div className="w-full lg:w-2/3">
              <h1 className="text-4xl text-zinc-100 font-bold">{Book.title}</h1>
              <p className="text-zinc-400 mt-2 text-lg">by {Book.author}</p>
              
              <div className="mt-6 text-3xl text-yellow-100 font-semibold">
                ৳ {Book.price}
              </div>

              <div className="flex mt-4 items-center text-zinc-400">
                <GrLanguage className="mr-2" /> {Book.language}
              </div>

              <div className="mt-8 border-t border-zinc-700 pt-6">
                <h2 className="text-2xl font-semibold text-zinc-100 mb-2">Description</h2>
                <p className="text-zinc-400 leading-relaxed">{Book.desc}</p>
              </div>
              
               <div className="mt-8">
                    <Link to="/all-books" className="text-yellow-100 hover:underline">
                        &larr; Back to All Books
                    </Link>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewBookDetails;
