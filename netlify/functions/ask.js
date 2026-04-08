exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { question, context: ctx } = JSON.parse(event.body);

    const https = require('https');

    const payload = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: 'You are a knowledgeable travel nursing assistant for No Ordinary Path, run by Kristin Farnsworth, a travel nurse recruiter at Atlas MedStaff and former travel nurse family. Answer questions in a warm, direct, practical voice. Plain conversational paragraphs only, no bullet points or headers. 3-5 sentences max. Never mention competitor agencies. Context: ' + ctx,
      messages: [{ role: 'user', content: question }]
    });

    const answer = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        head
