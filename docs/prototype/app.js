// Procurement System Prototype Application
// Client-side JavaScript with localStorage persistence

const app = {
    currentUser: null,
    currentRole: null,
    
    // Initialize the application
    init() {
        // Check if user is logged in
        const savedUser = localStorage.getItem('currentUser');
        const savedRole = localStorage.getItem('currentRole');
        
        if (savedUser && savedRole) {
            this.currentUser = savedUser;
            this.currentRole = savedRole;
            this.showApp();
        } else {
            this.showLogin();
        }
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize sample data if first time
        if (!localStorage.getItem('initialized')) {
            this.initializeSampleData();
            localStorage.setItem('initialized', 'true');
        }
    },
    
    // Setup event listeners
    setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('[data-view]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.currentTarget.getAttribute('data-view');
                this.switchView(view);
            });
        });
        
        // New request form
        const form = document.getElementById('newRequestForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitRequest();
            });
        }
    },
    
    // Login function
    login() {
        const userName = document.getElementById('userName').value.trim();
        const userRole = document.getElementById('userRole').value;
        
        if (!userName) {
            alert('Please enter your name');
            return;
        }
        
        this.currentUser = userName;
        this.currentRole = userRole;
        
        localStorage.setItem('currentUser', userName);
        localStorage.setItem('currentRole', userRole);
        
        this.showApp();
    },
    
    // Logout function
    logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentRole');
        this.currentUser = null;
        this.currentRole = null;
        location.reload();
    },
    
    // Show login screen
    showLogin() {
        document.getElementById('loginScreen').classList.remove('d-none');
        document.getElementById('appScreen').classList.add('d-none');
    },
    
    // Show main app
    showApp() {
        document.getElementById('loginScreen').classList.add('d-none');
        document.getElementById('appScreen').classList.remove('d-none');
        
        // Update user info in navbar
        document.getElementById('currentUser').textContent = this.currentUser;
        document.getElementById('currentRole').textContent = this.getRoleLabel(this.currentRole);
        
        // Show/hide role-specific menu items
        this.updateRoleVisibility();
        
        // Load dashboard
        this.switchView('dashboard');
    },
    
    // Update UI based on role
    updateRoleVisibility() {
        // Hide all role-specific elements
        document.querySelectorAll('[class*="-only"]').forEach(el => {
            el.style.display = 'none';
        });
        
        // Show elements for current role
        document.querySelectorAll(`.${this.currentRole}-only`).forEach(el => {
            el.style.display = '';
        });
    },
    
    // Get role label
    getRoleLabel(role) {
        const labels = {
            requester: 'Requester',
            dept_head: 'Department Head',
            procurement: 'Procurement Officer',
            finance: 'Finance Officer'
        };
        return labels[role] || role;
    },
    
    // Switch between views
    switchView(viewName) {
        // Hide all views
        document.querySelectorAll('.view-content').forEach(view => {
            view.classList.add('d-none');
        });
        
        // Update sidebar active state
        document.querySelectorAll('[data-view]').forEach(link => {
            link.classList.remove('active');
        });
        
        // Show selected view
        const view = document.getElementById(`${viewName}View`);
        if (view) {
            view.classList.remove('d-none');
            document.querySelector(`[data-view="${viewName}"]`)?.classList.add('active');
            
            // Load view content
            this.loadView(viewName);
        }
    },
    
    // Load view content
    loadView(viewName) {
        switch(viewName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'requests':
                this.loadRequests();
                break;
            case 'newRequest':
                this.loadNewRequestForm();
                break;
            case 'purchaseOrders':
                this.loadPurchaseOrders();
                break;
        }
    },
    
    // Load dashboard
    loadDashboard() {
        const requests = this.getRequests();
        const pos = this.getPurchaseOrders();
        
        // Calculate stats
        const stats = {
            total: requests.length,
            pending: requests.filter(r => r.status === 'pending').length,
            approved: requests.filter(r => r.status === 'approved').length,
            rejected: requests.filter(r => r.status === 'rejected').length,
            pos: pos.length
        };
        
        // Render stats cards
        const statsHtml = `
            <div class="col-md-3">
                <div class="card stat-card primary">
                    <div class="stat-value">${stats.total}</div>
                    <div class="stat-label">Total Requests</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stat-card warning">
                    <div class="stat-value">${stats.pending}</div>
                    <div class="stat-label">Pending Approval</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stat-card success">
                    <div class="stat-value">${stats.approved}</div>
                    <div class="stat-label">Approved</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stat-card danger">
                    <div class="stat-value">${stats.rejected}</div>
                    <div class="stat-label">Rejected</div>
                </div>
            </div>
        `;
        
        document.getElementById('dashboardStats').innerHTML = statsHtml;
        
        // Show recent activity based on role
        let contentHtml = '<h4 class="mt-4">Recent Activity</h4>';
        
        if (this.currentRole === 'dept_head') {
            const pending = requests.filter(r => r.status === 'pending').slice(0, 5);
            contentHtml += this.renderRequestList(pending, true);
        } else if (this.currentRole === 'procurement') {
            const approved = requests.filter(r => r.status === 'approved').slice(0, 5);
            contentHtml += this.renderRequestList(approved, true);
        } else {
            const myRequests = requests.filter(r => r.requester === this.currentUser).slice(0, 5);
            contentHtml += this.renderRequestList(myRequests, true);
        }
        
        document.getElementById('dashboardContent').innerHTML = contentHtml;
        
        // Update counts in sidebar
        document.getElementById('requestCount').textContent = stats.total;
        document.getElementById('poCount').textContent = stats.pos;
    },
    
    // Load requests view
    loadRequests(filter = 'all') {
        let requests = this.getRequests();
        
        // Apply role-based filtering
        if (this.currentRole === 'requester') {
            requests = requests.filter(r => r.requester === this.currentUser);
        } else if (this.currentRole === 'dept_head') {
            // Show requests that need approval or have been processed
            requests = requests.filter(r => r.status === 'pending' || r.approver === this.currentUser);
        }
        
        // Apply status filter
        if (filter !== 'all') {
            requests = requests.filter(r => r.status === filter);
        }
        
        const html = this.renderRequestList(requests);
        document.getElementById('requestsList').innerHTML = html;
    },
    
    // Render request list
    renderRequestList(requests, compact = false) {
        if (requests.length === 0) {
            return `
                <div class="empty-state">
                    <i class="bi bi-inbox"></i>
                    <p>No requests found</p>
                </div>
            `;
        }
        
        return requests.map(req => `
            <div class="card request-card ${req.status} fade-in">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h5 class="card-title mb-1">${req.title}</h5>
                            <p class="text-muted small mb-2">
                                <i class="bi bi-building"></i> ${req.department} | 
                                <i class="bi bi-person"></i> ${req.requester} |
                                <i class="bi bi-calendar"></i> ${new Date(req.created).toLocaleDateString()}
                            </p>
                            ${compact ? '' : `<p class="card-text">${req.description}</p>`}
                        </div>
                        <div class="text-end">
                            <span class="badge status-${req.status}">${req.status.toUpperCase()}</span>
                            <span class="badge priority-${req.priority} ms-1">${req.priority.toUpperCase()}</span>
                            <div class="mt-2">
                                <strong class="text-primary">GHS ${req.amount.toLocaleString()}</strong>
                            </div>
                        </div>
                    </div>
                    <div class="mt-3 action-buttons">
                        <button class="btn btn-sm btn-outline-primary" onclick="app.viewRequest('${req.id}')">
                            <i class="bi bi-eye"></i> View Details
                        </button>
                        ${this.currentRole === 'dept_head' && req.status === 'pending' ? `
                            <button class="btn btn-sm btn-success" onclick="app.approveRequest('${req.id}')">
                                <i class="bi bi-check-circle"></i> Approve
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="app.rejectRequest('${req.id}')">
                                <i class="bi bi-x-circle"></i> Reject
                            </button>
                        ` : ''}
                        ${this.currentRole === 'procurement' && req.status === 'approved' && !req.poId ? `
                            <button class="btn btn-sm btn-info" onclick="app.createPO('${req.id}')">
                                <i class="bi bi-receipt"></i> Create PO
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    // Load new request form
    loadNewRequestForm() {
        // Initialize with one item row
        this.addItem();
    },
    
    // Add item to request form
    addItem() {
        const itemsList = document.getElementById('itemsList');
        const itemId = Date.now();
        const itemRow = document.createElement('div');
        itemRow.className = 'item-row';
        itemRow.id = `item-${itemId}`;
        itemRow.innerHTML = `
            <input type="text" class="form-control form-control-sm" placeholder="Item name" required>
            <input type="number" class="form-control form-control-sm" placeholder="Qty" required min="1" style="max-width: 100px;">
            <input type="text" class="form-control form-control-sm" placeholder="Unit" required style="max-width: 100px;">
            <button type="button" class="btn btn-sm btn-outline-danger btn-remove" onclick="app.removeItem('${itemId}')">
                <i class="bi bi-trash"></i>
            </button>
        `;
        itemsList.appendChild(itemRow);
    },
    
    // Remove item from request form
    removeItem(itemId) {
        const item = document.getElementById(`item-${itemId}`);
        if (item) {
            item.remove();
        }
    },
    
    // Submit new request
    submitRequest() {
        const title = document.getElementById('requestTitle').value;
        const department = document.getElementById('requestDepartment').value;
        const description = document.getElementById('requestDescription').value;
        const priority = document.getElementById('requestPriority').value;
        const amount = parseFloat(document.getElementById('requestAmount').value);
        
        // Collect items
        const items = [];
        document.querySelectorAll('.item-row').forEach(row => {
            const inputs = row.querySelectorAll('input');
            if (inputs[0].value && inputs[1].value && inputs[2].value) {
                items.push({
                    name: inputs[0].value,
                    quantity: parseInt(inputs[1].value),
                    unit: inputs[2].value
                });
            }
        });
        
        const request = {
            id: 'REQ-' + Date.now(),
            title,
            department,
            description,
            priority,
            amount,
            items,
            requester: this.currentUser,
            status: 'pending',
            created: new Date().toISOString(),
            history: [{
                action: 'created',
                user: this.currentUser,
                timestamp: new Date().toISOString()
            }]
        };
        
        // Save request
        const requests = this.getRequests();
        requests.push(request);
        localStorage.setItem('requests', JSON.stringify(requests));
        
        // Reset form
        document.getElementById('newRequestForm').reset();
        document.getElementById('itemsList').innerHTML = '';
        
        // Show success message
        this.showNotification('Request submitted successfully!', 'success');
        
        // Switch to requests view
        this.switchView('requests');
    },
    
    // View request details
    viewRequest(requestId) {
        const request = this.getRequests().find(r => r.id === requestId);
        if (!request) return;
        
        const modal = new bootstrap.Modal(document.getElementById('requestDetailModal'));
        
        let detailHtml = `
            <div class="mb-3">
                <h5>${request.title}</h5>
                <span class="badge status-${request.status}">${request.status.toUpperCase()}</span>
                <span class="badge priority-${request.priority} ms-1">${request.priority.toUpperCase()}</span>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <p class="mb-1"><strong>Request ID:</strong> ${request.id}</p>
                    <p class="mb-1"><strong>Department:</strong> ${request.department}</p>
                    <p class="mb-1"><strong>Requester:</strong> ${request.requester}</p>
                </div>
                <div class="col-md-6">
                    <p class="mb-1"><strong>Created:</strong> ${new Date(request.created).toLocaleString()}</p>
                    <p class="mb-1"><strong>Amount:</strong> GHS ${request.amount.toLocaleString()}</p>
                    ${request.approver ? `<p class="mb-1"><strong>Approver:</strong> ${request.approver}</p>` : ''}
                </div>
            </div>
            <div class="mb-3">
                <strong>Description:</strong>
                <p>${request.description}</p>
            </div>
            <div class="mb-3">
                <strong>Items:</strong>
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${request.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>${item.unit}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${request.history ? `
                <div class="mb-3">
                    <strong>History:</strong>
                    <div class="timeline mt-2">
                        ${request.history.map(h => `
                            <div class="timeline-item">
                                <div class="timeline-time">${new Date(h.timestamp).toLocaleString()}</div>
                                <div class="timeline-content">
                                    <strong>${h.action}</strong> by ${h.user}
                                    ${h.comment ? `<br><em>${h.comment}</em>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
        
        document.getElementById('requestDetailBody').innerHTML = detailHtml;
        
        let actionsHtml = '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>';
        
        if (this.currentRole === 'dept_head' && request.status === 'pending') {
            actionsHtml = `
                <button type="button" class="btn btn-success" onclick="app.approveRequest('${request.id}'); bootstrap.Modal.getInstance(document.getElementById('requestDetailModal')).hide();">
                    <i class="bi bi-check-circle"></i> Approve
                </button>
                <button type="button" class="btn btn-danger" onclick="app.rejectRequest('${request.id}'); bootstrap.Modal.getInstance(document.getElementById('requestDetailModal')).hide();">
                    <i class="bi bi-x-circle"></i> Reject
                </button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            `;
        } else if (this.currentRole === 'procurement' && request.status === 'approved' && !request.poId) {
            actionsHtml = `
                <button type="button" class="btn btn-info" onclick="app.createPO('${request.id}'); bootstrap.Modal.getInstance(document.getElementById('requestDetailModal')).hide();">
                    <i class="bi bi-receipt"></i> Create Purchase Order
                </button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            `;
        }
        
        document.getElementById('requestDetailActions').innerHTML = actionsHtml;
        modal.show();
    },
    
    // Approve request
    approveRequest(requestId) {
        const requests = this.getRequests();
        const request = requests.find(r => r.id === requestId);
        if (!request) return;
        
        request.status = 'approved';
        request.approver = this.currentUser;
        request.approvedDate = new Date().toISOString();
        request.history.push({
            action: 'approved',
            user: this.currentUser,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('requests', JSON.stringify(requests));
        this.showNotification('Request approved successfully!', 'success');
        this.loadView(document.querySelector('.view-content:not(.d-none)').id.replace('View', ''));
    },
    
    // Reject request
    rejectRequest(requestId) {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;
        
        const requests = this.getRequests();
        const request = requests.find(r => r.id === requestId);
        if (!request) return;
        
        request.status = 'rejected';
        request.approver = this.currentUser;
        request.rejectedDate = new Date().toISOString();
        request.rejectionReason = reason;
        request.history.push({
            action: 'rejected',
            user: this.currentUser,
            timestamp: new Date().toISOString(),
            comment: reason
        });
        
        localStorage.setItem('requests', JSON.stringify(requests));
        this.showNotification('Request rejected', 'warning');
        this.loadView(document.querySelector('.view-content:not(.d-none)').id.replace('View', ''));
    },
    
    // Create Purchase Order
    createPO(requestId) {
        const requests = this.getRequests();
        const request = requests.find(r => r.id === requestId);
        if (!request) return;
        
        const supplier = prompt('Enter supplier name:');
        if (!supplier) return;
        
        const po = {
            id: 'PO-' + Date.now(),
            requestId: request.id,
            requestTitle: request.title,
            supplier: supplier,
            amount: request.amount,
            items: request.items,
            status: 'issued',
            createdBy: this.currentUser,
            created: new Date().toISOString()
        };
        
        // Save PO
        const pos = this.getPurchaseOrders();
        pos.push(po);
        localStorage.setItem('purchaseOrders', JSON.stringify(pos));
        
        // Update request
        request.status = 'po_issued';
        request.poId = po.id;
        request.history.push({
            action: 'po_created',
            user: this.currentUser,
            timestamp: new Date().toISOString(),
            comment: `PO ${po.id} created for supplier: ${supplier}`
        });
        
        localStorage.setItem('requests', JSON.stringify(requests));
        this.showNotification('Purchase Order created successfully!', 'success');
        this.loadView(document.querySelector('.view-content:not(.d-none)').id.replace('View', ''));
    },
    
    // Load purchase orders
    loadPurchaseOrders() {
        const pos = this.getPurchaseOrders();
        
        if (pos.length === 0) {
            document.getElementById('purchaseOrdersList').innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-receipt"></i>
                    <p>No purchase orders yet</p>
                </div>
            `;
            return;
        }
        
        const html = pos.map(po => `
            <div class="card po-card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <div class="po-number">${po.id}</div>
                            <h5 class="mt-2">${po.requestTitle}</h5>
                            <p class="text-muted mb-2">
                                <i class="bi bi-building"></i> Supplier: ${po.supplier} |
                                <i class="bi bi-calendar"></i> ${new Date(po.created).toLocaleDateString()}
                            </p>
                        </div>
                        <div class="text-end">
                            <span class="badge bg-success">${po.status.toUpperCase()}</span>
                            <div class="mt-2">
                                <strong class="text-success">GHS ${po.amount.toLocaleString()}</strong>
                            </div>
                        </div>
                    </div>
                    <div class="mt-3">
                        <strong>Items:</strong>
                        <ul class="small mb-0">
                            ${po.items.map(item => `<li>${item.name} - ${item.quantity} ${item.unit}</li>`).join('')}
                        </ul>
                    </div>
                    ${po.status !== 'delivered' ? `
                        <div class="mt-3">
                            <button class="btn btn-sm btn-success" onclick="app.markDelivered('${po.id}')">
                                <i class="bi bi-check-circle"></i> Mark as Delivered
                            </button>
                        </div>
                    ` : `
                        <div class="mt-3 text-success">
                            <i class="bi bi-check-circle-fill"></i> Delivered on ${new Date(po.deliveredDate).toLocaleDateString()}
                        </div>
                    `}
                </div>
            </div>
        `).join('');
        
        document.getElementById('purchaseOrdersList').innerHTML = html;
    },
    
    // Mark PO as delivered
    markDelivered(poId) {
        const pos = this.getPurchaseOrders();
        const po = pos.find(p => p.id === poId);
        if (!po) return;
        
        po.status = 'delivered';
        po.deliveredDate = new Date().toISOString();
        po.deliveredBy = this.currentUser;
        
        localStorage.setItem('purchaseOrders', JSON.stringify(pos));
        
        // Update associated request
        const requests = this.getRequests();
        const request = requests.find(r => r.id === po.requestId);
        if (request) {
            request.status = 'delivered';
            request.history.push({
                action: 'delivered',
                user: this.currentUser,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('requests', JSON.stringify(requests));
        }
        
        this.showNotification('Purchase Order marked as delivered!', 'success');
        this.loadPurchaseOrders();
    },
    
    // Filter requests
    filterRequests(status) {
        this.loadRequests(status);
    },
    
    // Get requests from localStorage
    getRequests() {
        const requests = localStorage.getItem('requests');
        return requests ? JSON.parse(requests) : [];
    },
    
    // Get purchase orders from localStorage
    getPurchaseOrders() {
        const pos = localStorage.getItem('purchaseOrders');
        return pos ? JSON.parse(pos) : [];
    },
    
    // Show notification
    showNotification(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} alert-dismissible fade show`;
        toast.role = 'alert';
        toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Create container if doesn't exist
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(toast);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    },
    
    // Initialize sample data
    initializeSampleData() {
        const sampleRequests = [
            {
                id: 'REQ-1701234567890',
                title: 'Surgical Gloves and Masks',
                department: 'Surgery',
                description: 'Monthly supply of surgical gloves (sizes 7-9) and N95 masks for operating theatre',
                priority: 'high',
                amount: 15000,
                items: [
                    { name: 'Surgical Gloves Size 7', quantity: 100, unit: 'boxes' },
                    { name: 'Surgical Gloves Size 8', quantity: 150, unit: 'boxes' },
                    { name: 'N95 Masks', quantity: 500, unit: 'pieces' }
                ],
                requester: 'Dr. Kofi Mensah',
                status: 'pending',
                created: new Date('2025-11-15').toISOString(),
                history: [{
                    action: 'created',
                    user: 'Dr. Kofi Mensah',
                    timestamp: new Date('2025-11-15').toISOString()
                }]
            },
            {
                id: 'REQ-1701234567891',
                title: 'Laboratory Reagents',
                department: 'Laboratory',
                description: 'Chemical reagents for blood testing and analysis',
                priority: 'medium',
                amount: 8500,
                items: [
                    { name: 'Hemoglobin Reagent', quantity: 10, unit: 'bottles' },
                    { name: 'Glucose Test Strips', quantity: 500, unit: 'pieces' }
                ],
                requester: 'Jane Doe',
                status: 'approved',
                approver: 'Head of Laboratory',
                created: new Date('2025-11-10').toISOString(),
                approvedDate: new Date('2025-11-12').toISOString(),
                history: [
                    {
                        action: 'created',
                        user: 'Jane Doe',
                        timestamp: new Date('2025-11-10').toISOString()
                    },
                    {
                        action: 'approved',
                        user: 'Head of Laboratory',
                        timestamp: new Date('2025-11-12').toISOString()
                    }
                ]
            }
        ];
        
        localStorage.setItem('requests', JSON.stringify(sampleRequests));
        localStorage.setItem('purchaseOrders', JSON.stringify([]));
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
