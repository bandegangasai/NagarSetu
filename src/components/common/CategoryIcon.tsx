import React from 'react';
import {
  Trash2,
  Activity,
  Lightbulb,
  Waves,
  AlertTriangle,
  Droplets,
  Building,
  ShieldAlert,
  Wind,
  Trees,
  Footprints,
  Ban,
  AlertCircle,
  LucideProps
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Trash2':
      return <Trash2 {...props} />;
    case 'Activity':
      return <Activity {...props} />;
    case 'Lightbulb':
      return <Lightbulb {...props} />;
    case 'Waves':
      return <Waves {...props} />;
    case 'AlertTriangle':
      return <AlertTriangle {...props} />;
    case 'Droplets':
      return <Droplets {...props} />;
    case 'Building':
      return <Building {...props} />;
    case 'ShieldAlert':
      return <ShieldAlert {...props} />;
    case 'Wind':
      return <Wind {...props} />;
    case 'Trees':
      return <Trees {...props} />;
    case 'Footprints':
      return <Footprints {...props} />;
    case 'Ban':
      return <Ban {...props} />;
    default:
      return <AlertCircle {...props} />;
  }
};
