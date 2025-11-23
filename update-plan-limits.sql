-- Update plan limits and credits
-- Run this in Supabase SQL Editor

-- Builder plan: 500 credits, 1 influencer, can generate images only
UPDATE users 
SET 
  credits = 500,
  influencer_trainings = 1
WHERE subscription_plan = 'builder' 
  AND subscription_status = 'active';

-- Launch plan: 2000 credits, 2 influencers, can generate images and videos  
UPDATE users 
SET 
  credits = 2000,
  influencer_trainings = 2
WHERE subscription_plan = 'launch' 
  AND subscription_status = 'active';

-- Growth plan: unlimited credits (NULL), unlimited influencers (NULL), images and videos
UPDATE users 
SET 
  credits = NULL,
  influencer_trainings = NULL
WHERE subscription_plan = 'growth' 
  AND subscription_status = 'active';

-- Verify the changes
SELECT 
  subscription_plan,
  COUNT(*) as user_count,
  MIN(credits) as min_credits,
  MAX(credits) as max_credits,
  MIN(influencer_trainings) as min_influencers,
  MAX(influencer_trainings) as max_influencers
FROM users
WHERE subscription_status = 'active'
GROUP BY subscription_plan
ORDER BY subscription_plan;

