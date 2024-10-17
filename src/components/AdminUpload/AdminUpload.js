// src/components/AdminUpload/AdminUpload.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminUpload.css';

function AdminUpload() {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Fetch categories on component mount
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !imageFile) {
      toast.error('Please provide all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', imageFile);

    setUploading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
        },
      });

      toast.success(res.data.msg);
      // Reset form
      setTitle('');
      setCategory('');
      setImageFile(null);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        toast.error(err.response.data.msg);
      } else if (err.response && err.response.data && err.response.data.errors) {
        // Handle validation errors
        err.response.data.errors.forEach(error => toast.error(error.msg));
      } else {
        toast.error('Failed to upload image');
      }
      console.error('Error uploading image:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-upload-container">
      <h2>Upload New Image</h2>
      <form onSubmit={handleSubmit} className="admin-upload-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter image title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
          />
        </div>

        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>
    </div>
  );
}

export default AdminUpload;
