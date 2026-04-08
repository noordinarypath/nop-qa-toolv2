var https = require('https');

exports.handler = function(event, context, callback) {
  var corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return callback(null, { statusCode: 204, headers: corsHeaders, body: '' });
  }

  if (event.httpMethod !== 'POST') {
    return callback(null, { statusCode: 405, headers: corsHeaders, body: 'Method not allowed' });
  }

  var parsed = JSON.parse(event.body);
  var question = parsed.question || '';
  var ctx = parsed.context || '';

  var payload = JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: 'You are a knowledgeable travel nursing assistant for No Ordinary Path, run by Kristin Farnsworth, a travel nurse recruiter at Atlas MedStaff and former travel nurse family. Answer questions in a warm, direct, practical voice. Plain conversational paragraphs only, no bullet points or headers. 3-5 sentences max. Never mention competitor agencies. Context: ' + ctx,
    messages: [{ role: 'user', content: question }]
  });

  var options = {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
