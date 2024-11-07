"use client";
import React, { useEffect, useState } from 'react';
import BookingForm from '../components/BookingForm';
import Image from 'next/image';

interface Property {
  id: string;
  name: string;
  desc: string;
  location: string;
  price: number;
  available: boolean;
  ownerId: string;
}

const PropertiesList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await fetch('/api/property', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      } else {
        console.error('Failed to fetch properties:', response.statusText);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-700">Properties</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <div key={property.id} className="bg-white shadow-lg rounded-lg">
            <div className="relative">
              <Image
                src="/images/house.jpg"
                alt={`Image of ${property.name}`}
                width={400}
                height={250}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-600">{property.name}</h2>
              <h3 className="text-lg text-gray-600 mt-2">Price: ${property.price} per night</h3>
              <p className="text-lg text-gray-600 mt-2">Location: {property.location}</p>
              <p className="text-gray-600 mt-4">{property.desc}</p>
              <BookingForm propertyId={property.id} propertyPrice={property.price} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertiesList;

