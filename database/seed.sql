-- ============================================================================
-- NagarSetu: Comprehensive Seed Data for Indian Municipalities
-- ============================================================================

-- 1. Insert Departments
INSERT INTO departments (id, code, name, name_te, name_hi, description, email, phone, head_officer_name)
VALUES
('d1000000-0000-0000-0000-000000000001', 'DEPT-SAN', 'Sanitation & Solid Waste Management', 'పారిశుద్ధ్య & ఘన వ్యర్థాల నిర్వహణ', 'स्वच्छता एवं ठोस अपशिष्ट प्रबंधन', 'Garbage collection, waste segregation, bins maintenance and road sweeping.', 'sanitation@municipality.gov.in', '040-23301111', 'Shri. S. Narayana'),
('d1000000-0000-0000-0000-000000000002', 'DEPT-ENG', 'Roads & Infrastructure Engineering', 'రోడ్లు & మౌలిక వసతుల ఇంజనీరింగ్', 'सड़क एवं बुनियादी ढांचा इंजीनियरिंग', 'Asphalt paving, pothole repairs, footpaths, bridges, and road markers.', 'roads@municipality.gov.in', '040-23302222', 'Er. M. Venkatesh'),
('d1000000-0000-0000-0000-000000000003', 'DEPT-WTR', 'Water Supply & Underground Drainage', 'నీటి సరఫరా & భూగర్భ డ్రైనేజీ', 'जल आपूर्ति एवं भूमिगत जल निकासी', 'Potable water pipelines, sewage lines, open drains, and storm water maintenance.', 'water@municipality.gov.in', '040-23303333', 'Er. K. Radhika'),
('d1000000-0000-0000-0000-000000000004', 'DEPT-ELE', 'Electrical & Street Lighting', 'విద్యుత్ & వీధి దీపాలు', 'विद्युत एवं स्ट्रीट लाइटिंग', 'Streetlights, LED fixtures, timer panels, electric poles, and transformers.', 'electrical@municipality.gov.in', '040-23304444', 'Er. R. K. Gupta'),
('d1000000-0000-0000-0000-000000000005', 'DEPT-HLT', 'Public Health & Vector Control', 'ప్రజారోగ్యం & కీటక నియంత్రణ', 'सार्वजनिक स्वास्थ्य एवं कीट नियंत्रण', 'Mosquito fogging, epidemic prevention, public toilet hygiene, and sanitation audits.', 'health@municipality.gov.in', '040-23305555', 'Dr. B. Prasad'),
('d1000000-0000-0000-0000-000000000006', 'DEPT-HOR', 'Horticulture & Urban Forestry', 'ఉద్యానవన & పట్టణ అటవీ విభాగం', 'बागवानी एवं शहरी वानिकी', 'Fallen trees, dangerous branches pruning, park upkeep, and green belts.', 'horticulture@municipality.gov.in', '040-23306666', 'Smt. V. Lakshmi'),
('d1000000-0000-0000-0000-000000000007', 'DEPT-TPN', 'Town Planning & Anti-Encroachment', 'టౌన్ ప్లానింగ్ & ఆక్రమణల నిరోధం', 'नगर नियोजन एवं अतिक्रमण विरोधी', 'Illegal footpaths encroachment, hawker regulation, unauthorized hoardings.', 'townplanning@municipality.gov.in', '040-23307777', 'Shri. P. Suresh');

-- 2. Insert Categories
INSERT INTO complaint_categories (id, code, name, name_te, name_hi, department_id, default_priority, sla_days, sla_hours, icon_name, emergency_warning)
VALUES
('c1000000-0000-0000-0000-000000000001', 'CAT-GARB', 'Garbage Not Collected / Overflowing Bins', 'చెత్త సేకరించలేదు / డస్ట్‌బిన్ పొంగిపొర్లుతోంది', 'कचरा नहीं उठाया गया / डस्टबिन भरा हुआ', 'd1000000-0000-0000-0000-000000000001', 'high', 1, 24, 'Trash2', NULL),
('c1000000-0000-0000-0000-000000000002', 'CAT-POTH', 'Road Potholes & Surface Damage', 'రోడ్డు గుంతలు & ఉపరితల నష్టం', 'सड़क के गड्ढे और सतह की खराबी', 'd1000000-0000-0000-0000-000000000002', 'high', 7, 168, 'Activity', 'If deep pothole causing vehicle accidents, please warn motorists.'),
('c1000000-0000-0000-0000-000000000003', 'CAT-STRT', 'Street Lights Not Working', 'వీధి దీపాలు పనిచేయడం లేదు', 'स्ट्रीट लाइट बंद है / नहीं जल रही', 'd1000000-0000-0000-0000-000000000004', 'medium', 3, 72, 'Lightbulb', NULL),
('c1000000-0000-0000-0000-000000000004', 'CAT-DRAN', 'Drainage / Sewage Overflow', 'డ్రైనేజీ / మురుగునీరు పొంగిపొర్లుతోంది', 'नाली या सीवर का गंदा पानी सड़क पर बहना', 'd1000000-0000-0000-0000-000000000003', 'high', 2, 48, 'Waves', 'Health hazard: avoid contact with contaminated drainage water.'),
('c1000000-0000-0000-0000-000000000005', 'CAT-MANH', 'Open / Broken Manhole Cover', 'తెరిచిన / విరిగిన మ్యాన్‌హోల్ మూత', 'खुला या टूटा हुआ मेनहोल ढक्कन', 'd1000000-0000-0000-0000-000000000003', 'critical', 1, 24, 'AlertTriangle', 'CRITICAL HAZARD: High risk of pedestrian/motorcycle falls. Priority response dispatched.'),
('c1000000-0000-0000-0000-000000000006', 'CAT-WATR', 'Drinking Water Contamination / Low Pressure', 'తాగునీటి కాలుష్యం / తక్కువ పీడనం', 'पीने के पानी का प्रदूषण / कम दबाव', 'd1000000-0000-0000-0000-000000000003', 'high', 3, 72, 'Droplets', NULL),
('c1000000-0000-0000-0000-000000000007', 'CAT-TOIL', 'Public Toilet Maintenance & Cleanliness', 'ప్రజా మరుగుదొడ్ల నిర్వహణ & పరిశుభ్రత', 'सार्वजनिक शौचालय की सफाई और रखरखाव', 'd1000000-0000-0000-0000-000000000005', 'medium', 2, 48, 'Building', NULL),
('c1000000-0000-0000-0000-000000000008', 'CAT-STRAY', 'Stray Dog Menace / Animal Issues', 'వీధి కుక్కల బెడద / జంతువుల సమస్యలు', 'आवारा कुत्तों का आतंक / पशु समस्या', 'd1000000-0000-0000-0000-000000000005', 'medium', 4, 96, 'ShieldAlert', 'For animal bite emergencies, visit nearest government hospital immediately for anti-rabies vaccination.'),
('c1000000-0000-0000-0000-000000000009', 'CAT-MOSQ', 'Mosquito Menace / Fogging Request', 'దోమల బెడద / ఫాగింగ్ అభ్యర్థన', 'मच्छरों का प्रकोप / फॉगिंग का अनुरोध', 'd1000000-0000-0000-0000-000000000005', 'low', 3, 72, 'Wind', NULL),
('c1000000-0000-0000-0000-000000000010', 'CAT-TREE', 'Fallen Tree / Hazardous Hanging Branches', 'కూలిన చెట్టు / ప్రమాదకరమైన కొమ్మలు', 'गिरा हुआ पेड़ / खतरनाक लटकती डालियां', 'd1000000-0000-0000-0000-000000000006', 'high', 2, 48, 'Trees', 'If tree has fallen on live electrical cables, do not touch. Call 112.'),
('c1000000-0000-0000-0000-000000000011', 'CAT-FOOT', 'Broken Footpaths & Pavements', 'విరిగిన ఫుట్‌పాత్ & పేవ్‌మెంట్లు', 'टूटे हुए फुटपाथ / चलने का रास्ता', 'd1000000-0000-0000-0000-000000000002', 'medium', 7, 168, 'Footprints', NULL),
('c1000000-0000-0000-0000-000000000012', 'CAT-ENCR', 'Illegal Encroachment on Public Roads', 'ప్రజా రోడ్లపై అక్రమ ఆక్రమణలు', 'सार्वजनिक सड़कों और रास्तों पर अवैध अतिक्रमण', 'd1000000-0000-0000-0000-000000000007', 'medium', 10, 240, 'Ban', NULL);

-- 3. Insert Demo Profiles
INSERT INTO profiles (id, full_name, email, phone_number, role, department_id, designation, employee_code, preferred_language, avatar_url)
VALUES
-- Demo Citizen
('u1000000-0000-0000-0000-000000000001', 'Ramesh Kumar', 'ramesh.kumar@example.com', '+91 98480 12345', 'citizen', NULL, 'Resident Citizen', NULL, 'en', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
('u1000000-0000-0000-0000-000000000002', 'Sunita Rao', 'sunita.rao@example.com', '+91 94401 56789', 'citizen', NULL, 'Resident Citizen', NULL, 'te', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'),
('u1000000-0000-0000-0000-000000000003', 'Anita Sharma', 'anita.sharma@example.com', '+91 98111 22334', 'citizen', NULL, 'Resident Citizen', NULL, 'hi', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),

-- Demo Officers
('u2000000-0000-0000-0000-000000000001', 'Rajesh Patel', 'rajesh.patel@municipality.gov.in', '+91 98765 43210', 'officer', 'd1000000-0000-0000-0000-000000000001', 'Senior Sanitation Inspector (Ward 92)', 'GHMC-SAN-402', 'en', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('u2000000-0000-0000-0000-000000000002', 'Vikram Sharma', 'vikram.sharma@municipality.gov.in', '+91 98765 43211', 'officer', 'd1000000-0000-0000-0000-000000000004', 'Assistant Electrical Engineer (Central Zone)', 'GHMC-ELE-108', 'hi', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
('u2000000-0000-0000-0000-000000000003', 'K. V. Subbarao', 'subbarao.kv@municipality.gov.in', '+91 98765 43212', 'officer', 'd1000000-0000-0000-0000-000000000002', 'Executive Road Works Engineer', 'GHMC-ENG-214', 'te', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),

-- Demo Municipality Administrator
('u3000000-0000-0000-0000-000000000001', 'Dr. A. K. Verma, IAS', 'commissioner@municipality.gov.in', '+91 99999 88888', 'admin', NULL, 'Zonal Additional Commissioner', 'ADMIN-IAS-001', 'en', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150');

-- 4. Sample Complaints
INSERT INTO complaints (
    id, complaint_id, title, description, category_id, department_id, assigned_officer_id, citizen_id,
    status, priority, escalation_level, sla_deadline, is_overdue, overdue_days,
    location_address, landmark, ward_no, city, latitude, longitude, supporters_count, is_anonymous, created_at, resolved_at
)
VALUES
(
    'a1000000-0000-0000-0000-000000000001', 'NAG-2026-000001',
    'Street light not working near residential lane & park entrance',
    'Complete blackout for 3 consecutive street fixtures on 5th Cross Road. The lane is pitch dark after 7:00 PM, causing severe safety concerns.',
    'c1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000004',
    'u2000000-0000-0000-0000-000000000002', 'u1000000-0000-0000-0000-000000000001',
    'resolved', 'medium', 'level_1_officer',
    NOW() - INTERVAL '2 days', FALSE, 0,
    '5th Cross, Madhapur, Hyderabad', 'Near Durgam Cheruvu Metro', 'Ward 105 - Madhapur', 'Hyderabad',
    17.4435, 78.3882, 18, FALSE, NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day'
),
(
    'a1000000-0000-0000-0000-000000000002', 'NAG-2026-000002',
    'Overflowing community garbage dumper behind market',
    'The 5-ton community dumper bin has not been cleared for 4 days. Foul smell spreading to adjacent residential apartments and stray dogs scattering debris.',
    'c1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001',
    'u2000000-0000-0000-0000-000000000001', 'u1000000-0000-0000-0000-000000000002',
    'reopened', 'high', 'level_2_supervisor',
    NOW() - INTERVAL '1 day', TRUE, 1,
    'Street 4, Madhapur Vegetable Market, Hyderabad', 'Near Community Water Tank', 'Ward 105 - Madhapur', 'Hyderabad',
    17.4483, 78.3915, 24, FALSE, NOW() - INTERVAL '3 days', NULL
),
(
    'a1000000-0000-0000-0000-000000000003', 'NAG-2026-000003',
    'Dangerous pothole near Apollo Hospital entrance',
    'Massive 2-foot pothole on Road No 10 causing vehicles to swerve into oncoming traffic. Multiple two-wheelers have slipped yesterday during evening rain.',
    'c1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000002',
    'u2000000-0000-0000-0000-000000000003', 'u1000000-0000-0000-0000-000000000001',
    'in_progress', 'high', 'level_1_officer',
    NOW() + INTERVAL '2 days', FALSE, 0,
    'Road No. 10, Banjara Hills, Hyderabad', 'Opposite Apollo Hospital Gate 3', 'Ward 92 - Banjara Hills', 'Hyderabad',
    17.4156, 78.4350, 14, FALSE, NOW() - INTERVAL '1 day', NULL
),
(
    'a1000000-0000-0000-0000-000000000004', 'NAG-2026-000004',
    'Open storm drain manhole on crowded market footpath',
    'Concrete slab broken and missing on storm water manhole. Extremely hazardous for pedestrians, especially schoolchildren and evening shoppers.',
    'c1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000003',
    'u2000000-0000-0000-0000-000000000003', 'u1000000-0000-0000-0000-000000000003',
    'received', 'critical', 'level_2_supervisor',
    NOW() - INTERVAL '2 days', TRUE, 2,
    'Station Road, Secunderabad', 'Opposite Clock Tower Market Lane', 'Ward 147 - Secunderabad', 'Hyderabad',
    17.4399, 78.4983, 31, FALSE, NOW() - INTERVAL '3 days', NULL
),
(
    'a1000000-0000-0000-0000-000000000005', 'NAG-2026-000005',
    'Severe drainage backflow flooding residential street',
    'Blocked main sewer line causing black sewage water to overflow onto the road outside residential houses and primary school gate.',
    'c1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000003',
    'u2000000-0000-0000-0000-000000000003', 'u1000000-0000-0000-0000-000000000002',
    'in_progress', 'high', 'level_1_officer',
    NOW() + INTERVAL '1 day', FALSE, 0,
    '100 Feet Road, Indiranagar, Bengaluru', 'Near BDA Complex', 'Ward 82 - Indiranagar', 'Bengaluru',
    12.9719, 77.6412, 19, FALSE, NOW() - INTERVAL '1 day', NULL
);

-- 5. Insert Notifications
INSERT INTO notifications (recipient_id, complaint_id, title, message, type, action_url, is_read, created_at)
VALUES
('u1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 'Work in Progress', 'Your complaint #NAG-2026-000003 has been inspected by Er. K. V. Subbarao and repair work has commenced.', 'status_change', '/track/NAG-2026-000003', FALSE, NOW() - INTERVAL '6 hours'),
('u1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Complaint Resolved — Verified by You', 'Your complaint #NAG-2026-000001 has been marked Resolved & Verified with 5-star rating.', 'verification_required', '/track/NAG-2026-000001', TRUE, NOW() - INTERVAL '12 hours'),
('u2000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'SLA Overdue & Reopen Alert', 'Complaint #NAG-2026-000002 was reopened by citizen and escalated to Zonal Supervisor.', 'sla_warning', '/officer', FALSE, NOW() - INTERVAL '6 hours');

