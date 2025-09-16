import { NextRequest, NextResponse } from 'next/server'

// Mock team data - in production, this would come from a database
let mockTeamMembers = [
  {
    id: '1',
    name: 'Scalix Admin',
    email: 'admin@scalix.world',
    role: 'Owner',
    status: 'active',
    joinedAt: '2025-01-01',
    lastActive: '2025-01-16',
    avatar: null,
    permissions: ['all']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@scalix.world',
    role: 'Developer',
    status: 'active',
    joinedAt: '2025-01-05',
    lastActive: '2025-01-15',
    avatar: null,
    permissions: ['projects', 'api_keys']
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@scalix.world',
    role: 'Analyst',
    status: 'active',
    joinedAt: '2025-01-10',
    lastActive: '2025-01-14',
    avatar: null,
    permissions: ['analytics', 'usage']
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@scalix.world',
    role: 'Viewer',
    status: 'pending',
    joinedAt: '2025-01-16',
    lastActive: null,
    avatar: null,
    permissions: ['view_only']
  }
]

let mockInvitations = [
  {
    id: 'inv_1',
    email: 'john@example.com',
    role: 'Developer',
    status: 'pending',
    invitedAt: '2025-01-15',
    invitedBy: 'Scalix Admin',
    expiresAt: '2025-01-22'
  },
  {
    id: 'inv_2',
    email: 'lisa@example.com',
    role: 'Analyst',
    status: 'pending',
    invitedAt: '2025-01-14',
    invitedBy: 'Scalix Admin',
    expiresAt: '2025-01-21'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    // In production, get user ID from authentication
    const userId = 'admin'
    
    switch (action) {
      case 'members':
        return NextResponse.json({ 
          success: true, 
          data: mockTeamMembers 
        })
        
      case 'invitations':
        return NextResponse.json({ 
          success: true, 
          data: mockInvitations 
        })
        
      case 'stats':
        const stats = {
          totalMembers: mockTeamMembers.length,
          activeMembers: mockTeamMembers.filter(m => m.status === 'active').length,
          pendingInvitations: mockInvitations.filter(i => i.status === 'pending').length,
          roles: {
            owner: mockTeamMembers.filter(m => m.role === 'Owner').length,
            developer: mockTeamMembers.filter(m => m.role === 'Developer').length,
            analyst: mockTeamMembers.filter(m => m.role === 'Analyst').length,
            viewer: mockTeamMembers.filter(m => m.role === 'Viewer').length
          }
        }
        return NextResponse.json({ 
          success: true, 
          data: stats 
        })
        
      default:
        return NextResponse.json({ 
          success: true, 
          data: {
            members: mockTeamMembers,
            invitations: mockInvitations,
            stats: {
              totalMembers: mockTeamMembers.length,
              activeMembers: mockTeamMembers.filter(m => m.status === 'active').length,
              pendingInvitations: mockInvitations.filter(i => i.status === 'pending').length
            }
          }
        })
    }
  } catch (error) {
    console.error('Error fetching team data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const data = await request.json()
    
    // In production, get user ID from authentication
    const userId = 'admin'
    
    switch (action) {
      case 'invite':
        const { email, role } = data
        
        if (!email || !role) {
          return NextResponse.json(
            { success: false, error: 'Email and role are required' },
            { status: 400 }
          )
        }
        
        // Check if user already exists
        const existingMember = mockTeamMembers.find(m => m.email === email)
        if (existingMember) {
          return NextResponse.json(
            { success: false, error: 'User is already a team member' },
            { status: 400 }
          )
        }
        
        // Check if invitation already exists
        const existingInvitation = mockInvitations.find(i => i.email === email && i.status === 'pending')
        if (existingInvitation) {
          return NextResponse.json(
            { success: false, error: 'Invitation already sent to this email' },
            { status: 400 }
          )
        }
        
        // Create new invitation
        const newInvitation = {
          id: `inv_${Date.now()}`,
          email: email.trim(),
          role: role,
          status: 'pending',
          invitedAt: new Date().toISOString().split('T')[0],
          invitedBy: 'Scalix Admin',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
        
        mockInvitations.push(newInvitation)
        
        return NextResponse.json({ 
          success: true, 
          data: newInvitation,
          message: 'Invitation sent successfully!'
        })
        
      case 'resend':
        const { invitationId } = data
        
        const invitation = mockInvitations.find(i => i.id === invitationId)
        if (!invitation) {
          return NextResponse.json(
            { success: false, error: 'Invitation not found' },
            { status: 404 }
          )
        }
        
        // Update invitation timestamp
        invitation.invitedAt = new Date().toISOString().split('T')[0]
        invitation.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        
        return NextResponse.json({ 
          success: true, 
          data: invitation,
          message: 'Invitation resent successfully!'
        })
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error processing team action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process team action' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const memberId = searchParams.get('memberId')
    const data = await request.json()
    
    // In production, get user ID from authentication
    const userId = 'admin'
    
    switch (action) {
      case 'update_role':
        if (!memberId) {
          return NextResponse.json(
            { success: false, error: 'Member ID is required' },
            { status: 400 }
          )
        }
        
        const memberIndex = mockTeamMembers.findIndex(m => m.id === memberId)
        if (memberIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Member not found' },
            { status: 404 }
          )
        }
        
        // Update member role
        mockTeamMembers[memberIndex] = {
          ...mockTeamMembers[memberIndex],
          role: data.role,
          permissions: getPermissionsForRole(data.role)
        }
        
        return NextResponse.json({ 
          success: true, 
          data: mockTeamMembers[memberIndex],
          message: 'Member role updated successfully!'
        })
        
      case 'update_status':
        if (!memberId) {
          return NextResponse.json(
            { success: false, error: 'Member ID is required' },
            { status: 400 }
          )
        }
        
        const memberIndex2 = mockTeamMembers.findIndex(m => m.id === memberId)
        if (memberIndex2 === -1) {
          return NextResponse.json(
            { success: false, error: 'Member not found' },
            { status: 404 }
          )
        }
        
        // Update member status
        mockTeamMembers[memberIndex2] = {
          ...mockTeamMembers[memberIndex2],
          status: data.status
        }
        
        return NextResponse.json({ 
          success: true, 
          data: mockTeamMembers[memberIndex2],
          message: 'Member status updated successfully!'
        })
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update team member' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const memberId = searchParams.get('memberId')
    const invitationId = searchParams.get('invitationId')
    
    // In production, get user ID from authentication
    const userId = 'admin'
    
    switch (action) {
      case 'remove_member':
        if (!memberId) {
          return NextResponse.json(
            { success: false, error: 'Member ID is required' },
            { status: 400 }
          )
        }
        
        const memberIndex = mockTeamMembers.findIndex(m => m.id === memberId)
        if (memberIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Member not found' },
            { status: 404 }
          )
        }
        
        // Remove member
        mockTeamMembers.splice(memberIndex, 1)
        
        return NextResponse.json({ 
          success: true, 
          message: 'Member removed successfully!'
        })
        
      case 'cancel_invitation':
        if (!invitationId) {
          return NextResponse.json(
            { success: false, error: 'Invitation ID is required' },
            { status: 400 }
          )
        }
        
        const invitationIndex = mockInvitations.findIndex(i => i.id === invitationId)
        if (invitationIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Invitation not found' },
            { status: 404 }
          )
        }
        
        // Remove invitation
        mockInvitations.splice(invitationIndex, 1)
        
        return NextResponse.json({ 
          success: true, 
          message: 'Invitation cancelled successfully!'
        })
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error deleting team data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete team data' },
      { status: 500 }
    )
  }
}

function getPermissionsForRole(role: string): string[] {
  switch (role) {
    case 'Owner':
      return ['all']
    case 'Developer':
      return ['projects', 'api_keys', 'usage']
    case 'Analyst':
      return ['analytics', 'usage', 'reports']
    case 'Viewer':
      return ['view_only']
    default:
      return ['view_only']
  }
}
