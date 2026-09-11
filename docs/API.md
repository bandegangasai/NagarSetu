# NagarSetu API & Service Specification

## 1. REST / Supabase Endpoints Overview

NagarSetu provides clean RESTful and Supabase-compatible client interfaces for complaint submission, live tracking, status mutation, evidence uploads, citizen verification, and transparency analytics.

### Authentication Endpoints
- `POST /auth/register` — Register a new citizen account.
- `POST /auth/login` — Sign in with email or phone OTP.
- `POST /auth/logout` — Invalidate user session token.
- `GET /auth/me` — Retrieve active profile with RBAC roles (`citizen`, `officer`, `admin`).

---

### Complaints Endpoints

#### `GET /api/complaints`
Retrieve list of complaints with filtering and pagination.
- **Query Parameters**:
  - `status` (optional): `submitted | received | assigned | in_progress | action_taken | resolved | reopened`
  - `category_id` (optional): Filter by category UUID.
  - `department_id` (optional): Filter by department UUID.
  - `city` (optional): `Hyderabad | Bengaluru | Delhi | Pune | Mumbai`
  - `is_overdue` (optional): `true | false`
  - `search` (optional): Text search across `complaint_id`, `title`, `landmark`.
- **Response**: `200 OK` Array of Complaint objects with public masking applied.

#### `GET /api/complaints/:id`
Retrieve full complaint dossier by database UUID or formatted Complaint ID (e.g. `NAG-2026-000123`).
- **Response**: `200 OK` Complaint object including timeline history, evidence attachments, and feedback.

#### `POST /api/complaints`
File a new civic complaint.
- **Request Body**:
  ```json
  {
    "title": "Severe waterlogging and open drain overflow",
    "description": "Black sewage water backing onto the street after moderate rain.",
    "category_id": "c1000000-0000-0000-0000-000000000004",
    "location_address": "Road No. 36, Jubilee Hills",
    "landmark": "Near Metro Pillar 24",
    "ward_no": "Ward 94",
    "city": "Hyderabad",
    "latitude": 17.4325,
    "longitude": 78.4072,
    "is_anonymous": false,
    "initial_photo_url": "https://images.unsplash.com/photo-..."
  }
  ```
- **Response**: `201 Created` with generated `complaint_id` and calculated `sla_deadline`.

#### `POST /api/complaints/:id/support`
Add citizen support (+1 "Me Too") to an existing complaint to prevent duplicate submissions.
- **Response**: `200 OK` `{ "supporters_count": 15, "supported": true }`

#### `PATCH /api/complaints/:id/status` (Officers & Admins Only)
Update complaint status and record audit trail.
- **Request Body**:
  ```json
  {
    "status": "in_progress",
    "remarks": "Inspection completed. Repair team dispatched with materials.",
    "evidence_photo_url": "https://..."
  }
  ```

#### `POST /api/complaints/:id/verify` (Citizen Owner Only)
Citizen confirms resolution or reopens the issue.
- **Request Body (Confirmed Resolved)**:
  ```json
  {
    "is_confirmed_resolved": true,
    "rating": 5,
    "feedback_text": "Great job, resolved within 24 hours!"
  }
  ```
- **Request Body (Reopen)**:
  ```json
  {
    "is_confirmed_resolved": false,
    "reopen_reason": "Pothole filled with loose gravel which washed away during rains.",
    "reopen_evidence_url": "https://..."
  }
  ```

---

### Duplicate Detection Service

#### `POST /api/complaints/check-duplicate`
Check for similar complaints nearby before final submission.
- **Request Body**:
  ```json
  {
    "category_id": "c1000000-0000-0000-0000-000000000002",
    "latitude": 17.4156,
    "longitude": 78.4350,
    "radius_meters": 250
  }
  ```
- **Response**: List of existing nearby active complaints with distance and supporter count.

---

### Public Transparency & Analytics Endpoints

#### `GET /api/transparency/stats`
Aggregate open data metrics:
```json
{
  "total_complaints": 12450,
  "resolved_count": 9320,
  "in_progress_count": 1820,
  "pending_count": 1030,
  "overdue_count": 280,
  "avg_resolution_days": 3.8,
  "sla_compliance_rate_percent": 91.4
}
```
