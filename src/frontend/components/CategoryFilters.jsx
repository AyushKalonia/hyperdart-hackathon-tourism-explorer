import React from 'react';
import {
  Globe,
  Camera,
  Landmark,
  Building2,
  Sparkles,
  Shield,
  Trees,
  History,
  Eye
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Attractions', icon: Globe },
  { id: 'sights', label: 'Sights', icon: Camera },
  { id: 'landmarks', label: 'Landmarks', icon: Landmark },
  { id: 'museums', label: 'Museums', icon: Building2 },
  { id: 'temples', label: 'Temples', icon: Sparkles },
  { id: 'monuments', label: 'Monuments', icon: History },
  { id: 'forts', label: 'Forts', icon: Shield },
  { id: 'parks', label: 'Parks & Nature', icon: Trees },
  { id: 'historic', label: 'Historic Sites', icon: History },
  { id: 'viewpoints', label: 'Viewpoints', icon: Eye }
];

export default function CategoryFilters({
  activeCategory = 'all',
  onSelectCategory,
  categoryCounts = {}
}) {
  return (
    <div
      className="custom-scroll"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '16px'
      }}
    >
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.id;
        const count = categoryCounts[cat.id];

        return (
          <button
            key={cat.id}
            type="button"
            className={`category-chip ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <Icon size={14} />
            <span>{cat.label}</span>
            {count !== undefined && count > 0 && (
              <span className="chip-count">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
