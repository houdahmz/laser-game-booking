import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

Modal.setAppElement('#root');

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f4f4f9;
  height: 100vh;
`;

const Title = styled.h1`
  color: #333;
`;

const SlotList = styled.ul`
  list-style: none;
  padding: 0;
`;

const SlotItem = styled.li`
  background-color: ${({ booked }) => (booked ? '#ddd' : 'rgb(44, 165, 141)')};
  padding: 10px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  width: 300px;
  color: ${({ booked }) => (booked ? '#999' : '#fff')};
  font-weight: ${({ booked }) => (booked ? 'normal' : 'bold')};
`;

const Button = styled.button`
  background-color: #0cdd9c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 5px;
  border: 1px solid ${({ hasError }) => (hasError ? 'red' : '#ccc')};
  border-radius: 5px;
  width: 100%;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin: 0;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const NoSlotsMessage = styled.p`
  color: #666;
  font-size: 14px;
  text-align: center;
`;

function App() {
  const [slots, setSlots] = useState([]);
  const [name, setName] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    axios.get(`http://localhost:5000/slots/available?date=${dateStr}`)
      .then(response => setSlots(response.data))
      .catch(error => console.error('Error fetching slots:', error));
  }, [selectedDate]);

  const handleBooking = () => {
    if (!name) {
      setNameError(true);
      return;
    }

    const dateStr = selectedDate.toISOString().split('T')[0];
    axios.post('http://localhost:5000/book', { date: dateStr, time: selectedSlot, name })
      .then(response => {
        setConfirmationMessage(response.data.message);
        setSlots(slots.filter(slot => slot.time !== selectedSlot));
        setIsBookingModalOpen(false); // Close the booking modal
        setIsConfirmationModalOpen(true); // Show the confirmation modal
      })
      .catch(error => setConfirmationMessage(error.response.data.message))
      .finally(() => setIsBookingModalOpen(false)); // Ensure the booking modal is closed
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedSlot(null);
    setName('');
    setNameError(false);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setConfirmationMessage('');
    setSelectedSlot(null);
    setName('');
    setNameError(false);
  };

  return (
    <AppContainer>
      <Title>Laser Game Booking</Title>
      <DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        dateFormat="yyyy-MM-dd"
        minDate={new Date()}
      />
      <SlotList>
        {slots.length === 0 ? (
          <NoSlotsMessage>No available slots for this date.</NoSlotsMessage>
        ) : (
          slots.map(slot => (
            <SlotItem key={slot.time} booked={slot.booked}>
              {slot.time} - Available
              <Button onClick={() => {
                setSelectedSlot(slot.time);
                setIsBookingModalOpen(true);
              }}>Select</Button>
            </SlotItem>
          ))
        )}
      </SlotList>

      {selectedSlot && (
        <Modal
          isOpen={isBookingModalOpen}
          onRequestClose={closeBookingModal}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              padding: '20px',
              borderRadius: '10px',
              width: '300px',
              textAlign: 'center',
            },
          }}
        >
          <ModalContent>
            <h2>Selected Slot: {selectedSlot}</h2>
            <Input
              type="text"
              placeholder="Your Name"
              value={name}
              hasError={nameError}
              onChange={e => {
                setName(e.target.value);
                if (e.target.value) setNameError(false);
              }}
            />
            {nameError && <ErrorMessage>Name is required.</ErrorMessage>}
            <Button onClick={handleBooking}>Book Slot</Button>
            <Button onClick={closeBookingModal}>Cancel</Button>
          </ModalContent>
        </Modal>
      )}

      <Modal
        isOpen={isConfirmationModalOpen}
        onRequestClose={closeConfirmationModal}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            borderRadius: '10px',
            width: '300px',
            textAlign: 'center',
          },
        }}
      >
        <ModalContent>
          <p>{confirmationMessage}</p>
          <Button onClick={closeConfirmationModal}>Close</Button>
        </ModalContent>
      </Modal>
    </AppContainer>
  );
}

export default App;
