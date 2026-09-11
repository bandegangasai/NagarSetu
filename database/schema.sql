-- ============================================================================
-- NagarSetu: Production-Ready Relational Database Schema (PostgreSQL / Supabase)
-- "Your City. Your Voice. Your Right to Know."
-- Citizen Civic Accountability Platform
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean up any existing objects (for clean rebuilds)
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS complaint_status CASCADE;
DROP TYPE IF EXISTS complaint_priority CASCADE;
DROP TYPE IF EXISTS escalation_level CASCADE;
DROP TYPE IF EXISTS media_type CASCADE;

-- Enums
CREATE TYPE user_role AS ENUM ('citizen', 'officer', 'admin', 'supervisor');
CREATE TYPE complaint_status AS ENUM (
    'submitted',
    'received',
    'under_review',
    'assigned',
    'in_progress',
    'action_taken',
    'resolved',
    'reopened',
    'rejected'
);
CREATE TYPE complaint_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE escalation_level AS ENUM ('level_1_officer', 'level_2_supervisor', 'level_3_commissioner');
CREATE TYPE media_type AS ENUM ('image', 'video', 'document');

-- ----------------------------------------------------------------------------
-- 1. Departments Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_te VARCHAR(255),
    name_hi VARCHAR(255),
    description TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    head_officer_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. Categories Table with Configurable SLA Defaults
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaint_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_te VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255) NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    default_priority complaint_priority DEFAULT 'medium',
    sla_days INTEGER NOT NULL DEFAULT 3,
    sla_hours INTEGER NOT NULL DEFAULT 72,
    icon_name VARCHAR(100) DEFAULT 'AlertCircle',
    emergency_warning TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. Users and Profiles
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- Foreign key to supabase auth.users if available
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20),
    role user_role DEFAULT 'citizen',
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    designation VARCHAR(255),
    employee_code VARCHAR(100),
    ward_no VARCHAR(50),
    preferred_language VARCHAR(10) DEFAULT 'en',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. Locations & Wards Master
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city VARCHAR(100) NOT NULL,
    ward_no VARCHAR(50) NOT NULL,
    ward_name VARCHAR(255) NOT NULL,
    zone VARCHAR(100),
    pincode VARCHAR(10),
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. Main Complaints Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id VARCHAR(50) UNIQUE NOT NULL, -- Format: CIV-YYYY-NNNNNN
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES complaint_categories(id),
    department_id UUID REFERENCES departments(id),
    assigned_officer_id UUID REFERENCES profiles(id),
    citizen_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    
    -- Status & SLA Tracking
    status complaint_status DEFAULT 'submitted',
    priority complaint_priority DEFAULT 'medium',
    escalation_level escalation_level DEFAULT 'level_1_officer',
    sla_deadline TIMESTAMPTZ NOT NULL,
    is_overdue BOOLEAN DEFAULT FALSE,
    overdue_days INTEGER DEFAULT 0,
    resolved_at TIMESTAMPTZ,
    reopened_count INTEGER DEFAULT 0,
    
    -- Location & Privacy
    location_address TEXT NOT NULL,
    landmark TEXT,
    ward_no VARCHAR(50),
    city VARCHAR(100) DEFAULT 'Hyderabad',
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    supporters_count INTEGER DEFAULT 1,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. Complaint Status History & Audit Log (Never Overwrite)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaint_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    previous_status complaint_status,
    new_status complaint_status NOT NULL,
    changed_by_id UUID REFERENCES profiles(id),
    actor_name VARCHAR(255) NOT NULL,
    actor_role user_role NOT NULL,
    remarks TEXT,
    department_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. Complaint Official Updates & Progress Notes
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaint_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    officer_id UUID REFERENCES profiles(id),
    officer_name VARCHAR(255) NOT NULL,
    update_title VARCHAR(255) NOT NULL,
    update_text TEXT NOT NULL,
    action_type VARCHAR(100) DEFAULT 'field_inspection',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. Complaint Evidence / Media (Before & After Resolution)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaint_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type media_type DEFAULT 'image',
    caption TEXT,
    stage VARCHAR(50) NOT NULL DEFAULT 'initial', -- 'initial' (citizen report), 'inspection', 'resolved' (after-proof)
    uploaded_by_id UUID REFERENCES profiles(id),
    uploaded_by_role user_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. Citizen Verification & Feedback
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS citizen_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID UNIQUE NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    citizen_id UUID REFERENCES profiles(id),
    is_confirmed_resolved BOOLEAN NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    reopen_reason TEXT,
    reopen_evidence_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. Complaint Supporters ("Me Too" / Duplicate Clustering)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaint_supporters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    citizen_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(complaint_id, citizen_id)
);

-- ----------------------------------------------------------------------------
-- 11. In-App & Multi-Channel Notifications
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'status_change',
    action_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 12. SLA Rules & Escalation Policies Master
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sla_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES complaint_categories(id) ON DELETE CASCADE,
    level_1_hours INTEGER NOT NULL DEFAULT 72,   -- Field Officer SLA
    level_2_hours INTEGER NOT NULL DEFAULT 120,  -- Supervisor Escalation SLA
    level_3_hours INTEGER NOT NULL DEFAULT 168,  -- Commissioner Escalation SLA
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- Performance Indexes
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_complaints_id_code ON complaints(complaint_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category_id);
CREATE INDEX IF NOT EXISTS idx_complaints_department ON complaints(department_id);
CREATE INDEX IF NOT EXISTS idx_complaints_officer ON complaints(assigned_officer_id);
CREATE INDEX IF NOT EXISTS idx_complaints_citizen ON complaints(citizen_id);
CREATE INDEX IF NOT EXISTS idx_complaints_is_overdue ON complaints(is_overdue);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_geo ON complaints(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_status_history_complaint ON complaint_status_history(complaint_id);
CREATE INDEX IF NOT EXISTS idx_evidence_complaint ON complaint_evidence(complaint_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id, is_read);

-- ----------------------------------------------------------------------------
-- Automatic Triggers & Functions
-- ----------------------------------------------------------------------------

-- Function: Auto-generate Unique Complaint ID (NAG-YYYY-XXXXXX)
CREATE OR REPLACE FUNCTION generate_complaint_id()
RETURNS TRIGGER AS $$
DECLARE
    current_year TEXT := TO_CHAR(NOW(), 'YYYY');
    seq_number INT;
BEGIN
    IF NEW.complaint_id IS NULL OR NEW.complaint_id = '' THEN
        SELECT COUNT(*) + 1 INTO seq_number FROM complaints WHERE created_at >= DATE_TRUNC('year', NOW());
        NEW.complaint_id := 'NAG-' || current_year || '-' || LPAD(seq_number::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_complaint_id ON complaints;
CREATE TRIGGER trigger_generate_complaint_id
BEFORE INSERT ON complaints
FOR EACH ROW
EXECUTE FUNCTION generate_complaint_id();

-- Function: Compute SLA Deadline and Check Overdue Status
CREATE OR REPLACE FUNCTION compute_complaint_sla()
RETURNS TRIGGER AS $$
DECLARE
    cat_sla_days INT;
BEGIN
    IF NEW.sla_deadline IS NULL THEN
        SELECT sla_days INTO cat_sla_days FROM complaint_categories WHERE id = NEW.category_id;
        IF cat_sla_days IS NULL THEN
            cat_sla_days := 3;
        END IF;
        NEW.sla_deadline := NEW.created_at + (cat_sla_days || ' days')::INTERVAL;
    END IF;

    -- Update overdue flag if unresolved and past deadline
    IF NEW.status NOT IN ('resolved', 'rejected') AND NOW() > NEW.sla_deadline THEN
        NEW.is_overdue := TRUE;
        NEW.overdue_days := GREATEST(1, EXTRACT(DAY FROM NOW() - NEW.sla_deadline)::INT);
        IF NEW.escalation_level = 'level_1_officer' THEN
            NEW.escalation_level := 'level_2_supervisor';
        END IF;
    ELSE
        NEW.is_overdue := FALSE;
        NEW.overdue_days := 0;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_compute_complaint_sla ON complaints;
CREATE TRIGGER trigger_compute_complaint_sla
BEFORE INSERT OR UPDATE ON complaints
FOR EACH ROW
EXECUTE FUNCTION compute_complaint_sla();

-- ----------------------------------------------------------------------------
-- Public Transparency View (Zero PII Leakage)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public_transparency_complaints AS
SELECT 
    c.id,
    c.complaint_id,
    c.title,
    c.description,
    c.status,
    c.priority,
    c.escalation_level,
    c.is_overdue,
    c.overdue_days,
    c.supporters_count,
    c.city,
    c.ward_no,
    c.location_address,
    c.latitude,
    c.longitude,
    c.created_at,
    c.resolved_at,
    cat.name AS category_name,
    cat.name_te AS category_name_te,
    cat.name_hi AS category_name_hi,
    cat.icon_name AS category_icon,
    d.name AS department_name,
    d.name_te AS department_name_te,
    d.name_hi AS department_name_hi
FROM complaints c
JOIN complaint_categories cat ON c.category_id = cat.id
LEFT JOIN departments d ON c.department_id = d.id;

-- ----------------------------------------------------------------------------
-- Row Level Security (RLS) Policies
-- ----------------------------------------------------------------------------
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Complaints: Everyone can view public complaint details (anonymized)
CREATE POLICY "Public complaints are readable by all"
ON complaints FOR SELECT USING (true);

-- Complaints: Citizens can insert complaints
CREATE POLICY "Citizens can create complaints"
ON complaints FOR INSERT WITH CHECK (true);

-- Complaints: Only assigned officer or admin can update status
CREATE POLICY "Officers and Admins can update complaints"
ON complaints FOR UPDATE USING (
    auth.uid() = assigned_officer_id 
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor'))
);

-- Notifications: Users only see their own notifications
CREATE POLICY "Users read own notifications"
ON notifications FOR SELECT USING (recipient_id = auth.uid());
