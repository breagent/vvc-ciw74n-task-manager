import { useState, useEffect } from 'react';
import { PRIORITY_LEVELS } from '../types/task.js';
import { formatDateForInput, formatTimeForInput, parseDateTimeInput } from '../utils/dateUtils.js';

export default function TaskModal({ isOpen, task, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    deadlineTime: '',
    priority: PRIORITY_LEVELS.MEDIUM
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        deadline: task.deadline ? formatDateForInput(task.deadline) : '',
        deadlineTime: task.deadline ? formatTimeForInput(task.deadline) : '',
        priority: task.priority
      });
    } else {
      setFormData({
        title: '',
        description: '',
        deadline: '',
        deadlineTime: '',
        priority: PRIORITY_LEVELS.MEDIUM
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.deadline) {
      const deadlineDate = parseDateTimeInput(formData.deadline, formData.deadlineTime);
      if (deadlineDate < new Date() && !task?.completed) {
        newErrors.deadline = 'Deadline cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const deadline = formData.deadline
      ? parseDateTimeInput(formData.deadline, formData.deadlineTime)
      : null;

    onSubmit({
      ...task,
      title: formData.title.trim(),
      description: formData.description.trim(),
      deadline,
      priority: formData.priority
    });

    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              className={`form-input ${errors.title ? 'form-input-error' : ''}`}
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              autoFocus
            />
            {errors.title && (
              <span className="form-error">{errors.title}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="task-description" className="form-label">
              Description
            </label>
            <textarea
              id="task-description"
              className="form-textarea"
              placeholder="Add details about this task..."
              rows="3"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-deadline" className="form-label">
                Deadline Date
              </label>
              <input
                id="task-deadline"
                type="date"
                className={`form-input ${errors.deadline ? 'form-input-error' : ''}`}
                value={formData.deadline}
                onChange={(e) => handleChange('deadline', e.target.value)}
              />
              {errors.deadline && (
                <span className="form-error">{errors.deadline}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="task-deadline-time" className="form-label">
                Time
              </label>
              <input
                id="task-deadline-time"
                type="time"
                className="form-input"
                value={formData.deadlineTime}
                onChange={(e) => handleChange('deadlineTime', e.target.value)}
                disabled={!formData.deadline}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <div className="priority-selector">
              {Object.values(PRIORITY_LEVELS).map(level => (
                <button
                  key={level}
                  type="button"
                  className={`priority-option priority-option-${level} ${
                    formData.priority === level ? 'priority-option-active' : ''
                  }`}
                  onClick={() => handleChange('priority', level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
