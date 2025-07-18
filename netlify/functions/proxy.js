const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Hanya izinkan metode POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { functionName, args } = JSON.parse(event.body);
  const gasUrl = process.env.GAS_APP_URL;

  if (!gasUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GAS_APP_URL environment variable not set.' }),
    };
  }

  try {
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ functionName, args }),
      redirect: 'follow',
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
