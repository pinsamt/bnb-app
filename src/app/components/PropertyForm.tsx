"use client"
import React, { useState } from 'react';
import { useUser } from '@/app/context/UserContext';

const PropertyForm: React.FC = () => {
  const { user } = useUser();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(0);
  const [available, setAvailable] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/property', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ name, desc, location, price, available, ownerId: user?.id }), 
    });
  
    if (response.ok) {
      alert('Property created successfully!');
    } else {
      alert('You must be logged in to create a property');
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Create a New Property</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">Property Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Property Name"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-600 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="desc" className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-600 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium text-gray-700">Location</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-600 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium text-gray-700">Price Per Night</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Price"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-600 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="available"
            type="checkbox"
            checked={available}
            onChange={() => setAvailable(!available)}
            className="h-4 w-4 text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="available" className="text-sm text-gray-700">Available</label>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Create Property
        </button>
      </form>
    </div>
  );
};

export default PropertyForm;
