// Instagram Configuration for Reel Fetching

// Option 1: Using Post URLs (Easiest - No API key needed)
export const instagramPostUrls = [
  'https://www.instagram.com/p/DP_pn7Kj5Mh/',
  'https://www.instagram.com/p/DP6yhayj3fB/',
  'https://www.instagram.com/p/DPY0dB4D5Du/',
];

// Option 2: Using Instagram Graph API (For production)
export const instagramConfig = {
  accessToken: 'YOUR_INSTAGRAM_ACCESS_TOKEN', // Get from Meta Developer Dashboard
  instagramBusinessAccountId: 'YOUR_BUSINESS_ACCOUNT_ID',
  username: 'aansh.ig'
};

