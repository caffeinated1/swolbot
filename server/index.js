const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Define your OpenAI API key
const OPENAI_API_KEY = 'OPENAI_API_KEY';

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Endpoint to handle chat messages
app.post('/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/engines/gpt-4/completions',
            {
                prompt: message,
                max_tokens: 150,
                temperature: 0.7,
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,  // Use the OPENAI_API_KEY variable here
                    'Content-Type': 'application/json',
                },
            }
        );
        res.json({ reply: response.data.choices[0].text });
    } catch (error) {
        console.error("Error from OpenAI:", error.response?.data || error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
