import { useState } from 'react'
import { FiStar } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'

export default function StarRating({ value = 0, onChange, size = 20, readonly = false }) {
  const [hovered, setHovered] = useState(0)
  const display = readonly ? value : (hovered || value)

  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`transition-transform ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
        >
          {star <= display
            ? <FaStar  size={size} className="text-amber-400" />
            : <FiStar  size={size} className="text-gray-300" />
          }
        </button>
      ))}
    </div>
  )
}
