import { NextRequest, NextResponse } from 'next/server'

// Mock project storage (in production, this would be a database)
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

// GET /api/projects - List user projects
export async function GET(request: NextRequest) {
  try {
    // In production, get user from session/token
    const userId = 'admin' // Mock user ID

    const userProjects = mockProjects.filter(project => project.userId === userId)

    return NextResponse.json({
      success: true,
      data: userProjects
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const { name, description, model } = await request.json()

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      )
    }

    // In production, get user from session/token
    const userId = 'admin' // Mock user ID

    const newProject = {
      id: `project_${Date.now()}`,
      name: name.trim(),
      description: description?.trim() || 'No description provided',
      status: 'stopped' as const,
      model: model || 'Scalix Standard',
      createdAt: new Date().toISOString().split('T')[0],
      lastDeployed: new Date().toISOString().split('T')[0],
      requests: 0,
      cost: 0,
      userId: userId
    }

    mockProjects.push(newProject)

    return NextResponse.json({
      success: true,
      data: newProject
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

// PUT /api/projects - Update project (using query parameter for ID)
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('id')
    const updates = await request.json()

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

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

// DELETE /api/projects - Delete project (using query parameter for ID)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('id')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

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
