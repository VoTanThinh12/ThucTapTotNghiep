import { NextRequest, NextResponse } from 'next/server'

// GET all fields
export async function GET(request: NextRequest) {
  try {
    // TODO: Fetch from database
    const fields = [
      {
        id: 1,
        name: 'Sân bóng Thế Vinh',
        location: 'Quận 1, TP HCM',
        type: '5v5',
        price: 150000,
        rating: 4.8,
      },
      // ... more fields
    ]

    return NextResponse.json(fields, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách sân' },
      { status: 500 }
    )
  }
}

// POST new field
export async function POST(request: NextRequest) {
  try {
    const fieldData = await request.json()

    // TODO: Validate data
    // TODO: Save to database
    // TODO: Check admin authorization

    return NextResponse.json(
      {
        success: true,
        message: 'Sân bóng đã được tạo',
        field: fieldData,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi khi tạo sân' },
      { status: 500 }
    )
  }
}
