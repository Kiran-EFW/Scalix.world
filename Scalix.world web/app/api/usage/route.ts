import { NextRequest, NextResponse } from 'next/server'

// Mock usage data - in production, this would come from a database
let mockUsageData = {
  summary: {
    totalRequests: 125430,
    totalCost: 245.80,
    totalTokens: 2847392,
    averageResponseTime: 1.2,
    successRate: 99.2,
    period: '30 days'
  },
  dailyUsage: [
    { date: '2025-01-01', requests: 4200, cost: 8.40, tokens: 95000, avgResponseTime: 1.1 },
    { date: '2025-01-02', requests: 3800, cost: 7.60, tokens: 86000, avgResponseTime: 1.3 },
    { date: '2025-01-03', requests: 4500, cost: 9.00, tokens: 102000, avgResponseTime: 1.0 },
    { date: '2025-01-04', requests: 5200, cost: 10.40, tokens: 118000, avgResponseTime: 1.2 },
    { date: '2025-01-05', requests: 4800, cost: 9.60, tokens: 109000, avgResponseTime: 1.4 },
    { date: '2025-01-06', requests: 4100, cost: 8.20, tokens: 93000, avgResponseTime: 1.1 },
    { date: '2025-01-07', requests: 3900, cost: 7.80, tokens: 88000, avgResponseTime: 1.3 },
    { date: '2025-01-08', requests: 4600, cost: 9.20, tokens: 104000, avgResponseTime: 1.0 },
    { date: '2025-01-09', requests: 5100, cost: 10.20, tokens: 115000, avgResponseTime: 1.2 },
    { date: '2025-01-10', requests: 4400, cost: 8.80, tokens: 99000, avgResponseTime: 1.1 },
    { date: '2025-01-11', requests: 4200, cost: 8.40, tokens: 95000, avgResponseTime: 1.3 },
    { date: '2025-01-12', requests: 4800, cost: 9.60, tokens: 109000, avgResponseTime: 1.0 },
    { date: '2025-01-13', requests: 5000, cost: 10.00, tokens: 113000, avgResponseTime: 1.2 },
    { date: '2025-01-14', requests: 4300, cost: 8.60, tokens: 97000, avgResponseTime: 1.1 },
    { date: '2025-01-15', requests: 4700, cost: 9.40, tokens: 106000, avgResponseTime: 1.4 },
    { date: '2025-01-16', requests: 4200, cost: 8.40, tokens: 95000, avgResponseTime: 1.2 }
  ],
  modelUsage: [
    { model: 'Scalix Standard', requests: 45000, cost: 67.50, tokens: 1020000, percentage: 35.9 },
    { model: 'Scalix Advanced', requests: 38000, cost: 95.00, tokens: 1140000, percentage: 30.3 },
    { model: 'Scalix Analyst', requests: 25000, cost: 50.00, tokens: 450000, percentage: 19.9 },
    { model: 'Scalix Coder', requests: 17430, cost: 33.30, tokens: 235392, percentage: 13.9 }
  ],
  projectUsage: [
    { projectId: '1', projectName: 'Customer Support Chatbot', requests: 15420, cost: 45.80, tokens: 350000, percentage: 12.3 },
    { projectId: '2', projectName: 'Content Generation API', requests: 12800, cost: 38.20, tokens: 290000, percentage: 10.2 },
    { projectId: '3', projectName: 'Data Analysis Tool', requests: 11200, cost: 33.50, tokens: 250000, percentage: 8.9 },
    { projectId: '4', projectName: 'Code Review Assistant', requests: 9800, cost: 29.40, tokens: 220000, percentage: 7.8 },
    { projectId: '5', projectName: 'Marketing Copy Generator', requests: 8500, cost: 25.50, tokens: 190000, percentage: 6.8 }
  ],
  hourlyUsage: [
    { hour: '00:00', requests: 120, cost: 0.24, tokens: 2700 },
    { hour: '01:00', requests: 80, cost: 0.16, tokens: 1800 },
    { hour: '02:00', requests: 60, cost: 0.12, tokens: 1350 },
    { hour: '03:00', requests: 45, cost: 0.09, tokens: 1012 },
    { hour: '04:00', requests: 55, cost: 0.11, tokens: 1237 },
    { hour: '05:00', requests: 70, cost: 0.14, tokens: 1575 },
    { hour: '06:00', requests: 150, cost: 0.30, tokens: 3375 },
    { hour: '07:00', requests: 300, cost: 0.60, tokens: 6750 },
    { hour: '08:00', requests: 500, cost: 1.00, tokens: 11250 },
    { hour: '09:00', requests: 800, cost: 1.60, tokens: 18000 },
    { hour: '10:00', requests: 950, cost: 1.90, tokens: 21375 },
    { hour: '11:00', requests: 1000, cost: 2.00, tokens: 22500 },
    { hour: '12:00', requests: 900, cost: 1.80, tokens: 20250 },
    { hour: '13:00', requests: 850, cost: 1.70, tokens: 19125 },
    { hour: '14:00', requests: 920, cost: 1.84, tokens: 20700 },
    { hour: '15:00', requests: 980, cost: 1.96, tokens: 22050 },
    { hour: '16:00', requests: 950, cost: 1.90, tokens: 21375 },
    { hour: '17:00', requests: 800, cost: 1.60, tokens: 18000 },
    { hour: '18:00', requests: 600, cost: 1.20, tokens: 13500 },
    { hour: '19:00', requests: 400, cost: 0.80, tokens: 9000 },
    { hour: '20:00', requests: 300, cost: 0.60, tokens: 6750 },
    { hour: '21:00', requests: 200, cost: 0.40, tokens: 4500 },
    { hour: '22:00', requests: 150, cost: 0.30, tokens: 3375 },
    { hour: '23:00', requests: 120, cost: 0.24, tokens: 2700 }
  ],
  errorLogs: [
    { timestamp: '2025-01-16T10:30:00Z', error: 'Rate limit exceeded', requests: 5, cost: 0 },
    { timestamp: '2025-01-16T09:15:00Z', error: 'Invalid API key', requests: 2, cost: 0 },
    { timestamp: '2025-01-16T08:45:00Z', error: 'Model timeout', requests: 1, cost: 0 },
    { timestamp: '2025-01-15T16:20:00Z', error: 'Rate limit exceeded', requests: 3, cost: 0 },
    { timestamp: '2025-01-15T14:10:00Z', error: 'Invalid request format', requests: 1, cost: 0 }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const period = searchParams.get('period') || '30'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const model = searchParams.get('model')
    const projectId = searchParams.get('projectId')
    
    // In production, get user ID from authentication
    const userId = 'admin'
    
    switch (action) {
      case 'summary':
        return NextResponse.json({ 
          success: true, 
          data: {
            ...mockUsageData.summary,
            period: `${period} days`
          }
        })
        
      case 'daily':
        let filteredDaily = mockUsageData.dailyUsage
        
        // Apply date filters
        if (startDate && endDate) {
          filteredDaily = filteredDaily.filter(day => 
            day.date >= startDate && day.date <= endDate
          )
        }
        
        return NextResponse.json({ 
          success: true, 
          data: filteredDaily 
        })
        
      case 'models':
        let filteredModels = mockUsageData.modelUsage
        
        // Apply model filter
        if (model && model !== 'all') {
          filteredModels = filteredModels.filter(m => m.model === model)
        }
        
        return NextResponse.json({ 
          success: true, 
          data: filteredModels 
        })
        
      case 'projects':
        let filteredProjects = mockUsageData.projectUsage
        
        // Apply project filter
        if (projectId && projectId !== 'all') {
          filteredProjects = filteredProjects.filter(p => p.projectId === projectId)
        }
        
        return NextResponse.json({ 
          success: true, 
          data: filteredProjects 
        })
        
      case 'hourly':
        return NextResponse.json({ 
          success: true, 
          data: mockUsageData.hourlyUsage 
        })
        
      case 'errors':
        return NextResponse.json({ 
          success: true, 
          data: mockUsageData.errorLogs 
        })
        
      case 'export':
        const format = searchParams.get('format') || 'csv'
        const exportData = {
          summary: mockUsageData.summary,
          dailyUsage: mockUsageData.dailyUsage,
          modelUsage: mockUsageData.modelUsage,
          projectUsage: mockUsageData.projectUsage,
          exportedAt: new Date().toISOString(),
          period: `${period} days`
        }
        
        return NextResponse.json({ 
          success: true, 
          data: exportData,
          message: `Usage data exported successfully in ${format.toUpperCase()} format!`
        })
        
      default:
        return NextResponse.json({ 
          success: true, 
          data: mockUsageData 
        })
    }
  } catch (error) {
    console.error('Error fetching usage data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch usage data' },
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
      case 'refresh':
        // In production, this would trigger a data refresh from the database
        // For now, we'll simulate a refresh by updating timestamps
        
        const refreshTimestamp = new Date().toISOString()
        
        return NextResponse.json({ 
          success: true, 
          data: {
            ...mockUsageData,
            lastRefreshed: refreshTimestamp
          },
          message: 'Usage data refreshed successfully!'
        })
        
      case 'filter':
        const { period, startDate, endDate, model, projectId } = data
        
        // Apply filters to the data
        let filteredData = { ...mockUsageData }
        
        if (startDate && endDate) {
          filteredData.dailyUsage = filteredData.dailyUsage.filter(day => 
            day.date >= startDate && day.date <= endDate
          )
        }
        
        if (model && model !== 'all') {
          filteredData.modelUsage = filteredData.modelUsage.filter(m => m.model === model)
        }
        
        if (projectId && projectId !== 'all') {
          filteredData.projectUsage = filteredData.projectUsage.filter(p => p.projectId === projectId)
        }
        
        return NextResponse.json({ 
          success: true, 
          data: filteredData,
          message: 'Filters applied successfully!'
        })
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error processing usage action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process usage action' },
      { status: 500 }
    )
  }
}
