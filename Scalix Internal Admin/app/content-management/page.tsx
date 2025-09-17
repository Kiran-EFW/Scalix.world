'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Loading } from '@/components/ui/loading'
import { Plus, Edit, Trash, Search, Filter, Eye, EyeOff } from 'lucide-react'
import { ContentManager } from '@/lib/content-types'
import type { ContentTile, ContentSection } from '@/lib/content-types'

const contentCategories = [
  'docs', 'features', 'tutorials', 'blog', 'community', 'pages'
]

export default function ContentManagementPage() {
  const [selectedCategory, setSelectedCategory] = useState('docs')
  const [selectedSection, setSelectedSection] = useState('')
  const [content, setContent] = useState<ContentTile[]>([])
  const [sections, setSections] = useState<ContentSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTile, setEditingTile] = useState<ContentTile | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  // Form states
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    icon: '',
    href: '',
    category: '',
    difficulty: 'Beginner' as const,
    duration: '',
    featured: false
  })

  useEffect(() => {
    loadContent()
  }, [selectedCategory, selectedSection])

  const loadContent = () => {
    setIsLoading(true)
    try {
      // Load sections for the selected category
      const categorySections = Object.values(ContentManager.getSection(selectedCategory) || {})
      setSections(categorySections.filter(s => s && typeof s === 'object' && 'tiles' in s))

      // Load tiles for the selected section
      if (selectedSection) {
        const sectionTiles = ContentManager.getTiles(`${selectedCategory}.${selectedSection}`)
        setContent(sectionTiles)
      } else {
        // Load all tiles for the category
        const allTiles: ContentTile[] = []
        categorySections.forEach(section => {
          if (section && 'tiles' in section) {
            allTiles.push(...(section as ContentSection).tiles)
          }
        })
        setContent(allTiles)
      }
    } catch (error) {
      console.error('Failed to load content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddContent = () => {
    if (!formData.title || !formData.description) {
      alert('Title and description are required')
      return
    }

    const newTile: ContentTile = {
      id: formData.id || `content-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      icon: formData.icon || '📄',
      href: formData.href,
      category: formData.category,
      difficulty: formData.difficulty,
      duration: formData.duration,
      featured: formData.featured
    }

    const sectionPath = selectedSection
      ? `${selectedCategory}.${selectedSection}`
      : `${selectedCategory}.general`

    const success = ContentManager.addTile(sectionPath, newTile)

    if (success) {
      loadContent()
      setShowAddModal(false)
      resetForm()
      alert('Content added successfully!')
    } else {
      alert('Failed to add content')
    }
  }

  const handleEditContent = (tile: ContentTile) => {
    setEditingTile(tile)
    setFormData({
      id: tile.id,
      title: tile.title,
      description: tile.description,
      icon: tile.icon || '',
      href: tile.href || '',
      category: tile.category || '',
      difficulty: tile.difficulty || 'Beginner',
      duration: tile.duration || '',
      featured: tile.featured || false
    })
    setShowEditModal(true)
  }

  const handleUpdateContent = () => {
    if (!editingTile || !formData.title || !formData.description) {
      alert('Title and description are required')
      return
    }

    const updatedTile: ContentTile = {
      ...editingTile,
      title: formData.title,
      description: formData.description,
      icon: formData.icon || '📄',
      href: formData.href,
      category: formData.category,
      difficulty: formData.difficulty,
      duration: formData.duration,
      featured: formData.featured
    }

    // Find which section this tile belongs to and update it
    let updated = false
    Object.keys(ContentManager.getSection(selectedCategory) || {}).forEach(sectionKey => {
      const sectionPath = `${selectedCategory}.${sectionKey}`
      const section = ContentManager.getSection(sectionPath)
      if (section && 'tiles' in section) {
        const tileIndex = (section as ContentSection).tiles.findIndex(t => t.id === editingTile.id)
        if (tileIndex >= 0) {
          (section as ContentSection).tiles[tileIndex] = updatedTile
          updated = true
        }
      }
    })

    if (updated) {
      loadContent()
      setShowEditModal(false)
      setEditingTile(null)
      resetForm()
      alert('Content updated successfully!')
    } else {
      alert('Failed to update content')
    }
  }

  const handleDeleteContent = (tileId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return

    let deleted = false
    Object.keys(ContentManager.getSection(selectedCategory) || {}).forEach(sectionKey => {
      const sectionPath = `${selectedCategory}.${sectionKey}`
      if (ContentManager.removeTile(sectionPath, tileId)) {
        deleted = true
      }
    })

    if (deleted) {
      loadContent()
      alert('Content deleted successfully!')
    } else {
      alert('Failed to delete content')
    }
  }

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      icon: '',
      href: '',
      category: '',
      difficulty: 'Beginner',
      duration: '',
      featured: false
    })
  }

  const filteredContent = content.filter(tile => {
    const matchesSearch = tile.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tile.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterCategory === 'all' || tile.category === filterCategory
    return matchesSearch && matchesFilter
  })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      docs: 'bg-blue-100 text-blue-800',
      features: 'bg-green-100 text-green-800',
      tutorials: 'bg-yellow-100 text-yellow-800',
      blog: 'bg-purple-100 text-purple-800',
      community: 'bg-red-100 text-red-800',
      pages: 'bg-indigo-100 text-indigo-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loading />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600 mt-2">
              Manage all content across the Scalix platform from one central location
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Content
          </Button>
        </div>

        {/* Content Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{content.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Featured Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {content.filter(tile => tile.featured).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{sections.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {content.filter(tile => tile.href).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Management Interface */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-6">
            {contentCategories.map(category => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {contentCategories.map(category => (
            <TabsContent key={category} value={category} className="space-y-6">
              {/* Section Selector */}
              {sections.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Section</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={selectedSection === '' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedSection('')}
                      >
                        All Sections
                      </Button>
                      {sections.map(section => (
                        <Button
                          key={section.id}
                          variant={selectedSection === section.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedSection(section.id)}
                        >
                          {section.title}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Search and Filter */}
              <Card>
                <CardHeader>
                  <CardTitle>Content List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Categories</option>
                      <option value="docs">Documentation</option>
                      <option value="tutorial">Tutorials</option>
                      <option value="features">Features</option>
                      <option value="blog">Blog</option>
                      <option value="community">Community</option>
                    </select>
                  </div>

                  {/* Content Table */}
                  <div className="space-y-4">
                    {filteredContent.map(tile => (
                      <Card key={tile.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{tile.icon}</span>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{tile.title}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    {tile.category && (
                                      <Badge className={getCategoryColor(tile.category)}>
                                        {tile.category}
                                      </Badge>
                                    )}
                                    {tile.featured && (
                                      <Badge className="bg-yellow-100 text-yellow-800">
                                        Featured
                                      </Badge>
                                    )}
                                    {tile.difficulty && (
                                      <Badge variant="outline">
                                        {tile.difficulty}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm mb-2">{tile.description}</p>
                              {tile.href && (
                                <p className="text-blue-600 text-sm">{tile.href}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditContent(tile)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteContent(tile.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {filteredContent.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No content found matching your criteria.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Add Content Modal */}
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Add New Content</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter content title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter content description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    placeholder="📄"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select category</option>
                    <option value="docs">Documentation</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="features">Features</option>
                    <option value="blog">Blog</option>
                    <option value="community">Community</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="href">URL Path</Label>
                <Input
                  id="href"
                  value={formData.href}
                  onChange={(e) => setFormData({...formData, href: e.target.value})}
                  placeholder="/docs/new-content"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="15 min"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="featured">Featured Content</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddContent}>
                  Add Content
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        {/* Edit Content Modal */}
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Edit Content</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter content title"
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter content description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-icon">Icon</Label>
                  <Input
                    id="edit-icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    placeholder="📄"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select category</option>
                    <option value="docs">Documentation</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="features">Features</option>
                    <option value="blog">Blog</option>
                    <option value="community">Community</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-href">URL Path</Label>
                <Input
                  id="edit-href"
                  value={formData.href}
                  onChange={(e) => setFormData({...formData, href: e.target.value})}
                  placeholder="/docs/new-content"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-difficulty">Difficulty</Label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="edit-duration">Duration</Label>
                  <Input
                    id="edit-duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="15 min"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="edit-featured">Featured Content</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateContent}>
                  Update Content
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  )
}
