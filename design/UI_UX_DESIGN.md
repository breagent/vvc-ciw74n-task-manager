# Task Manager - UI/UX Design Specification

## Project Overview
A simple, intuitive task management application with deadlines and priority levels. This design focuses on clarity, ease of use, and effective visual communication of task urgency and importance.

---

## Design Philosophy

### Core Principles
1. **Simplicity First**: Clean, uncluttered interface with minimal cognitive load
2. **Information Hierarchy**: Priority and deadline information prominently displayed
3. **Visual Feedback**: Clear indicators for task status, urgency, and priority
4. **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
5. **Responsive**: Mobile-first design that scales to desktop

---

## Color Palette

### Primary Colors
- **Primary Blue**: `#2563eb` - Main actions, links
- **Primary Blue Hover**: `#1d4ed8`
- **Background**: `#f9fafb` - Main background
- **Surface**: `#ffffff` - Cards, modals

### Priority Colors
- **High Priority**: `#dc2626` (Red)
- **Medium Priority**: `#f59e0b` (Amber)
- **Low Priority**: `#10b981` (Green)

### Status Colors
- **Overdue**: `#991b1b` (Dark Red)
- **Due Soon**: `#f97316` (Orange) - Within 24 hours
- **Upcoming**: `#6b7280` (Gray)
- **Completed**: `#9ca3af` (Light Gray)

### Text Colors
- **Primary Text**: `#111827`
- **Secondary Text**: `#6b7280`
- **Muted Text**: `#9ca3af`

---

## Typography

### Font Family
- **Primary**: Inter, system-ui, -apple-system, sans-serif
- **Monospace**: 'SF Mono', Monaco, monospace (for dates/times)

### Font Sizes
- **Title**: 24px / 1.5rem (semi-bold)
- **Heading**: 18px / 1.125rem (semi-bold)
- **Body**: 16px / 1rem (regular)
- **Small**: 14px / 0.875rem (regular)
- **Tiny**: 12px / 0.75rem (medium)

---

## Layout Structure

### Main Layout
```
┌─────────────────────────────────────────────────┐
│  HEADER                                         │
│  ┌────────────────────────────────────────┐   │
│  │  Task Manager                   [+New] │   │
│  └────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│  FILTERS & CONTROLS                             │
│  ┌────────────────────────────────────────┐   │
│  │  [All] [Active] [Completed]            │   │
│  │  Sort by: [Deadline ▼]                 │   │
│  └────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│  TASK LIST                                      │
│  ┌────────────────────────────────────────┐   │
│  │  ☐ [!] Finish project report           │   │
│  │      📅 Today, 5:00 PM  •  High        │   │
│  ├────────────────────────────────────────┤   │
│  │  ☐ [!!] Submit tax documents (OVERDUE) │   │
│  │      📅 Yesterday  •  High              │   │
│  ├────────────────────────────────────────┤   │
│  │  ☑ Review weekly goals                 │   │
│  │      📅 Jan 20  •  Medium              │   │
│  └────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## Component Design

### 1. Task Card

#### Default State
```
┌─────────────────────────────────────────────────┐
│ ☐  [Priority Badge] Task Title            ⋮    │
│    📅 Due: Feb 6, 2:00 PM  •  Priority Label   │
│    Task description or notes (optional)        │
└─────────────────────────────────────────────────┘
```

#### Visual Specifications
- **Dimensions**: Full width, 80-120px height (auto-expand with content)
- **Padding**: 16px all sides
- **Border**: 1px solid `#e5e7eb`
- **Border Radius**: 8px
- **Box Shadow**: `0 1px 3px rgba(0,0,0,0.1)` on hover
- **Background**: White, with left border accent (4px) matching priority color

#### Interactive States
- **Hover**: Subtle shadow, slightly lifted appearance
- **Completed**: Grayed out text, strikethrough on title
- **Overdue**: Red left border, pink background tint `#fef2f2`
- **Due Soon**: Orange left border, amber background tint `#fffbeb`

### 2. Priority Badge

Visual indicators at the start of each task:

- **High Priority**: 🔴 Red circle with "!" icon
- **Medium Priority**: 🟡 Amber circle with "-" icon
- **Low Priority**: 🟢 Green circle with "·" icon

Alternative text-based badges:
- High: `[HIGH]` in red with red border
- Medium: `[MED]` in amber with amber border
- Low: `[LOW]` in green with green border

### 3. Deadline Display

Format: `📅 Due: [Date], [Time]`

Examples:
- Overdue: `📅 Due: Yesterday` (in red)
- Today: `📅 Due: Today, 3:00 PM` (in orange)
- Tomorrow: `📅 Due: Tomorrow, 10:00 AM` (in normal)
- Future: `📅 Due: Feb 10, 2:00 PM` (in gray)
- No deadline: `📅 No deadline` (in light gray)

### 4. Add/Edit Task Form

#### Modal Design
```
┌─────────────────────────────────────────────────┐
│  Add New Task                            ✕      │
├─────────────────────────────────────────────────┤
│                                                  │
│  Task Title *                                   │
│  ┌──────────────────────────────────────────┐  │
│  │  Enter task name...                      │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  Description (optional)                         │
│  ┌──────────────────────────────────────────┐  │
│  │  Add details...                          │  │
│  │                                          │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  Deadline                                       │
│  ┌────────────────────┐  ┌──────────────────┐  │
│  │  Feb 6, 2026  📅   │  │  2:00 PM  🕐    │  │
│  └────────────────────┘  └──────────────────┘  │
│                                                  │
│  Priority                                       │
│  ○ High    ○ Medium    ⦿ Low                   │
│                                                  │
│              [Cancel]  [Add Task]               │
│                                                  │
└─────────────────────────────────────────────────┘
```

#### Form Elements
- **Text Input**: 48px height, 12px padding, rounded corners
- **Date Picker**: Native date input with calendar icon
- **Time Picker**: Native time input with clock icon
- **Radio Buttons**: Large click targets (40px), color-coded
- **Buttons**: Primary action (blue), secondary action (gray)

### 5. Action Buttons

#### Primary Button (Add Task)
- **Background**: `#2563eb`
- **Text**: White, 14px, semi-bold
- **Padding**: 10px 20px
- **Border Radius**: 6px
- **Hover**: Darker blue `#1d4ed8`

#### Secondary Button (Cancel)
- **Background**: Transparent
- **Text**: Gray `#6b7280`
- **Border**: 1px solid `#d1d5db`
- **Hover**: Light gray background `#f3f4f6`

#### Icon Button (Menu)
- **Size**: 32px × 32px
- **Icon**: Three dots (⋮)
- **Hover**: Gray background circle

### 6. Filter & Sort Controls

```
┌─────────────────────────────────────────────────┐
│  [All Tasks] [Active] [Completed]               │
│                                                  │
│  Sort by: [Deadline ▼] [Priority ▼]            │
└─────────────────────────────────────────────────┘
```

#### Tab Buttons
- Active tab: Bold text, blue underline (3px)
- Inactive tab: Gray text, no underline
- Hover: Background tint

#### Dropdown
- Border: 1px solid `#d1d5db`
- Padding: 8px 12px
- Icon: Chevron down
- Options: Slide down with shadow

---

## User Flows

### Flow 1: Creating a New Task

1. User clicks **[+ New]** button in header
2. Modal slides up from bottom (mobile) or fades in center (desktop)
3. User enters task title (required field)
4. User adds description (optional)
5. User selects deadline using date/time pickers
6. User chooses priority level (defaults to Medium)
7. User clicks **Add Task**
8. Modal closes with fade-out animation
9. New task appears at top of list with success feedback (brief highlight)

### Flow 2: Editing an Existing Task

1. User clicks three-dot menu (⋮) on task card
2. Dropdown menu appears: [Edit] [Delete]
3. User clicks **Edit**
4. Same form modal appears, pre-filled with task data
5. User makes changes
6. User clicks **Save Changes**
7. Task updates in list with brief highlight animation

### Flow 3: Completing a Task

1. User clicks checkbox ☐ on task card
2. Checkbox animates to checked ☑
3. Task title gets strikethrough animation
4. Card fades to gray color scheme
5. After 0.5s delay, task moves to "Completed" section (if filtered)

### Flow 4: Filtering and Sorting

1. User clicks filter tab: [All] [Active] [Completed]
2. Task list animates/fades to show filtered results
3. User clicks sort dropdown
4. Options appear: Deadline, Priority, Date Created
5. User selects option
6. List reorders with smooth animation

---

## Responsive Breakpoints

### Mobile (320px - 767px)
- Single column layout
- Full-width task cards
- Bottom sheet modals
- Stacked form fields
- Simplified date/time pickers

### Tablet (768px - 1023px)
- Single column with wider cards
- Centered modal dialogs
- Side-by-side date and time pickers

### Desktop (1024px+)
- Max width: 800px, centered
- Hover states more prominent
- Keyboard shortcuts enabled
- Tooltip hints on hover

---

## Accessibility Features

### Keyboard Navigation
- **Tab**: Navigate between elements
- **Enter/Space**: Activate buttons and checkboxes
- **Escape**: Close modals
- **Arrow Keys**: Navigate within dropdowns
- **Ctrl/Cmd + N**: New task (desktop)

### Screen Reader Support
- ARIA labels on all interactive elements
- ARIA live regions for dynamic updates
- Semantic HTML (button, main, nav, article)
- Focus indicators clearly visible
- Status announcements for task completion

### Visual Accessibility
- Color contrast ratio: 4.5:1 minimum
- No color-only indicators (icons + text)
- Focus rings: 2px solid blue
- Minimum touch targets: 44×44px
- Scalable text (supports zoom to 200%)

---

## Animations & Transitions

### Task Card Animations
- **Add Task**: Slide in from top + fade in (300ms ease-out)
- **Complete Task**: Checkbox fill animation (200ms) → fade gray (300ms)
- **Delete Task**: Slide out left + fade out (250ms)
- **Reorder**: Smooth position transitions (400ms ease-in-out)

### Modal Animations
- **Open**: Backdrop fade in (200ms) + modal scale up (300ms spring)
- **Close**: Modal scale down (200ms) + backdrop fade out (200ms)

### Micro-interactions
- **Button Hover**: Scale 1.02 (100ms)
- **Button Click**: Scale 0.98 (100ms)
- **Checkbox**: Checkmark draw animation (150ms)
- **Badge Pulse**: Overdue tasks pulse subtly (2s infinite)

---

## Empty States

### No Tasks Yet
```
┌─────────────────────────────────────────────────┐
│                                                  │
│               ✓ No tasks yet!                   │
│                                                  │
│        Create your first task to get started    │
│                                                  │
│              [+ Create Task]                     │
│                                                  │
└─────────────────────────────────────────────────┘
```

### No Active Tasks
```
┌─────────────────────────────────────────────────┐
│                                                  │
│              🎉 All done!                       │
│                                                  │
│         You've completed all your tasks         │
│                                                  │
└─────────────────────────────────────────────────┘
```

### No Search Results
```
┌─────────────────────────────────────────────────┐
│                                                  │
│              🔍 No tasks found                  │
│                                                  │
│         Try adjusting your filters              │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## Error States & Validation

### Form Validation
- **Missing Title**: Red border on input + "Title is required" below field
- **Invalid Date**: "Please select a valid date" message
- **Past Date Warning**: "This deadline is in the past. Continue anyway?" confirmation

### Error Messages
```
┌─────────────────────────────────────────────────┐
│  ⚠️  Unable to save task                        │
│  Please check your connection and try again     │
│                                [Retry]           │
└─────────────────────────────────────────────────┘
```

---

## Success Feedback

### Toast Notifications
Appear at top-right for 3 seconds:

- ✓ Task created successfully
- ✓ Task updated
- ✓ Task completed
- ✓ Task deleted

Style: White background, green left border, fade in/out

---

## Dark Mode (Optional Enhancement)

### Color Adjustments
- Background: `#111827`
- Surface: `#1f2937`
- Text: `#f9fafb`
- Borders: `#374151`
- Keep priority colors slightly desaturated

---

## Performance Considerations

### Optimization Strategies
1. **Virtual Scrolling**: For lists over 100 tasks
2. **Lazy Loading**: Load tasks in batches
3. **Debounced Search**: Wait 300ms after typing
4. **Optimistic Updates**: Update UI immediately, sync in background
5. **Local Storage**: Cache tasks for offline access

### Loading States
```
┌─────────────────────────────────────────────────┐
│  ┌───┐  Loading tasks...                       │
│  └───┘  ▓▓▓░░░░░░░ 30%                         │
└─────────────────────────────────────────────────┘
```

Skeleton screens for initial load:
- Gray placeholder boxes where tasks will appear
- Shimmer animation across placeholders

---

## Implementation Notes

### Technology Recommendations
- **Framework**: React or Vue.js for component-based architecture
- **State Management**: Context API or Vuex for task data
- **Date Library**: date-fns or Day.js for date formatting
- **Icons**: Heroicons or Lucide for consistent icon set
- **CSS**: Tailwind CSS for rapid styling with utility classes

### Data Model
```javascript
Task {
  id: string (UUID)
  title: string (required, max 200 chars)
  description: string (optional, max 1000 chars)
  deadline: Date | null
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Local Storage Schema
```javascript
{
  tasks: Task[],
  settings: {
    defaultPriority: 'medium',
    sortBy: 'deadline',
    showCompleted: true
  }
}
```

---

## Future Enhancements (Phase 2)

1. **Categories/Tags**: Group tasks by project or context
2. **Subtasks**: Break down complex tasks
3. **Recurring Tasks**: Daily, weekly, monthly repeats
4. **Notifications**: Browser notifications for due tasks
5. **Search**: Full-text search across titles and descriptions
6. **Export**: Download tasks as CSV or PDF
7. **Collaboration**: Share task lists with others
8. **Calendar View**: Visualize tasks on a calendar
9. **Time Tracking**: Track time spent on tasks
10. **Analytics**: Task completion trends and statistics

---

## Design Files Deliverables

For the development team, provide:
1. **Figma/Sketch File**: Complete mockups with components
2. **Style Guide**: CSS variables and design tokens
3. **Icon Set**: SVG icons for all UI elements
4. **Interactive Prototype**: Clickable flows for key user journeys
5. **Asset Export**: Images, icons at 1x, 2x, 3x resolutions

---

## Usability Testing Checklist

Before launch, test:
- [ ] Can create task in under 30 seconds
- [ ] Deadline selection is intuitive
- [ ] Priority colors are distinguishable
- [ ] Overdue tasks are immediately obvious
- [ ] Completed tasks are easily marked
- [ ] Mobile experience is smooth
- [ ] Keyboard navigation works throughout
- [ ] Screen reader provides context
- [ ] Performance is good with 100+ tasks
- [ ] No data loss on refresh

---

## Design Rationale

### Why This Design Works

1. **Visual Hierarchy**: Priority badges and deadline formatting create clear information hierarchy
2. **Color Psychology**: Red for urgent, amber for caution, green for safe aligns with universal understanding
3. **Progressive Disclosure**: Optional details hidden until needed keeps interface clean
4. **Familiar Patterns**: Checkbox completion, modal forms match user expectations
5. **Immediate Feedback**: Animations and toasts confirm actions without intrusion
6. **Mobile-First**: Touch-friendly targets and gestures prioritized
7. **Accessibility**: Not an afterthought - built into every component
8. **Scalability**: Design system supports future features without redesign

---

## Conclusion

This UI/UX design creates a simple yet powerful task management experience. The focus on deadline visibility, priority clarity, and intuitive interactions ensures users can quickly organize their work without friction. The design is flexible enough to grow with future features while maintaining the core principle of simplicity.
