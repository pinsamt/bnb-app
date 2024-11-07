import React, { useState, useEffect } from 'react';
import { useUser } from '@/app/context/UserContext';

const BookingForm: React.FC<{ propertyId: string; propertyPrice: number }> = ({ propertyId, propertyPrice }) => {
  const { user } = useUser();
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const calculateNights = () => {
      if (checkInDate && checkOutDate) {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const differenceInTime = checkOut.getTime() - checkIn.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        setNights(differenceInDays > 0 ? differenceInDays : 0);
        setTotalPrice(differenceInDays > 0 ? propertyPrice * differenceInDays : 0);
      }
    };

    calculateNights();
  }, [checkInDate, checkOutDate, propertyPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to create a booking.');
      return;
    }

    const response = await fetch('/api/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ checkInDate, checkOutDate, nights, totalPrice, propertyId }),
    });

    if (response.ok) {
      alert('Booking created successfully!');
    } else {
      alert('Failed to create booking.');
    }
  };

  const handleDateChange = () => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const difference = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24));
    setNights(difference);
    setTotalPrice(difference * propertyPrice);
  };

  return (
<form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Booking Details</h2>
      
      <div className="flex flex-col space-y-2">
        <label htmlFor="checkIn" className="text-sm font-medium text-gray-700">Check-In Date</label>
        <input
          type="date"
          id="checkIn"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          onBlur={handleDateChange}
          required
          max={checkOutDate}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none text-gray-600 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="checkOut" className="text-sm font-medium text-gray-700">Check-Out Date</label>
        <input
          type="date"
          id="checkOut"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          onBlur={handleDateChange}
          min={checkInDate}
          required
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-600 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <p>Nights: {nights}</p>
        <p>Total Price: ${totalPrice.toFixed(2)}</p>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Book Now
      </button>
    </form>
  );
};

export default BookingForm;
