# Field Trip Report: Korle-Bu Teaching Hospital Procurement System

**Student Name:** Emmanuella Nana Ama Weir  
**Index Number:** 1704895585  
**Lecturer:** DR. MARTIN MABEIFAM UJAKPA  
**Date:** NOVEMBER 2025  
**Institution Visited:** Korle-Bu Teaching Hospital  
**Department:** Procurement and Supply Chain Management

---

## 1.1 Introduction

This report documents the findings from a comprehensive field trip to Korle-Bu Teaching Hospital (KBTH), Ghana's premier tertiary healthcare institution. The visit focused on examining the hospital's procurement and supply chain management practices, with particular emphasis on understanding the challenges, processes, and technological opportunities within their current operational framework.

Korle-Bu Teaching Hospital serves as a major referral center for the southern sector of Ghana and neighboring countries, handling complex medical cases and providing specialized healthcare services. The procurement department plays a critical role in ensuring the continuous availability of medical supplies, equipment, pharmaceuticals, and other essential resources necessary for the hospital's operations.

The primary objective of this field trip was to observe and analyze the existing procurement workflows, identify pain points in the current system, and propose technology-driven solutions that could enhance efficiency, transparency, and accountability in the procurement process.

## 1.2 Background and Context

Korle-Bu Teaching Hospital, established in 1923, stands as one of West Africa's largest medical facilities, with over 2,000 beds and serving approximately 1 million patients annually. The institution's procurement department manages a complex supply chain involving thousands of items ranging from basic consumables to sophisticated medical equipment.

The procurement process at KBTH operates within the framework of Ghana's Public Procurement Act (Act 663, 2003, as amended by Act 914, 2016), which mandates transparency, competitive bidding, and value for money in all public sector acquisitions. However, the hospital faces unique challenges due to the critical nature of healthcare delivery, where stockouts can directly impact patient outcomes and, in some cases, be life-threatening.

During the visit, it was observed that the procurement department handles multiple request streams from various clinical and non-clinical departments simultaneously. The current system relies heavily on manual paperwork, physical approval workflows, and spreadsheet-based tracking mechanisms, leading to delays and occasional miscommunications.

## 1.3 Observed Procurement Workflow

The existing procurement process at Korle-Bu Teaching Hospital follows a multi-stage workflow:

### 1.3.1 Request Initiation
Departments identify their needs and complete physical requisition forms detailing the items required, quantities, specifications, and justifications. These forms are submitted to the departmental head for initial review and authorization.

### 1.3.2 Department-Level Approval
The head of department reviews the request for necessity, appropriateness, and alignment with departmental budgets. Approved requests are signed and forwarded to the procurement department through internal mail or physical delivery by staff members.

### 1.3.3 Procurement Processing
The procurement office receives requests and performs several key activities:
- Verification of request completeness and compliance with procurement policies
- Budget availability confirmation with the finance department
- Supplier identification and quotation solicitation
- Comparative analysis of quotations based on price, quality, and delivery terms
- Preparation of procurement documentation

### 1.3.4 Approval Hierarchy
Depending on the financial threshold, requests follow different approval routes:
- Minor procurements (below GHS 10,000): Procurement Manager approval
- Medium procurements (GHS 10,000 - 50,000): Deputy Director approval
- Major procurements (above GHS 50,000): Entity Tender Committee review

### 1.3.5 Purchase Order Generation
Once approvals are obtained, purchase orders are generated manually using templates, printed, signed, and dispatched to suppliers. Copies are filed in the procurement office and shared with the finance department for payment processing.

### 1.3.6 Delivery and Verification
Goods received are inspected by the stores department, verified against the purchase order specifications, and accepted if compliant. Discrepancies trigger a notification process back to procurement for resolution.

## 1.4 Identified Challenges

The field trip revealed several significant challenges in the current procurement system:

### 1.4.1 Process Delays
The manual nature of the workflow introduces substantial time lags between request initiation and fulfillment. A typical request can take 2-4 weeks for processing, with urgent items sometimes delayed due to missing signatures or misplaced documents.

### 1.4.2 Lack of Real-Time Visibility
Requesting departments have limited visibility into the status of their submissions. Staff often resort to phone calls or physical visits to the procurement office to track progress, consuming valuable time for both parties.

### 1.4.3 Documentation Management
Physical files accumulate rapidly, creating storage challenges and making historical data retrieval difficult. The absence of a centralized digital repository means that past procurement decisions and supplier performance data are not readily accessible for analysis.

### 1.4.4 Approval Bottlenecks
Key decision-makers often travel for meetings, conferences, or clinical duties, causing approval delays when physical signatures are required. There is no mechanism for remote approval or delegation during absences.

### 1.4.5 Data Fragmentation
Information about requests, budgets, suppliers, and delivery status resides in disconnected spreadsheets and filing systems, making comprehensive reporting and analytics challenging.

### 1.4.6 Accountability and Audit Trail
Reconstructing the complete history of a procurement transaction for audit purposes requires gathering documents from multiple locations and individuals, a time-consuming and error-prone process.

### 1.4.7 Limited Budget Control
Without real-time integration between procurement requests and budget systems, there is a risk of over-committing funds or discovering budget shortfalls late in the procurement cycle.

## 1.5 Proposed Solution: Automated Procurement System

Based on the observed challenges, an automated procurement management system is proposed to modernize and streamline the hospital's procurement operations. The system would serve as a comprehensive digital platform enabling end-to-end management of the procurement lifecycle.

### 1.5.1 Core System Features

**Request Management Module**
- Electronic submission of procurement requests with structured templates
- Automatic validation of required fields and supporting documentation
- Categorization by item type, urgency, and estimated value
- Attachment support for specifications, drawings, and reference documents

**Workflow Automation**
- Configurable approval routing based on request value and category
- Automated notifications to approvers via email and SMS
- Escalation mechanisms for overdue approvals
- Mobile-responsive interface for approvals on-the-go

**Supplier Management**
- Centralized supplier database with performance ratings
- Automated quotation solicitation and comparison
- Vendor portal for quote submission and order confirmation
- Supplier performance tracking and analytics

**Purchase Order Management**
- Automated PO generation with sequential numbering
- Digital signatures and approval stamps
- Electronic transmission to suppliers
- Amendment tracking and version control

**Budget Integration**
- Real-time budget availability checking before approval
- Automatic reservation of funds upon approval
- Budget utilization reporting and forecasting
- Integration with financial management systems

**Tracking and Monitoring**
- Real-time status dashboard for all stakeholders
- Milestone tracking from request to delivery
- Expected delivery date monitoring and alerts
- Customizable reports for management and audits

**Audit Trail and Compliance**
- Comprehensive logging of all system activities
- Timestamp and user attribution for every action
- Tamper-proof record keeping
- Compliance reporting for internal and external audits

## 1.6 System Architecture and Technology Stack

The proposed system employs a modern three-tier architecture designed for scalability, security, and maintainability.

### 1.6.1 Presentation Layer
A responsive web application built with contemporary frameworks (such as React or Vue.js) providing an intuitive user interface accessible from desktop computers, tablets, and mobile devices. The interface incorporates role-based views ensuring users see only relevant information and functions.

### 1.6.2 Application Layer
A RESTful API server developed using Node.js with Express framework, implementing business logic, workflow rules, and data validation. The API supports authentication via JSON Web Tokens (JWT), role-based access control, and comprehensive error handling.

### 1.6.3 Data Layer
A robust database system (MongoDB or PostgreSQL) storing all procurement data with proper indexing for performance, backup mechanisms for disaster recovery, and encryption for sensitive information.

### 1.6.4 Integration Layer
APIs and connectors to integrate with existing hospital systems including:
- Financial Management Information System (FMIS) for budget data
- Human Resource Management System (HRMS) for user authentication and organizational structure
- Inventory Management System for stock levels and reorder triggers

### 1.6.5 Security Considerations
The system implements multiple layers of security:
- HTTPS encryption for all data transmission
- Multi-factor authentication for sensitive operations
- Role-based access control with principle of least privilege
- Regular security updates and vulnerability scanning
- Data backup and disaster recovery protocols

## 1.7 Implementation Strategy

### 1.7.1 Phased Rollout Approach

**Phase 1: Foundation (Months 1-2)**
- Requirements gathering and system customization
- Infrastructure setup and testing environment preparation
- User role definition and access control configuration
- Initial data migration of active suppliers and templates

**Phase 2: Pilot Program (Months 3-4)**
- Launch with selected pilot departments (2-3 departments)
- Focus on high-volume, low-complexity procurements
- Daily monitoring and rapid issue resolution
- Gather user feedback and refine workflows

**Phase 3: Expanded Rollout (Months 5-6)**
- Onboard additional departments in stages
- Introduce more complex procurement types
- Integration with financial systems
- Expand reporting and analytics capabilities

**Phase 4: Full Deployment (Months 7-8)**
- Hospital-wide implementation
- Transition of historical data for trending analysis
- Advanced features activation (analytics, forecasting)
- Legacy system retirement

### 1.7.2 Change Management

**Training Program**
- Role-specific training sessions for end-users
- Administrator training for system configuration and maintenance
- Video tutorials and user manuals
- Establishment of super-users in each department for peer support

**Communication Strategy**
- Regular updates via email and internal notice boards
- Town hall meetings to address concerns
- Feedback channels for continuous improvement
- Success stories highlighting benefits realized

**Support Structure**
- Dedicated helpdesk during transition period
- On-site support team for the first month
- Online ticketing system for issue tracking
- Escalation procedures for critical problems

## 1.8 Expected Benefits and Impact

### 1.8.1 Efficiency Gains
The automated system is expected to reduce procurement processing time by 60-70%, enabling faster fulfillment of departmental needs. Automated routing and notifications eliminate waiting time for physical document movement and signature collection.

### 1.8.2 Cost Savings
Enhanced visibility into spending patterns enables better negotiation with suppliers, bulk purchasing opportunities, and elimination of emergency procurements at premium prices. Reduced paperwork translates to lower administrative costs.

### 1.8.3 Transparency and Accountability
Every action within the system is logged with user attribution and timestamps, creating an unalterable audit trail. This transparency deters fraudulent activities and simplifies compliance reporting. Stakeholders can track their requests in real-time, reducing uncertainty and follow-up queries.

### 1.8.4 Data-Driven Decision Making
The system generates comprehensive analytics on procurement patterns, supplier performance, budget utilization, and process bottlenecks. Management can use these insights for strategic planning, resource allocation, and continuous process improvement.

### 1.8.5 Improved Supplier Relations
Suppliers benefit from a clear, consistent procurement process with electronic communication and payment tracking. This professionalism enhances the hospital's reputation and may attract higher-quality suppliers.

### 1.8.6 Compliance and Risk Mitigation
Automated compliance checks ensure adherence to procurement regulations and hospital policies. The system can flag unusual patterns, potential conflicts of interest, or deviations from standard procedures for investigation.

### 1.8.7 Staff Productivity
By eliminating repetitive manual tasks, procurement staff can focus on strategic activities such as supplier relationship management, market analysis, and process optimization. Requesting departments spend less time following up on requests and more time on their core responsibilities.

## Conclusion

The field trip to Korle-Bu Teaching Hospital provided valuable insights into the complexities and challenges of procurement management in a large healthcare institution. The current manual processes, while functional, introduce inefficiencies, delays, and missed opportunities for optimization.

The proposed automated procurement system addresses the identified challenges through workflow automation, real-time visibility, integrated budget control, and comprehensive audit trails. By leveraging modern technology, the hospital can transform its procurement operations from a paper-intensive, reactive function to a strategic, data-driven capability.

Successful implementation will require careful planning, stakeholder engagement, phased rollout, and ongoing support. However, the expected benefits in terms of efficiency, cost savings, transparency, and staff productivity make a compelling case for this digital transformation initiative.

This field trip experience has reinforced the importance of understanding user needs, process flows, and organizational constraints when designing technology solutions. The insights gained will inform future system development efforts aimed at solving real-world business challenges in healthcare and other sectors.

## References

1. Public Procurement Authority of Ghana. (2016). *Public Procurement (Amendment) Act, 2016 (Act 914)*. Accra: Government of Ghana.

2. Korle-Bu Teaching Hospital. (2024). *Annual Report 2023*. Accra: KBTH Publications.

3. Ministry of Health, Ghana. (2020). *Standard Treatment Guidelines for Health Facilities in Ghana*. Accra: Ministry of Health.

4. World Health Organization. (2022). *Managing Procurement in Health Facilities: A Practical Guide*. Geneva: WHO Press.

5. Chartered Institute of Procurement and Supply. (2023). *Global Standard for Procurement and Supply*. CIPS Publications.

6. Lysons, K., & Farrington, B. (2020). *Procurement and Supply Chain Management* (10th ed.). Pearson Education Limited.

7. Ghana Health Service. (2021). *Health Sector Supply Chain Strategic Plan 2021-2025*. Accra: GHS.

8. African Development Bank. (2019). *Strengthening Public Procurement Systems in Africa*. AfDB Publications.

9. Appiah, K. O., & Bonsu, R. (2021). "Challenges of Public Procurement in Ghana's Health Sector." *African Journal of Public Administration and Management*, 12(3), 45-62.

10. International Federation of Accountants. (2018). *Public Sector Financial Management Transparency and Accountability*. IFAC Publications.
