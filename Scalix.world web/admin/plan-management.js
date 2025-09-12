/**
 * Plan Management Admin Interface
 * Add this to your web admin dashboard for dynamic plan management
 */

// Admin API client
class PlanAdminAPI {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
  }

  async getPlans() {
    const response = await fetch(`${this.baseURL}/admin/plans`);
    return response.json();
  }

  async createOrUpdatePlan(planData) {
    const response = await fetch(`${this.baseURL}/admin/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planData)
    });
    return response.json();
  }

  async deletePlan(planId) {
    const response = await fetch(`${this.baseURL}/admin/plans/${planId}`, {
      method: 'DELETE'
    });
    return response.json();
  }

  async bulkUpdatePlans(updates) {
    const response = await fetch(`${this.baseURL}/admin/plans/bulk-update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates })
    });
    return response.json();
  }

  async getAnalytics() {
    const response = await fetch(`${this.baseURL}/admin/plans/analytics`);
    return response.json();
  }
}

// React Admin Component
export function PlanManagementDashboard() {
  const [plans, setPlans] = React.useState([]);
  const [analytics, setAnalytics] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [editingPlan, setEditingPlan] = React.useState(null);
  const [showBulkUpdate, setShowBulkUpdate] = React.useState(false);

  const api = new PlanAdminAPI();

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansData, analyticsData] = await Promise.all([
        api.getPlans(),
        api.getAnalytics()
      ]);
      setPlans(plansData.plans || []);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async (planData) => {
    try {
      await api.createOrUpdatePlan(planData);
      await loadData(); // Refresh data
      setEditingPlan(null);
    } catch (error) {
      alert('Failed to save plan: ' + error.message);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      await api.deletePlan(planId);
      await loadData();
    } catch (error) {
      alert('Failed to delete plan: ' + error.message);
    }
  };

  const handleBulkUpdate = async (updates) => {
    try {
      await api.bulkUpdatePlans(updates);
      await loadData();
      setShowBulkUpdate(false);
    } catch (error) {
      alert('Bulk update failed: ' + error.message);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading plan data...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Plan Management Dashboard</h1>
        <p className="text-gray-600">Dynamically manage subscription tiers and limits for optimal monetization</p>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Current Month Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(analytics.planStats).map(([plan, stats]) => (
              <div key={plan} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 capitalize">{plan} Plan</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <div>Users: {stats.users}</div>
                  <div>Total Tokens: {formatNumber(stats.totalTokens)}</div>
                  <div>Total API Calls: {formatNumber(stats.totalCalls)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setEditingPlan({})}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create New Plan
        </button>
        <button
          onClick={() => setShowBulkUpdate(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Bulk Update Limits
        </button>
      </div>

      {/* Plans Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Subscription Plans</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage Limits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Features
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {plan.displayName}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${plan.price ? (plan.price / 100).toFixed(2) : 'Free'}/month
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {plan.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 space-y-1">
                      <div>AI Tokens: {formatNumber(plan.maxAiTokens)}</div>
                      <div>API Calls: {formatNumber(plan.maxApiCalls)}</div>
                      <div>Storage: {formatBytes(plan.maxStorage)}</div>
                      <div>Team Members: {plan.maxTeamMembers}</div>
                      {plan.maxProjects && <div>Projects: {formatNumber(plan.maxProjects)}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {plan.features && plan.features.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {plan.features.slice(0, 3).map(feature => (
                            <span key={feature} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              {feature.replace('_', ' ')}
                            </span>
                          ))}
                          {plan.features.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{plan.features.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">No features listed</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setEditingPlan(plan)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    {plan.name !== 'free' && (
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Editor Modal */}
      {editingPlan && (
        <PlanEditorModal
          plan={editingPlan}
          onSave={handleSavePlan}
          onCancel={() => setEditingPlan(null)}
        />
      )}

      {/* Bulk Update Modal */}
      {showBulkUpdate && (
        <BulkUpdateModal
          plans={plans}
          onSave={handleBulkUpdate}
          onCancel={() => setShowBulkUpdate(false)}
        />
      )}
    </div>
  );
}

// Plan Editor Modal Component
function PlanEditorModal({ plan, onSave, onCancel }) {
  const [formData, setFormData] = React.useState({
    id: plan.id || '',
    name: plan.name || '',
    displayName: plan.displayName || '',
    price: plan.price || 0,
    currency: plan.currency || 'usd',
    maxAiTokens: plan.maxAiTokens || 10000,
    maxApiCalls: plan.maxApiCalls || 100,
    maxStorage: plan.maxStorage || 1073741824,
    maxTeamMembers: plan.maxTeamMembers || 1,
    maxProjects: plan.maxProjects || 10,
    maxChats: plan.maxChats || 100,
    maxMessages: plan.maxMessages || 1000,
    maxFileUploads: plan.maxFileUploads || 100,
    maxFileSize: plan.maxFileSize || 10485760,
    requestsPerHour: plan.requestsPerHour || 100,
    requestsPerDay: plan.requestsPerDay || 1000,
    tokensPerHour: plan.tokensPerHour || 10000,
    tokensPerDay: plan.tokensPerDay || 50000,
    advancedFeatures: plan.advancedFeatures || false,
    prioritySupport: plan.prioritySupport || false,
    features: plan.features || [],
    description: plan.description || '',
    isActive: plan.isActive !== false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {plan.id ? 'Edit Plan' : 'Create New Plan'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan ID
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => updateFormData('id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => updateFormData('displayName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (cents)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => updateFormData('price', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => updateFormData('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="usd">USD</option>
                  <option value="eur">EUR</option>
                  <option value="gbp">GBP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) => updateFormData('isActive', e.target.value === 'active')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Usage Limits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  AI Tokens
                </label>
                <input
                  type="number"
                  value={formData.maxAiTokens}
                  onChange={(e) => updateFormData('maxAiTokens', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Calls
                </label>
                <input
                  type="number"
                  value={formData.maxApiCalls}
                  onChange={(e) => updateFormData('maxApiCalls', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Storage (bytes)
                </label>
                <input
                  type="number"
                  value={formData.maxStorage}
                  onChange={(e) => updateFormData('maxStorage', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Extended Limits */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Members
                </label>
                <input
                  type="number"
                  value={formData.maxTeamMembers}
                  onChange={(e) => updateFormData('maxTeamMembers', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Projects
                </label>
                <input
                  type="number"
                  value={formData.maxProjects}
                  onChange={(e) => updateFormData('maxProjects', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chats
                </label>
                <input
                  type="number"
                  value={formData.maxChats}
                  onChange={(e) => updateFormData('maxChats', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Messages
                </label>
                <input
                  type="number"
                  value={formData.maxMessages}
                  onChange={(e) => updateFormData('maxMessages', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Rate Limits */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requests/Hour
                </label>
                <input
                  type="number"
                  value={formData.requestsPerHour}
                  onChange={(e) => updateFormData('requestsPerHour', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requests/Day
                </label>
                <input
                  type="number"
                  value={formData.requestsPerDay}
                  onChange={(e) => updateFormData('requestsPerDay', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tokens/Hour
                </label>
                <input
                  type="number"
                  value={formData.tokensPerHour}
                  onChange={(e) => updateFormData('tokensPerHour', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tokens/Day
                </label>
                <input
                  type="number"
                  value={formData.tokensPerDay}
                  onChange={(e) => updateFormData('tokensPerDay', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Features and Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Bulk Update Modal Component
function BulkUpdateModal({ plans, onSave, onCancel }) {
  const [updates, setUpdates] = React.useState([]);

  const addUpdate = () => {
    setUpdates([...updates, { planId: '', field: '', value: '' }]);
  };

  const updateField = (index, field, value) => {
    const newUpdates = [...updates];
    newUpdates[index][field] = value;
    setUpdates(newUpdates);
  };

  const removeUpdate = (index) => {
    setUpdates(updates.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out incomplete updates
    const validUpdates = updates.filter(u => u.planId && u.field && u.value !== '');
    onSave(validUpdates);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Bulk Update Plan Limits</h2>
          <p className="text-gray-600 mb-6">
            Update multiple plan limits at once for gradual monetization adjustments.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-6">
              {updates.map((update, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <select
                    value={update.planId}
                    onChange={(e) => updateField(index, 'planId', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Plan</option>
                    {plans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.displayName}
                      </option>
                    ))}
                  </select>

                  <select
                    value={update.field}
                    onChange={(e) => updateField(index, 'field', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Field</option>
                    <option value="maxAiTokens">AI Tokens</option>
                    <option value="maxApiCalls">API Calls</option>
                    <option value="maxStorage">Storage (bytes)</option>
                    <option value="maxTeamMembers">Team Members</option>
                    <option value="maxProjects">Projects</option>
                    <option value="maxChats">Chats</option>
                    <option value="requestsPerHour">Requests/Hour</option>
                    <option value="requestsPerDay">Requests/Day</option>
                  </select>

                  <input
                    type="text"
                    placeholder="New Value"
                    value={update.value}
                    onChange={(e) => updateField(index, 'field', 'value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => removeUpdate(index)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={addUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Add Update
              </button>

              <div className="space-x-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  disabled={updates.length === 0}
                >
                  Apply Updates
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PlanManagementDashboard;
