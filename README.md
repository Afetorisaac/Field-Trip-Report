# Field Trip Report: Korle-Bu Teaching Hospital Procurement System

**Student:** Emmanuella Nana Ama Weir  
**Index Number:** 1704895585  
**Lecturer:** DR. MARTIN MABEIFAM UJAKPA  
**Date:** NOVEMBER 2025

## 📋 Repository Overview

This repository contains a comprehensive field trip report documenting the analysis of the procurement system at Korle-Bu Teaching Hospital (KBTH), Ghana's premier tertiary healthcare institution. The report examines current procurement workflows, identifies challenges, and proposes a technology-driven automated procurement solution.

## 📁 Repository Structure

```
.
├── reports/
│   └── Report1_Ella.md          # Full field trip report (Markdown)
├── diagrams/
│   ├── report1_ella_system_architecture.mmd    # System architecture (Mermaid)
│   ├── report1_ella_use_case.mmd               # Use case diagram (Mermaid)
│   └── report1_ella_sequence.mmd               # Sequence diagram (Mermaid)
├── docs/                        # GitHub Pages static site
│   ├── index.html              # Professional report presentation
│   └── prototype/              # Interactive procurement system demo
│       ├── index.html          # Prototype UI
│       ├── styles.css          # Prototype styles
│       └── app.js              # Prototype application logic
└── README.md                   # This file
```

## 🌐 View the Report Online

The report is available as a professional, interactive web page via GitHub Pages:

### Option 1: View on GitHub Pages (Recommended)

**To enable GitHub Pages for this repository:**

1. Go to the repository **Settings** tab
2. Navigate to **Pages** in the left sidebar
3. Under **Source**, select:
   - **Branch:** `main` (or `report1/ella/gh-pages`)
   - **Folder:** `/docs`
4. Click **Save**
5. Wait a few minutes for deployment
6. Access the site at: `https://afetorisaac.github.io/Field-Trip-Report/`

### Option 2: View Locally

Open the HTML file directly in your browser:

```bash
# Clone the repository
git clone https://github.com/Afetorisaac/Field-Trip-Report.git
cd Field-Trip-Report

# Open the main report page
open docs/index.html
# or on Linux:
xdg-open docs/index.html
# or on Windows:
start docs/index.html
```

## 🎯 Report Contents

The field trip report includes the following sections:

### Core Report Sections
- **1.1 Introduction** - Overview of the field trip objectives and context
- **1.2 Background and Context** - Information about Korle-Bu Teaching Hospital
- **1.3 Observed Procurement Workflow** - Current manual procurement processes
- **1.4 Identified Challenges** - Pain points and inefficiencies
- **1.5 Proposed Solution** - Automated procurement management system
- **1.6 System Architecture** - Technical design and technology stack
- **1.7 Implementation Strategy** - Phased rollout and change management
- **1.8 Expected Benefits** - Efficiency gains, cost savings, and improvements
- **Conclusion** - Summary and key takeaways
- **References** - Academic and professional sources

### Visual Diagrams
- **System Architecture Diagram** - Three-tier architecture with integration layers
- **Use Case Diagram** - Actor roles and system interactions
- **Sequence Diagram** - Complete procurement workflow from request to delivery

## 🚀 Interactive Prototype

Experience the proposed procurement system through a fully interactive prototype:

**Access:** `docs/prototype/index.html`

### Prototype Features
- ✅ Role-based authentication (Requester, Department Head, Procurement Officer, Finance)
- ✅ Request creation and submission
- ✅ Approval/rejection workflow
- ✅ Purchase order generation
- ✅ Status tracking and notifications
- ✅ Client-side data persistence (localStorage)
- ✅ Responsive design (mobile and desktop)

### How to Use the Prototype
1. Open `docs/prototype/index.html` in a web browser
2. Select a role (e.g., Requester, Department Head, Procurement Officer)
3. Explore the role-specific dashboard and features
4. Create requests, approve/reject, generate purchase orders
5. Switch roles to experience the complete workflow

**Technology Stack:**
- HTML5, CSS3, JavaScript (Vanilla JS)
- Bootstrap 5 for UI components
- LocalStorage API for data persistence
- Fully client-side (no server required)

## 📄 Report Formats

The report is available in multiple formats:

1. **Markdown** (`reports/Report1_Ella.md`) - Raw text format for version control
2. **HTML** (`docs/index.html`) - Professional web presentation with Bootstrap 5
3. **Diagrams** (`diagrams/*.mmd`) - Mermaid diagram source files

## 🔧 Updating the Report

To update the report content:

1. **Edit the Markdown file:**
   ```bash
   # Edit the source report
   nano reports/Report1_Ella.md
   ```

2. **Update the HTML version:**
   - Edit `docs/index.html` to reflect changes
   - Maintain consistency between Markdown and HTML versions

3. **Modify diagrams:**
   - Edit `.mmd` files in the `diagrams/` folder
   - Use [Mermaid Live Editor](https://mermaid.live) for preview and testing
   - Update the diagram code in `docs/index.html` if embedded

4. **Update the prototype:**
   - Edit `docs/prototype/app.js` for functionality changes
   - Modify `docs/prototype/styles.css` for styling updates
   - Update `docs/prototype/index.html` for UI changes

## 📊 Viewing Mermaid Diagrams

Mermaid diagrams can be viewed in several ways:

### Option 1: GitHub (Automatic Rendering)
GitHub automatically renders `.mmd` files with Mermaid syntax. Simply click on any diagram file in the `diagrams/` folder.

### Option 2: Mermaid Live Editor
1. Go to [https://mermaid.live](https://mermaid.live)
2. Copy the contents of any `.mmd` file
3. Paste into the editor to view and export

### Option 3: VS Code Extension
Install the "Markdown Preview Mermaid Support" extension in VS Code to preview diagrams while editing.

### Option 4: HTML Page
The diagrams are embedded in `docs/index.html` and rendered when the page is opened in a browser.

## 🎓 Academic Context

This report was prepared as part of a field trip assignment to analyze real-world information systems and propose technology-driven improvements. The focus was on:

- Understanding existing business processes
- Identifying inefficiencies and bottlenecks
- Proposing practical technology solutions
- Designing system architecture
- Creating interactive prototypes

## 📞 Contact

**Student:** Emmanuella Nana Ama Weir  
**Index Number:** 1704895585  
**Institution:** [Your University Name]  
**Course:** Information Systems / Software Engineering  
**Lecturer:** DR. MARTIN MABEIFAM UJAKPA

## 📜 License

This academic project is for educational purposes. All content is original work by Emmanuella Nana Ama Weir.

## 🙏 Acknowledgments

- Korle-Bu Teaching Hospital Procurement Department for granting access and sharing insights
- DR. MARTIN MABEIFAM UJAKPA for guidance and supervision
- Field trip coordinators and hospital staff who facilitated the visit

---

**Note:** This repository demonstrates the application of information systems analysis and design principles to solve real-world healthcare procurement challenges. The prototype is a demonstration of the proposed solution and is not intended for production use without proper security, authentication, and backend implementation.

## 🚀 Quick Start Guide for Lecturers/Reviewers

1. **View the full report:** Open `docs/index.html` in any modern web browser
2. **Try the prototype:** Click "Launch Prototype Demo" button or open `docs/prototype/index.html`
3. **Review the source:** Read `reports/Report1_Ella.md` for the complete text
4. **Examine diagrams:** Check `diagrams/` folder for Mermaid diagram sources

**Recommended workflow:**
1. Start with `docs/index.html` to get an overview
2. Interact with the prototype to understand the proposed solution
3. Review the technical diagrams for system architecture details
4. Read the full Markdown report for comprehensive academic content
