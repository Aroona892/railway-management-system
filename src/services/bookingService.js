export async function createBooking(bookingPayload) {
  // Placeholder for backend integration.
  // In a MERN stack, this can be replaced with an Express API call to /api/bookings
  // and stored in MongoDB using a Booking model.

  console.log('Booking payload ready for backend:', bookingPayload)

  // Simulate network latency for development/testing.
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    success: true,
    message: 'Booking request prepared successfully.',
    payload: bookingPayload
  }
}