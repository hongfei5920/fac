/*
^https:\/\/api\.textnow\.me\/api2.0\/users\/.* url script-response-body langkhach/Textnow.js
*/var obj = JSON.parse($response.body); 
obj['show_ads'] = false;
obj['premium_calling'] = true;
obj['textnow_credit'] = ‘13’;
obj['account_balance'] = ‘2’;
obj['state'] = 'PREMIUM_SUBSCRIPTION';
$done({body: JSON.stringify(obj)});
