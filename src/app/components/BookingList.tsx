"use client";
import React, { useEffect, useState } from 'react';

interface Booking {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: string;
  madeBy: {
    name: string;
    email: string
  };
  property: {
    name: string;
  };
}

const BookingsList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const response = await fetch('/api/booking', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        console.error('Failed to fetch bookings:', response.statusText);
      }
    };

    fetchBookings();
  }, []);


  return (
<div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-700">Bookings</h1>
      <ul className="space-y-6">
        {bookings.map((booking) => (
          <li key={booking.id} className="bg-white shadow-lg rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Booking ID: {booking.id}</h2>
            <p className="font-medium text-gray-700"><strong >Property:</strong> {booking.property.name}</p>
            <p className="font-medium text-gray-700"><strong >Total Price:</strong> {booking.totalPrice} $</p>
            <p className="font-medium text-gray-700"><strong >Your Username:</strong> {booking.madeBy.name}</p>
            <p className="font-medium text-gray-700"><strong >Your Email:</strong> {booking.madeBy.email}</p>
            <p className="font-medium text-gray-700"><strong >Booking Date: </strong> 
              {`${new Date(booking.checkInDate).toLocaleDateString()} to ${new Date(booking.checkOutDate).toLocaleDateString()}`}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingsList;
