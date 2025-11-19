import { NextRequest, NextResponse } from 'next/server'

// GET field by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // TODO: Fetch from database where id = params.id
    const field = {
      id,
      name: 'Sân bóng Thế Vinh',
      location: 'Quận 1, TP HCM',
      type: '5v5',
      price: 150000,
      rating: 4.8,
      // ... full field details
    }

    return NextResponse.json(field, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi khi lấy thông tin sân' },
      { status: 500 }
    )
  }
}

// PUT update field
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const updateData = await request.json()

    // TODO: Check admin authorization
    // TODO: Update in database

    return NextResponse.json(
      {
        success: true,
        message: 'Sân bóng đã được cập nhật',
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật sân' },
      { status: 500 }
    )
  }
}

// DELETE field
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // TODO: Check admin authorization
    // TODO: Delete from database

    return NextResponse.json(
      { success: true, message: 'Sân bóng đã được xóa' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi khi xóa sân' },
      { status: 500 }
    )
  }
}
