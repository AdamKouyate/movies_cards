import React, { useEffect, useState } from "react";
import { movies$ } from "./movies";

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    movies$.then(movies => {
      const uniqueCategories = [...new Set(movies.map(movie => movie.category))];
      setCategories(uniqueCategories);
      setMovies(movies);
    });
  }, []);

  const handleDelete = id => {
    setMovies(movies.filter(movie => movie.id !== id));
    setCategories(categories.filter(category => !movies.find(movie => movie.category === category)));
  };

  const handleToggle = id => {
    const updatedMovies = movies.map(movie => {
      if (movie.id === id) {
        if (movie.isLiked) {
          movie.likes = movie.likes - 1;
          movie.dislikes = movie.dislikes + 1;
          movie.isLiked = false;
        } else {
          movie.likes = movie.likes + 1;
          movie.dislikes = movie.dislikes - 1;
          movie.isLiked = true;
        }
      }
      return movie;
    });
    setMovies(updatedMovies);
  };

  const handleCategoryFilter = event => {
    const selectedCategories = Array.from(event.target.selectedOptions, option => option.value);
    setMovies(movies.filter(movie => selectedCategories.includes(movie.category)));
    setCurrentPage(1);
  };

  //function to handle page change
  const handlePageChange = pageNumber => setCurrentPage(pageNumber);

  //function to handle items per page change
  const handleItemsPerPageChange = event => setItemsPerPage(event.target.value);

  // get current movies
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMovies = movies.slice(indexOfFirstItem, indexOfLastItem);

  //pagination logic
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(movies.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <select multiple id="category-select" onChange={handleCategoryFilter}>
        {categories.map(category =>
    (
    <option key={category} value={category}>
    {category}
    </option>
    ))}
    </select>
    <div className="cards-container">
    {currentMovies.map(movie => (
    <div key={movie.id} className="card">
    <h3>{movie.title}</h3>
    <p>Category: {movie.category}</p>
    <div>
    <progress
    max="100"
    value={(movie.likes / (movie.likes + movie.dislikes)) * 100}
    />
    <button onClick={() => handleToggle(movie.id)}>
    {movie.isLiked ? "Unlike" : "Like"}
    </button>
    <button onClick={() => handleDelete(movie.id)}>Delete</button>
    </div>
    </div>
    ))}
    </div>
    <div>
    <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
    <option value={4}>4</option>
    <option value={8}>8</option>
    <option value={12}>12</option>
    </select>
    <ul className="pagination">
    <button className={`${currentPage === 1 ? "disabled" : ""}`} onClick={() => handlePageChange(currentPage - 1)}>
      {" "}
      Previous{" "}
    </button>
    {pageNumbers.map(number => (
      <li
        key={number}
        className={`${currentPage === number ? "active" : ""}`}
        onClick={() => handlePageChange(number)}
      >
        {" "}
        {number}{" "}
      </li>
    ))}
    <button className={`${currentPage === pageNumbers.length ? "disabled" : ""}`} onClick={() => handlePageChange(currentPage + 1)}>
      {" "}
      Next{" "}
    </button>
  </ul>
</div>
</>
);
};

export default MoviesList;