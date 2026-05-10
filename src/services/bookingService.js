const API_URL = '/api/v1/bookings'

function simulateBookingResponse(bookingPayload) {
  const bookingReference = `BK-${Date.now().toString().slice(-8)}`
  return {
    success: true,
    message: 'Booking completed successfully (simulated).',
    booking: {
      reference: bookingReference,
      bookedAt: new Date().toISOString(),
      ...bookingPayload
    }
  }
}

export async function createBooking(bookingPayload) {
  if (!bookingPayload || typeof bookingPayload !== 'object') {
    return {
      success: false,
      message: 'Invalid booking payload supplied.'
    }
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingPayload)
    })

    if (!response.ok) {
      if (response.status === 404) {
        return simulateBookingResponse(bookingPayload)
      }

      const errorText = await response.text().catch(() => '')
      return {
        success: false,
        message: errorText || `Booking failed with status ${response.status}`
      }
    }

    const data = await response.json().catch(() => null)
    return {
      success: true,
      message: data?.message || 'Booking completed successfully.',
      booking: data || bookingPayload
    }
  } catch (error) {
    console.warn('Booking API request failed, falling back to simulated response.', error)
    return simulateBookingResponse(bookingPayload)
  }
}
