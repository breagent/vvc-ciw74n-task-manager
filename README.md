# Task Manager

A modern, responsive task management application with deadlines and priorities. Built with React and Vite.

## Features

- Create, edit, and delete tasks
- Set deadlines with date and time
- Assign priorities (High, Medium, Low)
- Filter tasks by status (All, Active, Completed)
- Sort tasks by deadline, priority, or creation date
- Visual indicators for overdue and due-soon tasks
- Persistent storage using localStorage
- Responsive design for mobile and desktop
- Dark mode support

## Tech Stack

- React 18
- Vite
- CSS Custom Properties
- localStorage for data persistence

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
task-manager/
├── design/               # Design documentation
├── src/
│   ├── components/      # React components
│   │   ├── Header.jsx
│   │   ├── FilterBar.jsx
│   │   ├── TaskList.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskModal.jsx
│   │   ├── PriorityBadge.jsx
│   │   ├── DeadlineDisplay.jsx
│   │   └── EmptyState.jsx
│   ├── context/         # React Context for state management
│   │   └── TaskContext.jsx
│   ├── hooks/           # Custom React hooks
│   │   └── useLocalStorage.js
│   ├── utils/           # Utility functions
│   │   ├── storage.js
│   │   ├── dateUtils.js
│   │   └── taskUtils.js
│   ├── styles/          # CSS files
│   │   ├── tokens.css
│   │   └── globals.css
│   ├── types/           # Type definitions
│   │   └── task.js
│   ├── App.jsx          # Main App component
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── package.json
└── vite.config.js
```

## Usage

### Creating a Task

1. Click the "New Task" button in the header
2. Fill in the task details:
   - Title (required)
   - Description (optional)
   - Deadline date and time (optional)
   - Priority level (High, Medium, or Low)
3. Click "Create Task" to save

### Editing a Task

1. Click the menu button (⋮) on any task card
2. Select "Edit"
3. Update the task details
4. Click "Save Changes"

### Completing a Task

Click the checkbox on any task card to mark it as complete or incomplete.

### Deleting a Task

1. Click the menu button (⋮) on any task card
2. Select "Delete"
3. Confirm the deletion

### Filtering and Sorting

- Use the filter buttons to show All, Active, or Completed tasks
- Use the sort dropdown to sort by Deadline, Priority, or Created Date

## Design System

The app uses a comprehensive design system with CSS Custom Properties. See the design documentation in the `design/` folder for detailed specifications:

- `design/UI_UX_DESIGN.md` - Complete design specification
- `design/COMPONENT_SPECS.md` - Component specifications
- `design/IMPLEMENTATION_GUIDE.md` - Implementation guide
- `design/design-mockup.html` - Interactive mockup

## Data Storage

Tasks are stored in the browser's localStorage. Data persists across sessions but is local to the device and browser.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This is a personal project, but suggestions and feedback are welcome.

## License

MIT

## Acknowledgments

Built with React, Vite, and modern web technologies.
