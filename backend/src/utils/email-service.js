import nodemailer from 'nodemailer'
import { envServer } from '../config/env.js'

let transporter = null

function initTransporter() {
  if (transporter) return transporter

  const emailUser = envServer.EMAIL_USER
  const emailPass = envServer.EMAIL_PASSWORD

  if (!emailUser || !emailPass) {
    console.warn('Email credentials not configured. Email sending will be simulated.')
    return null
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  })

  return transporter
}

function generateBookingEmailHTML(booking) {
  const { reference, train, travelDetails, passengers, contact, pricing } = booking

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .section { margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #3498db; }
        .section-title { font-weight: bold; font-size: 16px; color: #2c3e50; margin-bottom: 10px; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: bold; color: #555; }
        .detail-value { color: #333; }
        .passenger-list { list-style: none; padding: 0; }
        .passenger-item { padding: 10px; background: white; margin: 5px 0; border-radius: 4px; }
        .total-amount { font-size: 18px; font-weight: bold; color: #27ae60; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmation</h1>
          <p>Reference: ${reference}</p>
        </div>

        <div class="section">
          <div class="section-title">Train Information</div>
          <div class="detail-row">
            <span class="detail-label">Train Name:</span>
            <span class="detail-value">${train.name}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Train Number:</span>
            <span class="detail-value">${train.number}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Route:</span>
            <span class="detail-value">${train.source} → ${train.destination}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Journey Details</div>
          <div class="detail-row">
            <span class="detail-label">Departure:</span>
            <span class="detail-value">${train.departureTime}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Arrival:</span>
            <span class="detail-value">${train.arrivalTime}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Journey Date:</span>
            <span class="detail-value">${travelDetails.journeyDate}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Class:</span>
            <span class="detail-value">${travelDetails.seatClass}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Passengers (${passengers.length})</div>
          <ul class="passenger-list">
            ${passengers.map((p, i) => `
              <li class="passenger-item">
                <strong>Passenger ${i + 1}:</strong> ${p.name} (Age: ${p.age}, CNIC: ${p.cnic})
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="section">
          <div class="section-title">Fare Summary</div>
          <div class="detail-row">
            <span class="detail-label">Ticket Fare (${passengers.length} × PKR ${train.fare}):</span>
            <span class="detail-value">PKR ${pricing.ticketTotal}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Service Charge:</span>
            <span class="detail-value">PKR ${pricing.serviceCharge}</span>
          </div>
          <div class="detail-row" style="font-weight: bold; padding-top: 10px; border-top: 2px solid #3498db;">
            <span class="detail-label">Total Amount:</span>
            <span class="detail-value total-amount">PKR ${pricing.totalAmount}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Contact Information</div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${contact.email}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">${contact.phone}</span>
          </div>
        </div>

        <div class="section">
          <p style="margin: 0; font-size: 14px;">
            Thank you for booking with us! Please save this confirmation for your records. 
            Your booking reference is <strong>${reference}</strong>.
          </p>
        </div>

        <div class="footer">
          <p>Railway Management System | Booking Confirmation</p>
          <p>This is an automated email. Please do not reply to this address.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function sendBookingConfirmationEmail(booking) {
  const transporter_ = initTransporter()

  if (!transporter_) {
    console.info(`[SIMULATED] Confirmation email would be sent to ${booking.contact.email}`)
    return {
      success: true,
      simulated: true,
      message: 'Email sending simulated (no email service configured)'
    }
  }

  try {
    const result = await transporter_.sendMail({
      from: envServer.EMAIL_USER,
      to: booking.contact.email,
      subject: `Booking Confirmation - Reference: ${booking.reference}`,
      html: generateBookingEmailHTML(booking)
    })

    console.info(`Email sent successfully to ${booking.contact.email}`)
    return {
      success: true,
      messageId: result.messageId
    }
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
