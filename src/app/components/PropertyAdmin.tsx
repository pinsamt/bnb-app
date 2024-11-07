"use client"
import React, { useEffect, useState } from 'react';
import { useUser } from '@/app/context/UserContext';

interface Property {
  id: string;
  name: string;
  desc: string;
  location: string;
  price: number;
  available: boolean;
}

const PropertyAdmin: React.FC = () => {
  const { user } = useUser();
  const [properties, setProperties] = useState<Property[]>([]);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editedProperty, setEditedProperty] = useState<Partial<Property>>({});

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await fetch('/api/property');
      const data = await response.json();
      setProperties(data);
    };

    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this property?');
    if (confirmDelete) {
      const response = await fetch(`/api/property/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        alert('Property deleted successfully!');
        setProperties(properties.filter(property => property.id !== id));
      } else {
        alert('No Permission.');
      }
    }
  };

  const handleEditToggle = (id: string) => {
    setEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
    if (editMode[id]) {
      setEditedProperty({});
    }
  };

  const handleChange = (id: string, field: keyof Property, value: any) => {
    setEditedProperty((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (id: string) => {
    const response = await fetch(`/api/property/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        ...editedProperty,
      }),
    });

    if (response.ok) {
      alert('Property updated successfully!');
      setProperties((prev) => 
        prev.map((property) => (property.id === id ? { ...property, ...editedProperty } : property))
      );
      handleEditToggle(id); 
    } else {
      alert('No permission.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Manage Properties</h1>
      <ul className="space-y-6">
        {properties.map((property) => (
          <li key={property.id} className="bg-white shadow-lg rounded-lg p-6 space-y-4 border-b">
            <div className="space-y-4">
              {editMode[property.id] ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor={`name-${property.id}`} className="text-sm font-medium text-gray-700">Property Name</label>
                    <input
                      id={`name-${property.id}`}
                      type="text"
                      defaultValue={property.name}
                      onChange={(e) => handleChange(property.id, 'name', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`desc-${property.id}`} className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id={`desc-${property.id}`}
                      defaultValue={property.desc}
                      onChange={(e) => handleChange(property.id, 'desc', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`location-${property.id}`} className="text-sm font-medium text-gray-700">Location</label>
                    <input
                      id={`location-${property.id}`}
                      type="text"
                      defaultValue={property.location}
                      onChange={(e) => handleChange(property.id, 'location', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none text-gray-600 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`price-${property.id}`} className="text-sm font-medium text-gray-700">Price</label>
                    <input
                      id={`price-${property.id}`}
                      type="number"
                      defaultValue={property.price}
                      onChange={(e) => handleChange(property.id, 'price', Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none text-gray-600 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      id={`available-${property.id}`}
                      type="checkbox"
                      defaultChecked={property.available}
                      onChange={(e) => handleChange(property.id, 'available', e.target.checked)}
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                    />
                    <label htmlFor={`available-${property.id}`} className="text-sm text-gray-700">Available</label>
                  </div>

                  <button
                    onClick={() => handleSave(property.id)}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-800">{property.name}</h2>
                  <p className="text-gray-600">{property.desc}</p>
                  <p className="text-gray-600"><strong>Price:</strong> ${property.price} per night</p>
                  <p className="text-gray-600"><strong>Location:</strong> {property.location}</p>
                  <p className="text-gray-600"><strong>Status:</strong> {property.available ? 'Available' : 'Unavailable'}</p>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleEditToggle(property.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                {editMode[property.id] ? 'Cancel' : 'Edit'}
              </button>
              <button
                onClick={() => handleDelete(property.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyAdmin;
