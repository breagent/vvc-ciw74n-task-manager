import { FILTER_TYPES, SORT_OPTIONS } from '../types/task.js';

export default function FilterBar({ filters, onFilterChange }) {
  const filterButtons = [
    { value: FILTER_TYPES.ALL, label: 'All Tasks' },
    { value: FILTER_TYPES.ACTIVE, label: 'Active' },
    { value: FILTER_TYPES.COMPLETED, label: 'Completed' }
  ];

  const sortOptions = [
    { value: SORT_OPTIONS.DEADLINE, label: 'Deadline' },
    { value: SORT_OPTIONS.PRIORITY, label: 'Priority' },
    { value: SORT_OPTIONS.CREATED, label: 'Created Date' }
  ];

  return (
    <div className="filter-bar">
      <div className="filter-buttons">
        {filterButtons.map(button => (
          <button
            key={button.value}
            className={`filter-btn ${filters.active === button.value ? 'filter-btn-active' : ''}`}
            onClick={() => onFilterChange({ ...filters, active: button.value })}
          >
            {button.label}
          </button>
        ))}
      </div>

      <div className="sort-dropdown">
        <label htmlFor="sort-select" className="sort-label">
          Sort by:
        </label>
        <select
          id="sort-select"
          className="sort-select"
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
