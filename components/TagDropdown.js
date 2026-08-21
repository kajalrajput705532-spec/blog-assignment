import { useState, useRef, useEffect } from 'react';

// Tag dropdown component for single/multi tags selection
export default function TagDropdown({ tags = [], selectedTags = [], onApplyTags }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState(selectedTags);
  const [filterSearch, setFilterSearch] = useState('');
  const dropdownRef = useRef(null);

  // Sync tempSelected jab prop update ho
  useEffect(() => {
    setTempSelected(selectedTags);
  }, [selectedTags]);

  // Outside click handle karne ke liye dropdown close logic
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dropdown ke andhar tag search filter
  const filteredTagsList = tags.filter((t) => {
    const tagName = typeof t === 'string' ? t : t.name || t.slug;
    return tagName.toLowerCase().includes(filterSearch.toLowerCase());
  });

  // Checkbox toggle handler (click karte hi filter apply ho rha h)
  const handleCheckboxToggle = (tagSlug) => {
    const slug = tagSlug.toLowerCase();
    let updatedTags;
    if (tempSelected.includes(slug)) {
      updatedTags = tempSelected.filter((t) => t !== slug);
    } else {
      updatedTags = [...tempSelected, slug];
    }
    setTempSelected(updatedTags);
    onApplyTags(updatedTags);
  };

  // Apply button handler
  const handleApply = () => {
    onApplyTags(tempSelected);
    setIsOpen(false);
  };

  // Clear all tags filter
  const handleClearAll = () => {
    setTempSelected([]);
    onApplyTags([]);
    setIsOpen(false);
  };

  // Button title dynamic label
  const getButtonLabel = () => {
    if (selectedTags.length === 0) return 'Filter by Tags ▾';
    if (selectedTags.length === 1) return `Tag: #${selectedTags[0]} ▾`;
    return `Tags (${selectedTags.length} selected) ▾`;
  };

  return (
    <div className="tag-dropdown-wrapper" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`dropdown-trigger-btn ${selectedTags.length > 0 ? 'has-active-tags' : ''}`}
        aria-expanded={isOpen}
      >
        <span className="btn-text">{getButtonLabel()}</span>
      </button>

      {/* Dropdown Popover Panel */}
      {isOpen && (
        <div className="dropdown-panel">
          {/* Header */}
          <div className="panel-header">
            <span className="panel-title">Filter by Tags</span>
            {tempSelected.length > 0 && (
              <span className="selected-count-badge">
                {tempSelected.length} selected
              </span>
            )}
          </div>

          {/* Search Box Inside Dropdown */}
          <div className="panel-search">
            <input
              type="text"
              placeholder="Search tags..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="panel-search-input"
            />
          </div>

          {/* Tags List with Checkboxes */}
          <div className="panel-tags-list">
            {filteredTagsList.length === 0 ? (
              <div className="no-tags-found">No matching tags</div>
            ) : (
              filteredTagsList.map((t) => {
                const slug = (typeof t === 'string' ? t : t.slug || t.name).toLowerCase();
                const name = typeof t === 'string' ? t : t.name || t.slug;
                const isChecked = tempSelected.includes(slug);

                return (
                  <div
                    key={slug}
                    className={`tag-option-item ${isChecked ? 'selected' : ''}`}
                    onClick={() => handleCheckboxToggle(slug)}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="tag-checkbox"
                    />
                    <span className="tag-name">#{name}</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          <div className="panel-footer">
            <button type="button" onClick={handleClearAll} className="clear-btn">
              Clear All
            </button>
            <button type="button" onClick={handleApply} className="apply-btn">
              Done {tempSelected.length > 0 ? `(${tempSelected.length})` : ''}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
