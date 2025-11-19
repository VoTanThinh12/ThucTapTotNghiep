import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, userType } = await request.json()

    // TODO: Validate credentials against database
    // This is a mock implementation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      )
    }

    // Mock user data
    const user = {
      id: 1,
      email,
      name: 'User Name',
      role: userType,
    }

    // TODO: Create JWT token and set HTTP-only cookie
    return NextResponse.json(
      {
        success: true,
        user,
        message: 'Đăng nhập thành công',
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}
