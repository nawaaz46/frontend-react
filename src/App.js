import React, { useState, useEffect } from 'react';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [numAdults, setNumAdults] = useState(1);
  const [numKids, setNumKids] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookedRoomId, setBookedRoomId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/rooms')
      .then(response => setRooms(response.data))
      .catch(error => console.error('Error fetching rooms:', error));
  }, []);

  const handleBookRoom = () => {
    if (selectedRoom && userName && email && mobileNumber) {
      axios.post('http://localhost:5000/api/bookings', {
        room_id: selectedRoom,
        user_name: userName,
        email: email,
        mobile_number: mobileNumber,
        num_adults: numAdults,
        num_kids: numKids,
      })
        .then(response => {
          const roomId = response.data.room_id;
          setBookedRoomId(roomId);
          setBookingSuccess(true);
          console.log(response.data.message);
        })
        .catch(error => {
          console.error('Error booking room:', error);
          setBookingSuccess(false);
        });
    } else {
      console.error('Please fill in all required fields');
      setBookingSuccess(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Room Booking App</h1>
      <div className="row">
        <div className="col-md-4">
          <label htmlFor="rooms" className="form-label">Select a room:</label>
          <select id="rooms" className="form-select" onChange={(e) => setSelectedRoom(e.target.value)}>
            <option value="">Select</option>
            {rooms.map(room => (
              <option key={room[0]} value={room[0]}>
                {room[1]}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label htmlFor="userName" className="form-label">Your Name:</label>
          <input type="text" className="form-control" id="userName" onChange={(e) => setUserName(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label htmlFor="email" className="form-label">Email:</label>
          <input type="email" className="form-control" id="email" onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-4">
          <label htmlFor="mobileNumber" className="form-label">Mobile Number:</label>
          <input type="tel" className="form-control" id="mobileNumber" onChange={(e) => setMobileNumber(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label htmlFor="numAdults" className="form-label">Number of Adults:</label>
          <input type="number" className="form-control" id="numAdults" min="1" value={numAdults} onChange={(e) => setNumAdults(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label htmlFor="numKids" className="form-label">Number of Kids:</label>
          <input type="number" className="form-control" id="numKids" min="0" value={numKids} onChange={(e) => setNumKids(e.target.value)} />
        </div>
      </div>
      <div className="mt-3">
        <button className="btn btn-primary" onClick={handleBookRoom}>Book Room</button>
      </div>
      {bookingSuccess && (
        <p className="mt-3">Room successfully booked! Room ID: {bookedRoomId}</p>
      )}
    </div>
  );
}

export default App;
