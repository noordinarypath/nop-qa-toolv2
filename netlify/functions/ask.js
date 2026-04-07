const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { question, context } = JSON.parse(event.body);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: 'You are a knowledgeable travel nursing assistant for No Ordinary Path, run by Kristin Farnsworth, a travel nurse recruiter at Atlas MedStaff and former travel nurse family. Answer questions in a warm, direct, practical voice. Plain conversational paragraphs only, no bullet points or headers. 3-5 sentences max. Never mention competitor agencies. Context: ' + context,
      messages: [{ role: 'user', content: question }]
    })
  });

  const data = await response.json();
  const answer = data.content && data.content[0] && data.content[0].text
    ? data.content[0].text
    : "Check out Kristin's resources below for a detailed answer!";

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answer })
  };
};
