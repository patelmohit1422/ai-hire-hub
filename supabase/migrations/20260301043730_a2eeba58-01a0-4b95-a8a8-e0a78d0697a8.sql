
-- Update seed profiles with Indian names and locations
UPDATE profiles SET name = 'Aarav Patel', location = 'Mumbai, Maharashtra' WHERE id = '9cc4e06f-83d2-4f3b-a2f2-a1624fdb0b1d';
UPDATE profiles SET name = 'Vihaan Sharma', location = 'Delhi, NCR' WHERE id = '518ca1ae-e67f-4f41-8230-199bfc58b1d5';
UPDATE profiles SET name = 'Ananya Gupta', location = 'Bengaluru, Karnataka' WHERE id = '193bc276-bc45-4d1d-82b3-488b58374cf7';
UPDATE profiles SET name = 'Arjun Reddy', location = 'Hyderabad, Telangana' WHERE id = 'ebdbaaed-6a9b-4b49-8355-747ece0cf919';
UPDATE profiles SET name = 'Diya Nair', location = 'Kochi, Kerala' WHERE id = '78d046b0-e038-4c23-95e8-22ffd79bd2fd';
UPDATE profiles SET name = 'Rohan Joshi', location = 'Pune, Maharashtra' WHERE id = '40e37d54-442a-485d-ae23-bf864fcba4b5';
UPDATE profiles SET name = 'Kavya Iyer', location = 'Chennai, Tamil Nadu' WHERE id = 'a72ffeb7-fdc8-42f3-a4fe-87465d2a6154';
UPDATE profiles SET name = 'Aditya Singh', location = 'Jaipur, Rajasthan' WHERE id = 'cf2e953f-3fe3-4a8c-9d42-53f5db8f3158';
UPDATE profiles SET name = 'Meera Kapoor', location = 'Lucknow, Uttar Pradesh' WHERE id = '59169f2e-ddeb-4974-b72a-6ad1bfd88819';
UPDATE profiles SET name = 'Ishaan Verma', location = 'Ahmedabad, Gujarat' WHERE id = '83664b18-4c3a-4083-bd28-289597ac3c84';

-- Update job locations to Indian cities
UPDATE jobs SET location = 'Mumbai, Maharashtra' WHERE id = 'fc2c8f1f-ec77-4cd9-9e84-69adac09f039';
UPDATE jobs SET location = 'Bengaluru, Karnataka' WHERE id = 'a9da88ef-6b78-4098-b2ec-29681a7c4d3b';
UPDATE jobs SET location = 'Hyderabad, Telangana' WHERE id = 'e6daf0e2-bb17-4895-a124-4975f7dec192';
UPDATE jobs SET location = 'Chennai, Tamil Nadu' WHERE id = 'c08a8129-6308-412a-b769-b1e552aa5ddc';
UPDATE jobs SET location = 'Delhi, NCR' WHERE id = 'a6a282e1-1e9a-48af-80b3-395f62625a2e';
UPDATE jobs SET location = 'Pune, Maharashtra' WHERE id = 'ca617203-02cc-4716-8006-73fd540e46f2';

-- Update salary ranges to INR
UPDATE jobs SET salary_range = '₹15L-₹25L' WHERE id = 'fc2c8f1f-ec77-4cd9-9e84-69adac09f039';
UPDATE jobs SET salary_range = '₹12L-₹20L' WHERE id = '5426e2f0-259a-4d39-b5c1-89312af76f34';
UPDATE jobs SET salary_range = '₹10L-₹16L' WHERE id = 'a9da88ef-6b78-4098-b2ec-29681a7c4d3b';
UPDATE jobs SET salary_range = '₹18L-₹28L' WHERE id = 'e6daf0e2-bb17-4895-a124-4975f7dec192';
UPDATE jobs SET salary_range = '₹14L-₹22L' WHERE id = 'c08a8129-6308-412a-b769-b1e552aa5ddc';
UPDATE jobs SET salary_range = '₹12L-₹18L' WHERE id = 'e01fd8be-d876-4c79-ac65-1cfed80e1b12';
UPDATE jobs SET salary_range = '₹16L-₹24L' WHERE id = 'bf3710ed-1ef5-4e19-bd32-3c7e70264e09';
UPDATE jobs SET salary_range = '₹14L-₹20L' WHERE id = 'a6a282e1-1e9a-48af-80b3-395f62625a2e';
UPDATE jobs SET salary_range = '₹20L-₹30L' WHERE id = 'ca617203-02cc-4716-8006-73fd540e46f2';
UPDATE jobs SET salary_range = '₹8L-₹12L' WHERE id = '3db926d5-0cfe-4859-abb1-5804ed17daaf';
