import AuditLog from '../models/AuditLog.js';

export const auditLog = (action, entity) => {
  return async (req, res, next) => {
    // Store original methods
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);
    
    // Override response methods to capture the response
    let responseData;
    
    res.json = function(data) {
      responseData = data;
      return originalJson(data);
    };
    
    res.send = function(data) {
      responseData = data;
      return originalSend(data);
    };
    
    // After response is sent
    res.on('finish', async () => {
      try {
        // Only log successful operations (2xx status codes)
        if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
          // Extract entity ID from various possible sources
          let entityId = req.params.id;
          if (!entityId && responseData) {
            entityId = responseData._id || responseData.id || 
                      responseData.request?._id || responseData.request?.id ||
                      responseData.purchaseOrder?._id || responseData.purchaseOrder?.id ||
                      responseData.user?._id || responseData.user?.id;
          }
          
          if (entityId) {
            await AuditLog.create({
              action,
              entity,
              entityId,
              userId: req.user._id,
              userName: req.user.name,
              userRole: req.user.role,
              changes: {
                body: req.body,
                params: req.params
              },
              ipAddress: req.ip || req.connection.remoteAddress,
              userAgent: req.get('user-agent'),
              metadata: {
                method: req.method,
                path: req.path,
                statusCode: res.statusCode
              }
            });
          }
        }
      } catch (error) {
        // Don't fail the request if audit logging fails
        console.error('Audit log error:', error);
      }
    });
    
    next();
  };
};
