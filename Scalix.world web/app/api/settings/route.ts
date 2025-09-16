import { NextRequest, NextResponse } from 'next/server'

// Mock user data - in production, this would come from a database
let mockUserData = {
  id: 'admin',
  firstName: 'Scalix',
  lastName: 'Admin',
  email: 'admin@scalix.world',
  company: 'Scalix Inc.',
  bio: 'Building the future of AI-powered applications with Scalix.',
  profilePicture: null,
  twoFactorEnabled: false,
  activeSessions: [
    {
      id: 'current',
      name: 'Current Session',
      device: 'Chrome on Windows',
      lastActive: 'Active now',
      isCurrent: true
    },
    {
      id: 'mobile',
      name: 'Mobile App',
      device: 'iOS App',
      lastActive: '2 hours ago',
      isCurrent: false
    }
  ],
  notificationSettings: {
    email: true,
    projectUpdates: true,
    teamActivity: false,
    billingAlerts: true
  },
  appearanceSettings: {
    theme: 'light',
    language: 'en-US',
    timezone: 'UTC-8'
  }
}

export async function GET(request: NextRequest) {
  try {
    // In production, get user ID from authentication
    const userId = 'admin'
    
    return NextResponse.json({ 
      success: true, 
      data: mockUserData 
    })
  } catch (error) {
    console.error('Error fetching user settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json()
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    // In production, get user ID from authentication
    const userId = 'admin'
    
    switch (action) {
      case 'profile':
        // Update profile information
        mockUserData = {
          ...mockUserData,
          firstName: updates.firstName || mockUserData.firstName,
          lastName: updates.lastName || mockUserData.lastName,
          email: updates.email || mockUserData.email,
          company: updates.company || mockUserData.company,
          bio: updates.bio || mockUserData.bio
        }
        break
        
      case 'password':
        // In production, validate current password and hash new password
        if (!updates.currentPassword || !updates.newPassword || !updates.confirmPassword) {
          return NextResponse.json(
            { success: false, error: 'All password fields are required' },
            { status: 400 }
          )
        }
        
        if (updates.newPassword !== updates.confirmPassword) {
          return NextResponse.json(
            { success: false, error: 'New passwords do not match' },
            { status: 400 }
          )
        }
        
        // Mock password validation - in production, verify current password
        if (updates.currentPassword !== 'currentpassword') {
          return NextResponse.json(
            { success: false, error: 'Current password is incorrect' },
            { status: 400 }
          )
        }
        break
        
      case '2fa':
        // Toggle 2FA
        mockUserData.twoFactorEnabled = updates.enabled
        break
        
      case 'notifications':
        // Update notification settings
        mockUserData.notificationSettings = {
          ...mockUserData.notificationSettings,
          ...updates
        }
        break
        
      case 'appearance':
        // Update appearance settings
        mockUserData.appearanceSettings = {
          ...mockUserData.appearanceSettings,
          ...updates
        }
        break
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
    
    return NextResponse.json({ 
      success: true, 
      data: mockUserData,
      message: getSuccessMessage(action)
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    // In production, get user ID from authentication
    const userId = 'admin'
    
    switch (action) {
      case 'session':
        const sessionId = searchParams.get('sessionId')
        if (!sessionId) {
          return NextResponse.json(
            { success: false, error: 'Session ID is required' },
            { status: 400 }
          )
        }
        
        // Remove session from active sessions
        mockUserData.activeSessions = mockUserData.activeSessions.filter(
          session => session.id !== sessionId
        )
        break
        
      case 'account':
        // In production, this would delete the user account and all associated data
        // For now, just return success
        break
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: getSuccessMessage(action, 'delete')
    })
  } catch (error) {
    console.error('Error deleting:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete' },
      { status: 500 }
    )
  }
}

function getSuccessMessage(action: string, operation: string = 'update'): string {
  const messages = {
    profile: 'Profile updated successfully!',
    password: 'Password updated successfully!',
    '2fa': 'Two-factor authentication settings updated!',
    notifications: 'Notification preferences updated!',
    appearance: 'Appearance settings updated!',
    session: 'Session revoked successfully!',
    account: 'Account deletion initiated. You will receive a confirmation email.'
  }
  
  return messages[action] || 'Settings updated successfully!'
}
