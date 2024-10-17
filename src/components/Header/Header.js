import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';

function Header({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  const navigate = useNavigate();

  // Update debounced term after a delay (e.g., 500ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Trigger search when debounced term changes
  useEffect(() => {
    onSearch(debouncedTerm);
    // eslint-disable-next-line
  }, [debouncedTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    navigate('/'); // Redirect to home after search
  };

  // Handle login button click
  const handleLoginClick = () => {
    window.location.href = 'http://localhost:3000/admin'; // Redirect to admin page
  };

  return (
    <header>
      <div className="container">
        <Link to="/" className="logo">4K WALLPAPERS</Link>
        <div className="search-bar">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" id="search-button">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
        <button
          className="onlyadminloginbutton"
          onClick={handleLoginClick}
        >
          Login
        </button>
      </div>
    </header>
  );
}

export default Header;
