import { useState, useRef, useEffect } from 'react';

// Tag Dropdown Filter Component: Multi-tag selection aur search support karta hai
export default function TagDropdown({ tags = [], selectedTags = [], onApplyTags }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState(selectedTags);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  // URL query ya props change hone par local tempSelected state ko sync karta hai
  useEffect(() => {
    setTempSelected(selectedTags);
  }, [selectedTags]);

  // Dropdown ke bahar click karne par dropdown close karta hai aur unapplied selection discard karta hai
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setTempSelected(selectedTags);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedTags]);

  // Dropdown search box ke basis par tags list filter karna
  const filteredTags = tags.filter((t) => {
    const name = typeof t === 'string' ? t : t.name || t.slug || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  // Checkbox toggle handler: Sirf local state update karta hai (har tick par route push nahi hota)
  const handleToggle = (slug) => {
    const lowerSlug = slug.toLowerCase();
    setTempSelected((prev) =>
      prev.includes(lowerSlug) ? prev.filter((t) => t !== lowerSlug) : [...prev, lowerSlug]
    );
  };

  // 'Done' button click handler: Sabhi selected tags ek single batch me apply karta hai
  const handleApply = () => {
    onApplyTags(tempSelected);
    setIsOpen(false);
  };

  // 'Clear All' button handler: Sabhi tags deselect karke filter reset karta hai
  const handleClear = () => {
    setTempSelected([]);
    onApplyTags([]);
    setIsOpen(false);
  };

  const buttonLabel =
    selectedTags.length === 0
      ? 'Filter by tag ▾'
      : selectedTags.length === 1
      ? `tag: #${selectedTags[0].toLowerCase()} ▾`
      : `tags (${selectedTags.length} selected) ▾`;

  return (
    <div className="tag-dropdown-wrapper" ref={dropdownRef}>
      {/* Dropdown Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`dropdown-trigger-btn ${selectedTags.length > 0 ? 'has-active-tags' : ''}`}
        aria-expanded={isOpen}
      >
        <span className="btn-text">{buttonLabel}</span>
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <div className="dropdown-panel">
          <div className="panel-header">
            <span className="panel-title">Filter by tag</span>
            {tempSelected.length > 0 && (
              <span className="selected-count-badge">{tempSelected.length} selected</span>
            )}
          </div>

          <div className="panel-search">
            <input
              type="text"
              placeholder="search tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="panel-search-input"
            />
          </div>

          <div className="panel-tags-list">
            {filteredTags.length === 0 ? (
              <div className="no-tags-found">No matching tags</div>
            ) : (
              filteredTags.map((t) => {
                const slug = (typeof t === 'string' ? t : t.slug || t.name).toLowerCase();
                const name = typeof t === 'string' ? t : t.name || t.slug;
                const isChecked = tempSelected.includes(slug);

                return (
                  <div
                    key={slug}
                    className={`tag-option-item ${isChecked ? 'selected' : ''}`}
                    onClick={() => handleToggle(slug)}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="tag-checkbox"
                    />
                    <span className="tag-name">#{String(name).toLowerCase()}</span>
                  </div>
                );
              })
            )}
          </div>

          <div className="panel-footer">
            <button type="button" onClick={handleClear} className="clear-btn">
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

