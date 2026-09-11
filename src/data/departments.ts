import { Department } from '../types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'd1000000-0000-0000-0000-000000000001',
    code: 'DEPT-SAN',
    name: 'Sanitation & Solid Waste Management',
    nameTe: 'పారిశుద్ధ్య & ఘన వ్యర్థాల నిర్వహణ',
    nameHi: 'स्वच्छता एवं ठोस अपशिष्ट प्रबंधन',
    description: 'Garbage collection, waste segregation, bins maintenance and road sweeping.',
    email: 'sanitation@municipality.gov.in',
    phone: '040-23301111',
    headOfficerName: 'Shri. S. Narayana (Chief Sanitation Officer)'
  },
  {
    id: 'd1000000-0000-0000-0000-000000000002',
    code: 'DEPT-ENG',
    name: 'Roads & Infrastructure Engineering',
    nameTe: 'రోడ్లు & మౌలిక వసతుల ఇంజనీరింగ్',
    nameHi: 'सड़क एवं बुनियादी ढांचा इंजीनियरिंग',
    description: 'Asphalt paving, pothole repairs, footpaths, bridges, and road markers.',
    email: 'roads@municipality.gov.in',
    phone: '040-23302222',
    headOfficerName: 'Er. M. Venkatesh (Superintending Engineer)'
  },
  {
    id: 'd1000000-0000-0000-0000-000000000003',
    code: 'DEPT-WTR',
    name: 'Water Supply & Underground Drainage',
    nameTe: 'నీటి సరఫరా & భూగర్భ డ్రైనేజీ',
    nameHi: 'जल आपूर्ति एवं भूमिगत जल निकासी',
    description: 'Potable water pipelines, sewage lines, open drains, and storm water maintenance.',
    email: 'water@municipality.gov.in',
    phone: '040-23303333',
    headOfficerName: 'Er. K. Radhika (Chief Water Engineer)'
  },
  {
    id: 'd1000000-0000-0000-0000-000000000004',
    code: 'DEPT-ELE',
    name: 'Electrical & Street Lighting',
    nameTe: 'విద్యుత్ & వీధి దీపాలు',
    nameHi: 'विद्युत एवं स्ट्रीट लाइटिंग',
    description: 'Streetlights, LED fixtures, timer panels, electric poles, and transformers.',
    email: 'electrical@municipality.gov.in',
    phone: '040-23304444',
    headOfficerName: 'Er. R. K. Gupta (Divisional Electrical Engineer)'
  },
  {
    id: 'd1000000-0000-0000-0000-000000000005',
    code: 'DEPT-HLT',
    name: 'Public Health & Vector Control',
    nameTe: 'ప్రజారోగ్యం & కీటక నియంత్రణ',
    nameHi: 'सार्वजनिक स्वास्थ्य एवं कीट नियंत्रण',
    description: 'Mosquito fogging, epidemic prevention, public toilet hygiene, and sanitation audits.',
    email: 'health@municipality.gov.in',
    phone: '040-23305555',
    headOfficerName: 'Dr. B. Prasad (Chief Medical Officer of Health)'
  },
  {
    id: 'd1000000-0000-0000-0000-000000000006',
    code: 'DEPT-HOR',
    name: 'Horticulture & Urban Forestry',
    nameTe: 'ఉద్యానవన & పట్టణ అటవీ విభాగం',
    nameHi: 'बागवानी एवं शहरी वानिकी',
    description: 'Fallen trees, dangerous branches pruning, park upkeep, and green belts.',
    email: 'horticulture@municipality.gov.in',
    phone: '040-23306666',
    headOfficerName: 'Smt. V. Lakshmi (Director of Urban Horticulture)'
  },
  {
    id: 'd1000000-0000-0000-0000-000000000007',
    code: 'DEPT-TPN',
    name: 'Town Planning & Anti-Encroachment',
    nameTe: 'టౌన్ ప్లానింగ్ & ఆక్రమణల నిరోధం',
    nameHi: 'नगर नियोजन एवं अतिक्रमण विरोधी',
    description: 'Illegal footpaths encroachment, hawker regulation, unauthorized hoardings.',
    email: 'townplanning@municipality.gov.in',
    phone: '040-23307777',
    headOfficerName: 'Shri. P. Suresh (Chief City Planner)'
  }
];
