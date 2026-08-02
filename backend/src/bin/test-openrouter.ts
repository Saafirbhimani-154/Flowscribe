import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

async function testOpenRouter() {
  const keysRaw = process.env.LLM_API_KEYS || process.env.LLM_API_KEY || '';
  const apiKeys = keysRaw.split(',').map(k => k.trim()).filter(k => k.length > 0);

  if (apiKeys.length === 0) {
    console.error('❌ No API keys found in .env.local (Checked LLM_API_KEYS and LLM_API_KEY)');
    process.exit(1);
  }

  console.log(`🔍 Found ${apiKeys.length} API key(s) to test.`);

  for (let i = 0; i < apiKeys.length; i++) {
    const key = apiKeys[i] || '';
    console.log(`\n======================================`);
    console.log(`🧪 Testing Key #${i + 1} (${key.substring(0, 10)}...)`);
    console.log(`======================================`);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'HTTP-Referer': 'http://localhost:7000',
          'X-Title': 'Flowscribe Diagnostic'
        },
        body: JSON.stringify({
          model: process.env.LLM_MODEL || 'google/gemini-pro-vision',
          messages: [{ role: 'user', content: 'Say "hello world" and nothing else.' }]
        })
      });

      const text = await response.text();
      
      console.log(`\n📡 HTTP Status Code: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        console.log(`✅ Success! Response body:`);
        console.log(text);
      } else {
        console.log(`❌ FAILED! OpenRouter rejected the request.`);
        console.log(`📝 Raw Error Body from OpenRouter:`);
        console.log(text);
        
        if (response.status === 401) console.log(`\n💡 DIAGNOSIS: 401 Unauthorized. Your API key is invalid, revoked, or copied incorrectly.`);
        if (response.status === 402) console.log(`\n💡 DIAGNOSIS: 402 Payment Required. Your OpenRouter account is out of credits. You need to top up!`);
        if (response.status === 429) console.log(`\n💡 DIAGNOSIS: 429 Too Many Requests. You are being rate-limited. If you are on a free tier, you might have exhausted your requests per minute/day.`);
      }
    } catch (error: any) {
      console.error(`💥 Network Error: Could not connect to OpenRouter.`, error.message);
    }
  }
}

testOpenRouter();
