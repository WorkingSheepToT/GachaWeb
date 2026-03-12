import { useState, useEffect } from 'react'
import './FilterModal.css'

export default function FilterModal({ open, onClose, filterTagCategories = [], selectedTags = [], onApply }) {
  const [pending, setPending] = useState(new Set(selectedTags))

  useEffect(() => {
    if (open) setPending(new Set(selectedTags))
  }, [open, selectedTags])

  const toggle = (tag) => {
    setPending((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  const handleReset = () => setPending(new Set())

  const handleApply = () => {
    onApply(Array.from(pending))
    onClose()
  }

  if (!open) return null

  return (
    <div className="filter-modal-backdrop" onClick={onClose} role="presentation">
      <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
        <div className="filter-modal-header">
          <h2 className="filter-modal-title">篩選</h2>
          <button type="button" className="filter-modal-close" onClick={onClose} aria-label="關閉">
            ✕
          </button>
        </div>
        <div className="filter-modal-body">
          {filterTagCategories.map((cat) => (
            <section key={cat.id} className="filter-category">
              <h3 className="filter-category-label">{cat.label}</h3>
              <div className="filter-tags">
                {cat.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`filter-tag ${pending.has(tag) ? 'filter-tag--active' : ''}`}
                    onClick={() => toggle(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="filter-modal-footer">
          <button type="button" className="filter-btn filter-btn-reset" onClick={handleReset}>
            重設
          </button>
          <button type="button" className="filter-btn filter-btn-apply" onClick={handleApply}>
            套用篩選
          </button>
        </div>
      </div>
    </div>
  )
}
