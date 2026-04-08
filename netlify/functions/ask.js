const https = require('https');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET'
};

exports.handler = async function(event) {
  // Always return CORS headers, even on OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: 'Method not allowed'
    };
  }

  try {
    const body = JSON.parse(event.body);
    const question = body.question || '';
    const ctx = body.context || '';

    const payload = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: 'You are a knowledgeable travel nursing assistant for No Ordinary Path, run by Kristin Farnsworth, a travel nurse recruiter at Atlas MedStaff and former travel nurse family. Answer questions in a warm, direct, practical voice. Plain conversational paragraphs only, no bullet points or headers. 3-5 sentences max. Never mention competitor agencies. Context: ' + ctx,
      messages: [{ role: 'user', content: question }]
    });

    const answer = await new Promise((resolve) => {
      const req = https.request(
        {
          hostname: 'api.an
