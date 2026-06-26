-- Update password hash of admin@sanitary.com to correct bcrypt hash for 'admin123'
UPDATE users 
SET password = '$2a$10$sAH7IdYl3jlcYiiwqhP.qOMg5bFvbRIg1Eo2I4KXM0jhqHFUOnUVG' 
WHERE email = 'admin@sanitary.com';
