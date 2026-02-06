import { TaskProvider, useTasks } from './context/TaskContext.jsx';
import Header from './components/Header.jsx';
import FilterBar from './components/FilterBar.jsx';
import TaskList from './components/TaskList.jsx';
import TaskModal from './components/TaskModal.jsx';
import './styles/globals.css';

function AppContent() {
  const {
    filteredTasks,
    filters,
    modalOpen,
    editingTask,
    taskStats,
    toggleComplete,
    deleteTask,
    handleTaskSubmit,
    openNewTaskModal,
    openEditTaskModal,
    closeModal,
    setFilters
  } = useTasks();

  return (
    <div className="app">
      <Header
        onNewTask={openNewTaskModal}
        taskStats={taskStats}
      />

      <main className="main-content">
        <div className="container">
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
          />

          <TaskList
            tasks={filteredTasks}
            onToggle={toggleComplete}
            onEdit={openEditTaskModal}
            onDelete={deleteTask}
            filterType={filters.active}
          />
        </div>
      </main>

      <TaskModal
        isOpen={modalOpen}
        task={editingTask}
        onClose={closeModal}
        onSubmit={handleTaskSubmit}
      />
    </div>
  );
}

function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

export default App;
