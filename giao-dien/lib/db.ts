// Database connection helper (to be used with Neon or Supabase)
// For development, this connects to a PostgreSQL database

import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function query(text: string, params: any[] = []) {
  const start = Date.now()
  try {
    const result = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: result.rowCount })
    return result
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
}

export async function getFieldById(id: string) {
  const result = await query(
    'SELECT * FROM fields WHERE id = $1',
    [id]
  )
  return result.rows[0]
}

export async function getAllFields() {
  const result = await query('SELECT * FROM fields WHERE status = $1 ORDER BY rating DESC', ['active'])
  return result.rows
}

export async function getUserBookings(userId: string) {
  const result = await query(
    'SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  )
  return result.rows
}

export async function createBooking(bookingData: any) {
  const { userId, fieldId, bookingDate, startTime, endTime, duration, totalPrice, depositPrice, notes } = bookingData

  const result = await query(
    `INSERT INTO bookings (
      booking_code, user_id, field_id, booking_date, start_time, end_time, 
      duration, total_price, deposit_price, notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [
      `BK${Date.now()}`,
      userId,
      fieldId,
      bookingDate,
      startTime,
      endTime,
      duration,
      totalPrice,
      depositPrice,
      notes,
    ]
  )

  return result.rows[0]
}
