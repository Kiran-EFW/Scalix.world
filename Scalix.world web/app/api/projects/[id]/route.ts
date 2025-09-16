import { NextRequest, NextResponse } from 'next/server'

// Import the shared mock data from the main projects route
// For now, we'll duplicate it to avoid import issues
let mockProjects: any[] = [
  {
    id: '1',
    name: 'Customer Support Chatbot',
    description: 'AI-powered customer support system for handling common inquiries',
    status: 'running',
    model: 'Scalix Advanced',
    createdAt: '2025-09-01',
    lastDeployed: '2025-09-10',
    requests: 15420,
    cost: 45.80,
    userId: 'admin'
  },
  {
    id: '2',
    name: 'Code Review Assistant',
    description: 'Automated code review and suggestions for developers',
    status: 'running',
    model: 'Scalix Analyst',
    createdAt: '2025-08-15',
    lastDeployed: '2025-09-08',
    requests: 8920,
    cost: 67.30,
    userId: 'admin'
  },
  {
    id: '3',
    name: 'Content Generator',
    description: 'AI content creation tool for marketing and blogging',
    status: 'stopped',
    model: 'Scalix Standard',
    createdAt: '2025-07-20',
    lastDeployed: '2025-09-05',
    requests: 5430,
    cost: 23.45,
    userId: 'admin'
  }
]

// GET /api/projects/[id] - Get project details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id

    // In production, get user from session/token
    const userId = 'admin' // Mock user ID

    const project = mockProjects.find(p => p.id === projectId && p.userId === userId)

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    const updates = await request.json()

    // In production, get user from session/token
    const userId = 'admin' // Mock user ID

    const projectIndex = mockProjects.findIndex(p => p.id === projectId && p.userId === userId)

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Update project
    const updatedProject = {
      ...mockProjects[projectIndex],
      ...updates,
      lastDeployed: updates.status ? new Date().toISOString().split('T')[0] : mockProjects[projectIndex].lastDeployed
    }

    mockProjects[projectIndex] = updatedProject

    return NextResponse.json({
      success: true,
      data: updatedProject
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id

    // In production, get user from session/token
    const userId = 'admin' // Mock user ID

    const projectIndex = mockProjects.findIndex(p => p.id === projectId && p.userId === userId)

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    mockProjects.splice(projectIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
