-- Site settings: admin-editable content visible to all users
-- Run after 002_admin_role.sql

CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Everyone can read site settings (public content)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings" ON site_settings
    FOR SELECT USING (true);

-- Only admin can insert/update/delete
CREATE POLICY "Admin can insert site settings" ON site_settings
    FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update site settings" ON site_settings
    FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin can delete site settings" ON site_settings
    FOR DELETE USING (public.is_admin());

-- Seed default keys so admin can edit them
INSERT INTO site_settings (key, value) VALUES
    ('hero_title', '"Civil Engineering Calculators"'),
    ('hero_tagline', '"Estimate Cement, Concrete, Bricks, Steel, and more with accuracy."'),
    ('announcement', '""'),
    ('footer_tagline', '"Built for engineers and contractors."'),
    ('featured_calculators', '["cement-concrete", "brick-masonry", "steel-weight", "construction-cost"]')
ON CONFLICT (key) DO NOTHING;
