import { NextRequest, NextResponse } from 'next/server'

// Mock API key storage (in production, this would be a database)
let mockApiKeys: any[] = [
  {
    id: 'key_1',
    name: 'Development Key',
    key: 'sk-scalix-dev-1234567890abcdef',
    createdAt: new Date('2024-01-15'),
    lastUsed: new Date('2024-01-20'),
    usage: 15420,
    status: 'active',
    userId: 'admin'
  }
]

function generateApiKey(): string {
  const prefix = 'sk-scalix-'
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = prefix

  for (let i = 0; i < 32; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

export async function GET(request: NextRequest) {
  try {
    // In production, get user from session/token
    const userId = 'admin' // Mock user ID

    const userApiKeys = mockApiKeys.filter(key => key.userId === userId)

    return NextResponse.json({
      success: true,
      data: userApiKeys
    })
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'API key name is required' },
        { status: 400 }
      )
    }

    // In production, get user from session/token
    const userId = 'admin' // Mock user ID

    const newApiKey = {
      id: `key_${Date.now()}`,
      name: name.trim(),
      key: generateApiKey(),
      createdAt: new Date(),
      lastUsed: null,
      usage: 0,
      status: 'active',
      userId: userId
    }

    mockApiKeys.push(newApiKey)

    return NextResponse.json({
      success: true,
      data: newApiKey
    })
  } catch (error) {
    console.error('Error creating API key:', error)
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const keyId = searchParams.get('id')

    if (!keyId) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      )
    }

    // In production, get user from session/token and verify ownership
    const userId = 'admin' // Mock user ID

    const keyIndex = mockApiKeys.findIndex(key =>
      key.id === keyId && key.userId === userId
    )

    if (keyIndex === -1) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      )
    }

    mockApiKeys.splice(keyIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting API key:', error)
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    )
  }
}
