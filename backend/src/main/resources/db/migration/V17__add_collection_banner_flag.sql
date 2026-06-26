-- V17: Add show_on_hero_banner to collections + seed banner images
ALTER TABLE collections ADD COLUMN IF NOT EXISTS show_on_hero_banner BOOLEAN NOT NULL DEFAULT FALSE;

-- Enable Satis collection to show on hero banner by default
UPDATE collections SET show_on_hero_banner = TRUE WHERE slug = 'bo-suu-tap-satis';
UPDATE collections SET show_on_hero_banner = TRUE WHERE slug = 'series-aqua-ceramic';

-- Update banner_url for each collection with placeholder images
UPDATE collections SET banner_url = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop'
WHERE slug = 'bo-suu-tap-satis';

UPDATE collections SET banner_url = 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop'
WHERE slug = 'series-aqua-ceramic';

UPDATE collections SET banner_url = 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2070&auto=format&fit=crop'
WHERE slug = 'giai-phap-tiet-kiem-nuoc';
