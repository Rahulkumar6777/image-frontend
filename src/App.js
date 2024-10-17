import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import FilterButtons from './components/FilterButtons/FilterButtons';
import WallpapersGrid from './components/WallpapersGrid/WallpapersGrid';
import Footer from './components/Footer/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

function App() {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(true); // To check if more images are available
  const [page, setPage] = useState(1); // For pagination
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/categories`);
        setCategories(res.data.map(cat => cat.name));
      } catch (err) {
        toast.error('Failed to fetch categories');
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch images based on category and search term
  const fetchImages = async (category, search, pageNumber) => {
    if (loading || !hasMore) return; // If currently loading or no more images, do not fetch

    setLoading(true);
    try {
      let endpoint = `${process.env.REACT_APP_BACKEND_URL}/images`;
      let params = {
        page: pageNumber,
        limit: 10,
      };

      if (category && category !== '') {
        params.category = category;
      }

      if (search && search !== '') {
        params.search = search;
      }

      const res = await axios.get(endpoint, { params });

      if (res.data.length === 0) {
        setHasMore(false);  // No more images available
      } else {
        setImages((prevImages) => {
          const newImages = res.data.filter(
            (img) => !prevImages.some((prevImg) => prevImg._id === img._id)
          );
          return [...prevImages, ...newImages];  // Add new images to existing
        });
        setPage((prevPage) => prevPage + 1);  // Increment page after fetching
      }
    } catch (err) {
      toast.error('Failed to fetch images');
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset images when category or search term changes
  useEffect(() => {
    setImages([]); // Clear current images
    setPage(1);    // Reset to first page
    setHasMore(true);  // Allow more images to be loaded
    fetchImages(activeCategory, searchTerm, 1); // Fetch first page of images
  }, [activeCategory, searchTerm]);

  // Infinite scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 500 &&
        hasMore &&
        !loading
      ) {
        const nextPage = page + 1;
        fetchImages(activeCategory, searchTerm, nextPage);  // Fetch next page
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, hasMore, loading, activeCategory, searchTerm]);

  const handleCategoryChange = (category) => {
    if (category === activeCategory) {
      setPage((prevPage) => prevPage + 1);
      fetchImages(category, searchTerm, page + 1);  // Load more images (next page)
    } else {
      setImages([]); // Clear current images
      setPage(1);    // Reset to first page
      setHasMore(true);  // Allow more images to be loaded
      setActiveCategory(category);  // Set the new category
      setSearchTerm('');  // Clear search term
    }
  };

  const handleSearch = (term) => {
    setImages([]); // Clear current images
    setPage(1);    // Reset to first page
    setHasMore(true);  // Allow more images to be loaded
    setSearchTerm(term);
    setActiveCategory(''); // Clear active category
  };

  const handleFilterSelect = (category) => {
    setImages([]); // Clear current images
    setPage(1);    // Reset to first page
    setHasMore(true);  // Allow more images to be loaded
    setActiveCategory(category);  // Set new category filter
    setSearchTerm('');  // Clear search term
  };

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <div>
              <Header onSearch={handleSearch} />
              <div className="container">
                <FilterButtons
                  categories={categories}
                  activeCategory={activeCategory}
                  onFilterSelect={handleFilterSelect} // This is still for the "All" button
                  onCategoryChange={handleCategoryChange} // This is for category filtering
                />
                <WallpapersGrid images={images} />
                {loading && (
                  <div style={{ textAlign: 'center', margin: '20px' }}>
                    <ClipLoader color="#A1BE95" loading={loading} size={50} />
                  </div>
                )}
                {!hasMore && <p style={{ textAlign: 'center' }}>No more images</p>}
              </div>
              <Footer />
              <ToastContainer />
            </div>
          }
        />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
