

const axios = require('axios');

const AI_SERVICE_URL = 'http://localhost:5001/api/ai'; 

/**
 * @desc   
 * @route   
 * @access  
 */
const getCostPrediction = async (req, res) => {
    const { destination, startDate, endDate } = req.body;

    if (!destination || !startDate || !endDate) {
        return res.status(400).json({ message: 'Missing destination or dates for prediction.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const duration_days = timeDiff === 0 ? 1 : Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    
    console.log(`Predicting cost for ${destination} for ${duration_days} days.`);

    try {
        const aiResponse = await axios.post(`${AI_SERVICE_URL}/predict_cost`, {
            destination,
            duration_days
        });

        res.json(aiResponse.data);

    } catch (error) {
        console.error('Error calling AI Cost Service:', error.message);
        res.status(503).json({ message: 'AI Cost Service unavailable or failed prediction.' });
    }
};


const getRecommendations = async (req, res) => {
    const { destination, interests, tripType } = req.body;

    const interestsString = Array.isArray(interests) ? interests.join(', ') : interests || '';
    const query = `${destination} ${interestsString} ${tripType} trip activities.`;

    try {
        // 1. Make a POST request to the Python AI service
        const aiResponse = await axios.post(`${AI_SERVICE_URL}/recommend`, {
            preferences: query
        });

        // 2. Return the recommendations
        res.json(aiResponse.data);

    } catch (error) {
        console.error('Error calling AI Service:', error.message);
        
        // Detailed error for debugging
        if (error.response) {
            console.error('AI Service Response Data:', error.response.data);
            return res.status(502).json({ 
                message: 'AI Service error: Could not get recommendations.',
                details: error.response.data.message || 'Check AI server log.'
            });
        }
        
        res.status(503).json({ message: 'AI Service unavailable. Ensure Python server is running on port 5001.' });
    }
};

module.exports = {
    getRecommendations,
    getCostPrediction 
};