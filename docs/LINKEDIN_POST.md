# 🚀 Excited to share my latest project: NagarSetu — A Production-Ready Civic Complaint & Municipality Transparency Platform

Citizens frequently encounter civic issues like overflowing garbage bins, dangerous potholes, non-functional streetlights, open manholes, and sewage overflows. Yet, when reporting them, people often face a frustrating black hole:
* *Was my complaint even registered?*
* *Which department or officer is accountable?*
* *What concrete action has been taken?*
* *Why is it delayed, and when will it be fixed?*
* *Who verifies if the ground reality actually changed?*

To bridge this trust deficit between citizens and local urban administration, I designed and built **NagarSetu** (*"Your City. Your Voice. Your Right to Know."* — *"Report a Problem. Track the Action."*) — an open-source civic-tech transparency platform tailored for Indian municipal corporations.

---

### ✨ Key Capabilities & Engineering Highlights:

1. 🔍 **End-to-End Visual Audit Timeline**:
   Every status change (`Submitted` ➔ `Received` ➔ `Assigned` ➔ `Inspected` ➔ `Action Taken` ➔ `Resolved` ➔ `Citizen Verified`) is immutably logged with designated officer names, exact timestamps, official notes, and photographic proof. Complaint IDs follow a clean format (e.g. `NAG-2026-000123`).

2. 📍 **Smart Geo-Duplicate Prevention ("+1 Me Too")**:
   When citizens report an issue, an interactive Haversine spatial algorithm checks for active complaints within 300m. Instead of filing redundant duplicates, citizens can simply support existing reports, elevating community priority while preventing municipal backlogs.

3. ⏳ **Dynamic SLA & Multi-Tier Escalation Engine**:
   Category-specific resolution SLAs (e.g., 24h for garbage/open manholes vs 7 days for road paving). Overdue complaints automatically trigger real-time escalation:
   - **Level 1**: Designated Ward Field Officer
   - **Level 2**: Zonal Supervisor
   - **Level 3**: Municipal Commissioner / Central Grievance Cell

4. ✅ **Citizen-Driven Verification Loop**:
   A complaint is never officially closed on the officer’s word alone. The reporting citizen must confirm the fix with **"YES, IT'S FIXED"** (+ rating) or **"NO, THE PROBLEM STILL EXISTS"** (+ photo evidence), triggering an immediate supervisor audit and auto-escalation.

5. 🗺️ **Interactive Public GIS Map & Open Data Dashboard**:
   Live OpenStreetMap view with custom priority-coded markers and aggregated city-wide metrics (resolution rate, average days, department performance leaderboards) with complete privacy masking for citizens' personal data.

6. 🌐 **Inclusive Multilingual Support**:
   Crafted with simple everyday terms in **English**, **Telugu (తెలుగు)**, and **Hindi (हिंदी)** to ensure digital accessibility for every citizen.

---

### 🛠️ Built With:
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Leaflet (React-Leaflet), Recharts, Canvas Confetti.
- **Backend & Database Architecture**: PostgreSQL / Supabase, Row Level Security (RLS), custom triggers, indexed geospatial queries, and audit logs.
- **Testing**: Vitest & React Testing Library.

💡 *NagarSetu is an independent, academic civic-tech prototype demonstrating how modern web standards and radical transparency can modernize municipal governance.*

Check out the repository and live demo: [Link to your GitHub repo]

#NagarSetu #CivicTech #WebDevelopment #React #TypeScript #PostgreSQL #GovTech #OpenSource #FullStack #SoftwareEngineering #SmartCities #DigitalIndia
