import { COMPLAINT_CATEGORIES } from '../data/categories';
import { DEPARTMENTS } from '../data/departments';
import { ComplaintCategory, ComplaintPriority, Department } from '../types';

export interface AiSuggestion {
  suggestedCategoryId: string;
  suggestedCategory: ComplaintCategory;
  suggestedDepartment: Department;
  suggestedPriority: ComplaintPriority;
  confidenceScore: number; // 0 to 100
  reasoning: string;
  detectedKeywords: string[];
}

// Category keyword mappings across English, Telugu, and Hindi
const CATEGORY_KEYWORD_RULES: {
  categoryCode: string;
  keywords: string[];
  priorityKeywords?: { priority: ComplaintPriority; keywords: string[]; reason: string }[];
}[] = [
  {
    categoryCode: 'CAT_POTHOLE',
    keywords: [
      'pothole', 'road', 'asphalt', 'bitumen', 'crater', 'cavity', 'damaged road', 'uneven road',
      'గుంత', 'గుంతలు', 'రోడ్డు', 'తారు', 'పాడైన రోడ్డు',
      'गड्ढा', 'गड्ढे', 'सड़क', 'डामर', 'टूटी सड़क'
    ],
    priorityKeywords: [
      { priority: 'critical', keywords: ['hospital', 'accident', 'slipped', 'death', 'danger', 'ఆసుపత్రి', 'ప్రమాదం', 'अस्पताल', 'दुर्घटना'], reason: 'Near hospital or severe accident risk reported' },
      { priority: 'high', keywords: ['school', 'bus stop', 'traffic', 'main road', 'పాఠశాల', 'స్కూల్', 'स्कूल'], reason: 'Near school / high traffic zone' }
    ]
  },
  {
    categoryCode: 'CAT_GARBAGE',
    keywords: [
      'garbage', 'waste', 'trash', 'dumper', 'bin', 'stench', 'foul smell', 'dumping', 'rubbish',
      'చెత్త', 'చెత్తకుండీ', 'దుర్వాసన', 'డంపింగ్',
      'कचरा', 'कूड़ा', 'डस्टबिन', 'बदबू', 'कूड़ेदान'
    ],
    priorityKeywords: [
      { priority: 'high', keywords: ['hospital', 'market', 'spreading', 'dogs', 'worms', 'ఆసుపత్రి', 'మార్కెట్'], reason: 'Severe hygiene hazard in public market/hospital area' }
    ]
  },
  {
    categoryCode: 'CAT_STREETLIGHT',
    keywords: [
      'street light', 'streetlight', 'lamp', 'dark', 'blackout', 'light not working', 'pole', 'bulb', 'led',
      'వీధి దీపం', 'లైట్', 'చీకటి', 'కరెంట్', 'పనిచేయడం లేదు',
      'स्ट्रीट लाइट', 'बत्ती', 'अंधेरा', 'लाइट बंद', 'खंभा'
    ],
    priorityKeywords: [
      { priority: 'high', keywords: ['metro', 'women safety', 'crime', 'corridor', 'night', 'రాత్రి', 'మహిళలు', 'रात', 'महिला'], reason: 'Safety concern for commuters & pedestrians in dark corridor' }
    ]
  },
  {
    categoryCode: 'CAT_MANHOLE',
    keywords: [
      'manhole', 'open manhole', 'drain cover', 'chamber', 'missing lid',
      'మ్యాన్‌హోల్', 'ఓపెన్ మ్యాన్‌హోల్', 'డ్రైనేజీ మూత',
      'मैनहोल', 'खुला मैनहोल', 'ढक्कन नहीं है'
    ],
    priorityKeywords: [
      { priority: 'critical', keywords: ['open', 'rain', 'fallen', 'waterlogged', 'తీసి ఉంది', 'వర్షం', 'खुला'], reason: 'Immediate life hazard - risk of falling into open drainage cavity' }
    ]
  },
  {
    categoryCode: 'CAT_WATER',
    keywords: [
      'water', 'drinking water', 'contamination', 'dirty water', 'pipeline', 'leakage', 'no water', 'supply',
      'నీరు', 'తాగునీరు', 'కలుషిత నీరు', 'పైప్‌లైన్', 'లీకేజ్', 'నీళ్లు రావడం లేదు',
      'पानी', 'पीने का पानी', 'गंदा पानी', 'पाइपलाइन', 'पानी नहीं आ रहा'
    ],
    priorityKeywords: [
      { priority: 'high', keywords: ['contaminated', 'black water', 'smell', 'sick', 'కలుషితం', 'बीमार'], reason: 'Contaminated drinking water poses acute public health risk' }
    ]
  },
  {
    categoryCode: 'CAT_DRAINAGE',
    keywords: [
      'drainage', 'sewage', 'gutter', 'overflow', 'choked', 'stagnant', 'waterlogging', 'backflow',
      'డ్రైనేజీ', 'మురుగు నీరు', 'కాలువ', 'పొంగిపొర్లుతోంది', 'జామ్',
      'नाली', 'सीवेज', 'गटर', 'नालियां जाम', 'गंदा पानी सड़क पर'
    ],
    priorityKeywords: [
      { priority: 'high', keywords: ['house', 'flooding', 'inside', 'illness', 'ఇళ్లలోకి', 'घर में'], reason: 'Sewage backflow entering residential premises' }
    ]
  },
  {
    categoryCode: 'CAT_ANIMALS',
    keywords: [
      'dog', 'stray dog', 'animal', 'monkey', 'cattle', 'bite', 'barking', 'rabies',
      'కుక్కలు', 'వీధి కుక్కలు', 'జంతువులు', 'కోతులు', 'పిచ్చి కుక్క',
      'कुत्ता', 'आवारा कुत्ते', 'बंदर', 'काटना', 'पशु'
    ],
    priorityKeywords: [
      { priority: 'high', keywords: ['bite', 'children', 'aggressive', 'rabies', 'కరిచింది', 'పిల్లలు', 'काटा', 'बच्चे'], reason: 'Aggressive animal behavior or dog bite incident' }
    ]
  },
  {
    categoryCode: 'CAT_TREES',
    keywords: [
      'tree', 'branch', 'fallen tree', 'electric wire', 'storm', 'blocking road',
      'చెట్టు', 'కొమ్మ', 'విరిగిపడింది', 'విద్యుత్ వైర్లు',
      'पेड़', 'शाखा', 'पेड़ गिर गया', 'बिजली के तार'
    ],
    priorityKeywords: [
      { priority: 'critical', keywords: ['wire', 'spark', 'electric', 'power', 'లైన్లు', 'तार'], reason: 'Fallen branch touching active high-voltage electrical wires' }
    ]
  }
];

/**
 * Analyzes problem description or spoken text and suggests category, department, priority, and reason.
 */
export function analyzeComplaintText(text: string): AiSuggestion {
  const normalized = text.toLowerCase().trim();

  let bestMatchCategoryCode = 'CAT_POTHOLE';
  let bestScore = 0;
  let detectedWords: string[] = [];
  let suggestedPriority: ComplaintPriority = 'medium';
  let reasoning = 'Standard municipal complaint categorization based on reported details.';

  for (const rule of CATEGORY_KEYWORD_RULES) {
    let matches = 0;
    const currentDetected: string[] = [];

    for (const kw of rule.keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        matches++;
        currentDetected.push(kw);
      }
    }

    if (matches > bestScore) {
      bestScore = matches;
      bestMatchCategoryCode = rule.categoryCode;
      detectedWords = currentDetected;

      // Check priority keywords
      if (rule.priorityKeywords) {
        for (const pRule of rule.priorityKeywords) {
          for (const pkw of pRule.keywords) {
            if (normalized.includes(pkw.toLowerCase())) {
              suggestedPriority = pRule.priority;
              reasoning = pRule.reason;
              break;
            }
          }
        }
      }
    }
  }

  // Fallback if no specific keyword matched
  const matchedCategory =
    COMPLAINT_CATEGORIES.find((c) => c.code === bestMatchCategoryCode) || COMPLAINT_CATEGORIES[0];
  const matchedDepartment =
    DEPARTMENTS.find((d) => d.id === matchedCategory.departmentId) || DEPARTMENTS[0];

  const confidence = bestScore > 0 ? Math.min(95, 60 + bestScore * 12) : 50;

  if (bestScore > 0 && reasoning === 'Standard municipal complaint categorization based on reported details.') {
    reasoning = `Detected keywords (${detectedWords.slice(0, 3).join(', ')}) related to ${matchedCategory.name}. Routed directly to ${matchedDepartment.name}.`;
  }

  return {
    suggestedCategoryId: matchedCategory.id,
    suggestedCategory: matchedCategory,
    suggestedDepartment: matchedDepartment,
    suggestedPriority,
    confidenceScore: confidence,
    reasoning,
    detectedKeywords: detectedWords
  };
}
