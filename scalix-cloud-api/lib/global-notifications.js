// ============================================================================
// GLOBAL NOTIFICATION SYSTEM
// ============================================================================
// Broadcast notifications from internal admin to all connected clients
// Supports real-time updates, targeted notifications, and delivery tracking
// ============================================================================

const admin = require('firebase-admin');

class GlobalNotificationManager {
  constructor() {
    this.db = admin.firestore();
    this.connectedClients = new Map(); // WebSocket connections
    this.notificationCache = new Map();
    this.cacheDuration = 5 * 60 * 1000; // 5 minutes
  }

  // ============================================================================
  // NOTIFICATION BROADCASTING
  // ============================================================================

  // Send global notification to all users
  async broadcastNotification(notificationData, senderInfo = {}) {
    const {
      title,
      message,
      type = 'info',
      priority = 'medium',
      category = 'system',
      targetUsers = 'all', // 'all', 'admins', 'users', or array of user IDs
      targetApplications = ['web', 'electron'], // which apps to notify
      expiresAt = null,
      actions = [],
      metadata = {}
    } = notificationData;

    const { senderId, senderRole } = senderInfo;

    console.log(`📢 Broadcasting notification: "${title}" to ${targetUsers}`);

    try {
      // Create notification document
      const notification = {
        id: this.generateNotificationId(),
        title,
        message,
        type,
        priority,
        category,
        targetUsers,
        targetApplications,
        senderId: senderId || 'system',
        senderRole: senderRole || 'admin',
        status: 'active',
        deliveryCount: 0,
        readCount: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        actions: actions || [],
        metadata: {
          ...metadata,
          broadcastId: crypto.randomUUID()
        }
      };

      // Store in database
      const docRef = await this.db.collection('globalNotifications').add(notification);

      // Update notification with document ID
      await docRef.update({ id: docRef.id });

      // Broadcast to connected clients immediately
      await this.broadcastToConnectedClients(notification);

      // Schedule delivery to offline users
      await this.scheduleOfflineDelivery(notification);

      console.log(`✅ Notification broadcasted: ${docRef.id}`);
      return {
        id: docRef.id,
        ...notification,
        delivered: true
      };

    } catch (error) {
      console.error('❌ Failed to broadcast notification:', error);
      throw error;
    }
  }

  // Send targeted notification to specific users
  async sendTargetedNotification(userIds, notificationData, senderInfo = {}) {
    console.log(`🎯 Sending targeted notification to ${userIds.length} users`);

    const results = [];

    for (const userId of userIds) {
      try {
        const result = await this.sendUserNotification(userId, notificationData, senderInfo);
        results.push({ userId, success: true, id: result.id });
      } catch (error) {
        results.push({ userId, success: false, error: error.message });
      }
    }

    return results;
  }

  // Send notification to specific user
  async sendUserNotification(userId, notificationData, senderInfo = {}) {
    const notification = {
      ...notificationData,
      userId,
      targetUsers: [userId],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Store in user's notifications
    const docRef = await this.db.collection('userNotifications').add(notification);

    // Try to deliver immediately if user is online
    await this.deliverToUser(userId, notification);

    return { id: docRef.id, ...notification };
  }

  // ============================================================================
  // REAL-TIME DELIVERY
  // ============================================================================

  // Register WebSocket connection
  registerClient(clientId, userId, application, wsConnection) {
    this.connectedClients.set(clientId, {
      userId,
      application,
      connection: wsConnection,
      connectedAt: new Date(),
      lastActivity: new Date()
    });

    console.log(`🔌 Client registered: ${clientId} (${userId})`);

    // Send pending notifications
    this.sendPendingNotifications(userId, clientId);

    return clientId;
  }

  // Unregister WebSocket connection
  unregisterClient(clientId) {
    this.connectedClients.delete(clientId);
    console.log(`🔌 Client unregistered: ${clientId}`);
  }

  // Update client activity
  updateClientActivity(clientId) {
    const client = this.connectedClients.get(clientId);
    if (client) {
      client.lastActivity = new Date();
    }
  }

  // Broadcast to all connected clients
  async broadcastToConnectedClients(notification) {
    const { targetUsers, targetApplications } = notification;
    let sentCount = 0;

    for (const [clientId, client] of this.connectedClients.entries()) {
      // Check if client should receive this notification
      if (this.shouldDeliverToClient(client, notification)) {
        try {
          client.connection.send(JSON.stringify({
            type: 'notification',
            data: notification
          }));
          sentCount++;

          // Update activity
          this.updateClientActivity(clientId);

        } catch (error) {
          console.error(`Failed to send to client ${clientId}:`, error);
          // Remove broken connection
          this.unregisterClient(clientId);
        }
      }
    }

    console.log(`📤 Broadcasted to ${sentCount} connected clients`);
    return sentCount;
  }

  // Check if notification should be delivered to client
  shouldDeliverToClient(client, notification) {
    const { targetUsers, targetApplications } = notification;

    // Check application target
    if (!targetApplications.includes(client.application)) {
      return false;
    }

    // Check user target
    if (targetUsers === 'all') {
      return true;
    }

    if (targetUsers === 'admins' && client.userId) {
      return this.isUserAdmin(client.userId);
    }

    if (targetUsers === 'users' && client.userId) {
      return !this.isUserAdmin(client.userId);
    }

    if (Array.isArray(targetUsers)) {
      return targetUsers.includes(client.userId);
    }

    return false;
  }

  // Send pending notifications to user
  async sendPendingNotifications(userId, clientId) {
    try {
      const client = this.connectedClients.get(clientId);
      if (!client) return;

      // Get unread notifications for user
      const pendingNotifications = await this.getPendingNotifications(userId);

      for (const notification of pendingNotifications) {
        try {
          client.connection.send(JSON.stringify({
            type: 'notification',
            data: notification
          }));

          // Mark as delivered
          await this.markNotificationDelivered(notification.id, userId);

        } catch (error) {
          console.error(`Failed to send pending notification ${notification.id}:`, error);
        }
      }

      if (pendingNotifications.length > 0) {
        console.log(`📨 Sent ${pendingNotifications.length} pending notifications to ${userId}`);
      }

    } catch (error) {
      console.error('Failed to send pending notifications:', error);
    }
  }

  // ============================================================================
  // OFFLINE DELIVERY & SCHEDULING
  // ============================================================================

  // Schedule delivery to offline users
  async scheduleOfflineDelivery(notification) {
    const { targetUsers } = notification;

    if (targetUsers === 'all') {
      // Get all users
      const usersSnapshot = await this.db.collection('users').get();
      const userIds = usersSnapshot.docs.map(doc => doc.id);

      await this.scheduleForUsers(userIds, notification);
    } else if (targetUsers === 'admins') {
      const adminIds = await this.getAdminUserIds();
      await this.scheduleForUsers(adminIds, notification);
    } else if (targetUsers === 'users') {
      const userIds = await this.getRegularUserIds();
      await this.scheduleForUsers(userIds, notification);
    } else if (Array.isArray(targetUsers)) {
      await this.scheduleForUsers(targetUsers, notification);
    }
  }

  // Schedule notifications for specific users
  async scheduleForUsers(userIds, notification) {
    const batch = this.db.batch();

    for (const userId of userIds) {
      const userNotificationRef = this.db.collection('userNotifications').doc();
      batch.set(userNotificationRef, {
        ...notification,
        userId,
        delivered: false,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    await batch.commit();
    console.log(`📅 Scheduled notification for ${userIds.length} users`);
  }

  // Deliver notification to specific user
  async deliverToUser(userId, notification) {
    // Find user's active connections
    const userConnections = Array.from(this.connectedClients.entries())
      .filter(([_, client]) => client.userId === userId);

    for (const [clientId, client] of userConnections) {
      try {
        client.connection.send(JSON.stringify({
          type: 'notification',
          data: notification
        }));

        await this.markNotificationDelivered(notification.id, userId);
        this.updateClientActivity(clientId);

      } catch (error) {
        console.error(`Failed to deliver to user ${userId}:`, error);
      }
    }
  }

  // ============================================================================
  // NOTIFICATION MANAGEMENT
  // ============================================================================

  // Get pending notifications for user
  async getPendingNotifications(userId) {
    const notificationsQuery = await this.db.collection('userNotifications')
      .where('userId', '==', userId)
      .where('delivered', '==', false)
      .where('read', '==', false)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    return notificationsQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  // Mark notification as delivered
  async markNotificationDelivered(notificationId, userId) {
    const notificationRef = this.db.collection('userNotifications').doc(notificationId);
    await notificationRef.update({
      delivered: true,
      deliveredAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  // Mark notification as read
  async markNotificationRead(notificationId, userId) {
    const notificationRef = this.db.collection('userNotifications').doc(notificationId);
    await notificationRef.update({
      read: true,
      readAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update global read count
    const globalNotificationRef = this.db.collection('globalNotifications').doc(notificationId);
    const globalDoc = await globalNotificationRef.get();

    if (globalDoc.exists) {
      await globalNotificationRef.update({
        readCount: admin.firestore.FieldValue.increment(1)
      });
    }
  }

  // Get notification statistics
  async getNotificationStats() {
    const stats = {
      totalNotifications: 0,
      totalDelivered: 0,
      totalRead: 0,
      activeNotifications: 0,
      connectedClients: this.connectedClients.size,
      recentNotifications: []
    };

    // Global notifications stats
    const globalSnapshot = await this.db.collection('globalNotifications').get();
    stats.totalNotifications = globalSnapshot.size;

    globalSnapshot.forEach(doc => {
      const data = doc.data();
      stats.totalDelivered += data.deliveryCount || 0;
      stats.totalRead += data.readCount || 0;
      if (data.status === 'active') {
        stats.activeNotifications++;
      }
    });

    // Recent notifications
    const recentQuery = await this.db.collection('globalNotifications')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    stats.recentNotifications = recentQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return stats;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  generateNotificationId() {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async isUserAdmin(userId) {
    try {
      const userDoc = await this.db.collection('users').doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        return userData.role === 'admin' || userData.role === 'super_admin';
      }
    } catch (error) {
      console.error('Error checking user admin status:', error);
    }
    return false;
  }

  async getAdminUserIds() {
    const adminQuery = await this.db.collection('users')
      .where('role', 'in', ['admin', 'super_admin'])
      .get();

    return adminQuery.docs.map(doc => doc.id);
  }

  async getRegularUserIds() {
    const userQuery = await this.db.collection('users')
      .where('role', '==', 'user')
      .get();

    return userQuery.docs.map(doc => doc.id);
  }

  // Clean up expired notifications
  async cleanupExpiredNotifications() {
    console.log('🧹 Cleaning up expired notifications...');

    const now = new Date();
    const expiredQuery = await this.db.collection('globalNotifications')
      .where('expiresAt', '<', now)
      .where('status', '==', 'active')
      .get();

    const batch = this.db.batch();

    expiredQuery.forEach(doc => {
      batch.update(doc.ref, {
        status: 'expired',
        expiredAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    await batch.commit();

    if (expiredQuery.size > 0) {
      console.log(`✅ Cleaned up ${expiredQuery.size} expired notifications`);
    }
  }

  // Get connected clients info
  getConnectedClientsInfo() {
    const clients = Array.from(this.connectedClients.entries()).map(([clientId, client]) => ({
      clientId,
      userId: client.userId,
      application: client.application,
      connectedAt: client.connectedAt,
      lastActivity: client.lastActivity
    }));

    return {
      total: clients.length,
      clients,
      byApplication: clients.reduce((acc, client) => {
        acc[client.application] = (acc[client.application] || 0) + 1;
        return acc;
      }, {})
    };
  }
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

const notificationManager = new GlobalNotificationManager();

// Express middleware for WebSocket support
function setupWebSocketSupport(server, sessionParser) {
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, request) => {
    // Parse session to get user info
    sessionParser(request, {}, () => {
      const userId = request.session?.userId || 'anonymous';
      const application = request.headers['x-application'] || 'web';
      const clientId = notificationManager.registerClient(
        `ws_${Date.now()}_${Math.random()}`,
        userId,
        application,
        ws
      );

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString());
          notificationManager.updateClientActivity(clientId);

          // Handle client messages
          if (data.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong' }));
          } else if (data.type === 'mark_read') {
            notificationManager.markNotificationRead(data.notificationId, userId);
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      });

      ws.on('close', () => {
        notificationManager.unregisterClient(clientId);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        notificationManager.unregisterClient(clientId);
      });
    });
  });

  console.log('🔌 WebSocket server initialized for notifications');
  return wss;
}

module.exports = {
  GlobalNotificationManager,
  notificationManager,
  setupWebSocketSupport
};
