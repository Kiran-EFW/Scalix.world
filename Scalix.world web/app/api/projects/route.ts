import { NextRequest, NextResponse } from 'next/server'

// Try to import Firebase, fallback to mock if not available
let db: any = null
let firestoreFunctions: any = {}

try {
  const firebase = require('@/lib/firebase')
  const firestore = require('firebase/firestore')
  
  db = firebase.db
  firestoreFunctions = {
    collection: firestore.collection,
    addDoc: firestore.addDoc,
    getDocs: firestore.getDocs,
    updateDoc: firestore.updateDoc,
    deleteDoc: firestore.deleteDoc,
    doc: firestore.doc,
    query: firestore.query,
    where: firestore.where,
    orderBy: firestore.orderBy,
    serverTimestamp: firestore.serverTimestamp
  }
  console.log('✅ Firebase connected successfully')
} catch (error) {
  console.log('⚠️ Firebase not available, using mock data:', error.message)
}

// Default projects for initial setup (will be migrated to Firestore)
const defaultProjects = [
  {
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

// Helper function to migrate default projects to Firestore
async function migrateDefaultProjects(userId: string) {
  try {
    const projectsRef = collection(db, 'projects')
    const q = query(projectsRef, where('userId', '==', userId))
    const snapshot = await getDocs(q)
    
    // If no projects exist, add default ones
    if (snapshot.empty) {
      console.log('🔄 Migrating default projects to Firestore...')
      for (const project of defaultProjects) {
        await addDoc(projectsRef, {
          ...project,
          userId,
          createdAt: project.createdAt,
          lastDeployed: project.lastDeployed,
          createdTimestamp: serverTimestamp()
        })
      }
      console.log('✅ Default projects migrated successfully')
    }
  } catch (error) {
    console.error('❌ Error migrating default projects:', error)
  }
}

// GET /api/projects - List user projects
export async function GET(request: NextRequest) {
  try {
    // In production, get user from session/token
    const userId = 'admin' // Mock user ID

    // Try Firebase first, fallback to mock data
    if (db && firestoreFunctions.collection) {
      try {
        // Migrate default projects if needed
        await migrateDefaultProjects(userId)

        // Fetch projects from Firestore
        const projectsRef = firestoreFunctions.collection(db, 'projects')
        const q = firestoreFunctions.query(
          projectsRef, 
          firestoreFunctions.where('userId', '==', userId),
          firestoreFunctions.orderBy('createdTimestamp', 'desc')
        )
        
        const snapshot = await firestoreFunctions.getDocs(q)
        const projects = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        }))

        return NextResponse.json({
          success: true,
          data: projects,
          source: 'firestore'
        })
      } catch (firebaseError) {
        console.error('Firebase error, falling back to mock data:', firebaseError)
        // Fall through to mock data
      }
    }

    // Fallback to mock data
    if (!global.mockProjects) {
      global.mockProjects = defaultProjects.map((project, index) => ({
        id: `mock_${index + 1}`,
        ...project
      }))
    }

    return NextResponse.json({
      success: true,
      data: global.mockProjects,
      source: 'mock'
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch projects',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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
        { 
          success: false,
          error: 'Project name is required' 
        },
        { status: 400 }
      )
    }

    // In production, get user from session/token
    const userId = 'admin' // Mock user ID

    const newProjectData = {
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

    // Try Firebase first, fallback to mock data
    if (db && firestoreFunctions.addDoc) {
      try {
        // Create project in Firestore
        const projectsRef = firestoreFunctions.collection(db, 'projects')
        const projectDataWithTimestamp = {
          ...newProjectData,
          createdTimestamp: firestoreFunctions.serverTimestamp()
        }

        const docRef = await firestoreFunctions.addDoc(projectsRef, projectDataWithTimestamp)
        
        const newProject = {
          id: docRef.id,
          ...newProjectData
        }

        return NextResponse.json({
          success: true,
          data: newProject,
          message: 'Project created successfully!',
          source: 'firestore'
        })
      } catch (firebaseError) {
        console.error('Firebase error, falling back to mock data:', firebaseError)
        // Fall through to mock data
      }
    }

    // Fallback to mock data (in-memory storage)
    const newProject = {
      id: `mock_${Date.now()}`,
      ...newProjectData
    }

    // Store in a simple in-memory array (this will reset on server restart)
    if (!global.mockProjects) {
      global.mockProjects = [...defaultProjects]
    }
    global.mockProjects.push(newProject)

    return NextResponse.json({
      success: true,
      data: newProject,
      message: 'Project created successfully!',
      source: 'mock'
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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
        { 
          success: false,
          error: 'Project ID is required' 
        },
        { status: 400 }
      )
    }

    // In production, get user from session/token
    const userId = 'admin' // Mock user ID

    // Update project in Firestore
    const projectRef = doc(db, 'projects', projectId)
    
    // Prepare update data
    const updateData = {
      ...updates,
      lastDeployed: updates.status ? new Date().toISOString().split('T')[0] : undefined,
      updatedTimestamp: serverTimestamp()
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    )

    await updateDoc(projectRef, updateData)

    // Fetch updated project
    const updatedProject = {
      id: projectId,
      ...updates,
      lastDeployed: updates.status ? new Date().toISOString().split('T')[0] : undefined
    }

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully!'
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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
        { 
          success: false,
          error: 'Project ID is required' 
        },
        { status: 400 }
      )
    }

    // In production, get user from session/token
    const userId = 'admin' // Mock user ID

    // Delete project from Firestore
    const projectRef = doc(db, 'projects', projectId)
    await deleteDoc(projectRef)

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully!'
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
