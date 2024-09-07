const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let availableSlots = {
    '2024-09-07': [
        { time: '10:00 AM', booked: false },
        { time: '10:30 AM', booked: false },
        { time: '11:00 AM', booked: false },
        { time: '11:30 AM', booked: false },
        { time: '12:00 PM', booked: false },
        { time: '12:30 PM', booked: false },
    ],
    '2024-09-08': [
        { time: '12:00 PM', booked: false },
        { time: '12:30 PM', booked: false },
        { time: '01:00 PM', booked: false },
        { time: '01:30 PM', booked: false },
        { time: '02:00 PM', booked: false },
        { time: '02:30 PM', booked: false },
        
    ],
    '2024-09-09': [
        { time: '10:30 AM', booked: false },
        { time: '11:00 AM', booked: false },
        { time: '11:30 AM', booked: false },
        { time: '12:00 PM', booked: false },
        { time: '12:30 PM', booked: false },
        { time: '01:00 PM', booked: false },
        { time: '01:30 PM', booked: false },
    ]
};

app.get('/slots', (req, res) => {
    const { date } = req.query;
    if (!date) {
        return res.status(400).json({message: 'Date is required.' });
    }
    const slots = availableSlots?.[date];
    res.json(slots);
});
app.get('/slots/available', (req, res) => {
    const { date } = req.query;
    if (!date) {
        return res.status(400).json({ message: 'Date is required.' });
    }
    const slots = availableSlots?.[date]?.filter(slot => !slot.booked);
    res.json(slots);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));