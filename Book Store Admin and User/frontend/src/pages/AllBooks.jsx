import React, { useEffect, useState } from "react";
import BookCard from "../components/Books/BookCard";
import axios from "axios";
import Loader from "./Loader";

const AllBooks = () => {
  // State for storing all books fetched from the API
  const [Books, setBooks] = useState(null);

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);

    // Fetch all books from the backend
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-all-books"
        );
        setBooks(response.data.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="bg-zinc-900 px-4 md:px-12 py-8 text-white min-h-screen">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-100">
            All Our Books
          </h1>
          <p className="text-lg text-zinc-400 mt-2 max-w-2xl mx-auto">
            Explore our curated collection of books and find your next great read.
          </p>
        </div>

        {/* Content Area: Loader, No Books, or Book Grid */}
        <div>
          {!Books && (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          )}

          {Books && Books.length === 0 && (
            <div className="text-center text-zinc-400 text-xl py-12">
              <p>No books are available at the moment.</p>
            </div>
          )}

          {Books && Books.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {Books.map((book, i) => (
                <div key={i} className="flex justify-center">
                  <BookCard
                    bookid={book._id}
                    image={book.url}
                    title={book.title}
                    author={book.author}
                    price={book.price}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBooks;
