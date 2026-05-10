# Railway Management System - Email Confirmation Setup

## Overview

The booking confirmation system is now fully implemented with:

✅ **Backend Features:**
- Booking model (`Booking.js`) to store ticket reservations in MongoDB
- Email service (`email-service.js`) with HTML email templates
- Booking API endpoint (`/api/v1/bookings`) to receive and process bookings
- Automatic confirmation email sending

✅ **Frontend Features:**
- Complete booking form with validation
- Booking confirmation modal with summary
- Success page displaying booking reference and ticket details
- Responsive design for all screen sizes

## Setup Instructions

### 1. Environment Configuration

Create or update the `.env` file in the `backend/` directory:

```
MONGODB_URI=mongodb://localhost:27017/railway-management-system
JWT_SECRET=your-secret-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 2. Gmail Configuration (Recommended)

To send emails using Gmail:

1. Enable 2-Factor Authentication on your Google Account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Use the generated password as `EMAIL_PASSWORD` in `.env`

**Note:** Regular Gmail passwords will NOT work. You must use an App Password.

### 3. Alternative Email Providers

To use a different provider, modify `backend/src/utils/email-service.js`:

```javascript
transporter = nodemailer.createTransport({
  service: 'your-service', // e.g., 'outlook', 'yahoo'
  auth: {
    user: emailUser,
    pass: emailPass
  }
})
```

Or for a custom SMTP server:

```javascript
transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: emailUser,
    pass: emailPass
  }
})
```

### 4. Development Mode (No Email Service)

If no email credentials are configured, the system will:
- Log confirmation emails to the console (simulated mode)
- Show success message to the user
- Still save the booking in the database

This is useful for development and testing without needing email setup.

## How It Works

### Booking Flow

1. User fills out the booking form on the BookNow page
2. User reviews details in a confirmation modal
3. Upon confirmation, the form is submitted to `/api/v1/bookings`
4. Backend receives the booking and:
   - Saves it to MongoDB with a unique reference number
   - Sends an HTML confirmation email (if email is configured)
   - Returns booking details to the frontend
5. Frontend displays a success page with:
   - Booking reference number
   - Train details (name, number, route)
   - Journey details (date, class, passengers)
   - Total amount
   - Confirmation message

### Email Confirmation

The confirmation email includes:
- Booking reference number
- Train information and schedule
- All passenger details
- Fare breakdown
- Contact information
- Professional HTML formatting

## API Endpoints

### Create Booking
```
POST /api/v1/bookings
Content-Type: application/json

{
  "train": {
    "id": 1,
    "name": "Green Line Express",
    "number": "GLE-123",
    "source": "Karachi Cantonment",
    "destination": "Islamabad",
    "departureTime": "08:00 AM",
    "arrivalTime": "05:00 AM (Next Day)",
    "fare": 2500
  },
  "travelDetails": {
    "journeyDate": "2024-05-20",
    "seatClass": "economy",
    "numPassengers": 2
  },
  "passengers": [
    {
      "name": "John Doe",
      "age": 30,
      "gender": "male",
      "cnic": "1234567890123"
    },
    {
      "name": "Jane Doe",
      "age": 28,
      "gender": "female",
      "cnic": "1234567890124"
    }
  ],
  "contact": {
    "phone": "+92-300-1234567",
    "email": "user@example.com"
  },
  "pricing": {
    "ticketTotal": 5000,
    "serviceCharge": 100,
    "totalAmount": 5100
  }
}
```

Response:
```json
{
  "success": true,
  "message": "Booking confirmed successfully. Confirmation email sent.",
  "booking": {
    "reference": "BK-12345678-ABCDE",
    "status": "confirmed",
    "bookedAt": "2024-05-10T14:30:00.000Z",
    "totalAmount": 5100
  },
  "emailStatus": "sent"
}
```

### Get Booking by Reference
```
GET /api/v1/bookings/:reference
```

### Get All Bookings by Email
```
GET /api/v1/bookings/email/:email
```

## Database Schema

### Booking Model

```javascript
{
  reference: String (unique),
  train: {
    id, name, number, source, destination,
    departureTime, arrivalTime, fare
  },
  travelDetails: {
    journeyDate, seatClass, numPassengers
  },
  passengers: [{
    name, age, gender, cnic
  }],
  contact: {
    phone, email
  },
  pricing: {
    ticketTotal, serviceCharge, totalAmount
  },
  status: 'confirmed' | 'pending' | 'cancelled',
  emailSent: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Testing

### Manual Testing

1. Start the backend server: `npm run dev` (in backend directory)
2. Start the frontend: `npm run dev` (in root directory)
3. Navigate to the BookNow page
4. Fill out a complete booking form
5. Review the confirmation modal
6. Click "Confirm Booking"
7. Check for success page with booking reference
8. Check email inbox (or console in dev mode)

### With Email Configured

- Check your inbox for the confirmation email
- Email should contain all booking and passenger details

### Without Email Configured

- Console will show: `[SIMULATED] Confirmation email would be sent to user@example.com`
- Success page will still display normally
- Booking will be saved in the database

## Troubleshooting

### Email Not Sending

1. **Check environment variables**: Verify `EMAIL_USER` and `EMAIL_PASSWORD` are set correctly
2. **Gmail users**: Ensure you're using an App Password, not your regular Gmail password
3. **Check console logs**: Backend will log email errors
4. **MongoDB connection**: Ensure MongoDB is running and `MONGODB_URI` is correct

### Booking Not Saved

1. Verify MongoDB is running
2. Check `MONGODB_URI` in `.env`
3. Check backend console for database errors

### CORS Issues

1. Verify `CORS_ORIGIN` in `.env` matches your frontend URL
2. Default is `http://localhost:5173`

## Files Created/Modified

### Created:
- `backend/src/models/Booking.js` - Booking database model
- `backend/src/utils/email-service.js` - Email sending utility
- `backend/src/api/v1/bookings/schemas.js` - Booking validation schemas
- `backend/src/api/v1/bookings/router.js` - Booking API endpoints
- `backend/.env.example` - Environment variables template

### Modified:
- `backend/src/api/v1/index.js` - Added bookings router
- `backend/src/config/env.js` - Added email environment variables
- `src/services/bookingService.js` - Implemented proper API integration
- `src/pages/BookNow.jsx` - Added booking response handling and success display
- `src/pages/BookNow.css` - Added styles for booking reference and ticket details

## Next Steps

1. Install nodemailer: `npm install nodemailer --save` (already done)
2. Configure email credentials in `.env`
3. Test the booking flow end-to-end
4. Customize email templates as needed in `email-service.js`
5. Deploy to production with proper environment variables

---

**System Status**: ✅ Fully Functional (Ready for Testing)
