"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAISticker = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios_1 = require("axios");
// Initialize Firebase Admin
admin.initializeApp();
// Configure CORS middleware
/**
 * Cloud Function to generate AI stickers using Together.ai API
 *
 * This function takes a prompt and sends it to the Together.ai API
 * to generate an image using the FLUX.1-schnell-Free model.
 */
exports.generateAISticker = functions.https.onCall(async (data, context) => {
    var _a;
    try {
        // Ensure the user is authenticated
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
        }
        // Get the prompt from the request data
        const { prompt } = data;
        if (!prompt || typeof prompt !== 'string') {
            throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid prompt.');
        }
        // Get the API key from environment variables or Firebase config
        const apiKey = process.env.TOGETHER_API_KEY || ((_a = functions.config().together) === null || _a === void 0 ? void 0 : _a.apikey);
        if (!apiKey) {
            throw new functions.https.HttpsError('failed-precondition', 'The Together API key is not configured.');
        }
        // Make the request to Together.ai API
        const response = await axios_1.default.post('https://api.together.xyz/v1/images/generations', {
            model: 'black-forest-labs/FLUX.1-schnell-Free',
            prompt: prompt,
            width: 1024,
            height: 768,
            steps: 1,
            n: 1,
            response_format: 'b64_json'
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        // Extract the base64 image data from the response
        const imageData = response.data.data[0].b64_json;
        // Create a data URL from the base64 data
        const imageUrl = `data:image/png;base64,${imageData}`;
        // Return the image URL
        return { imageUrl };
    }
    catch (error) {
        console.error('Error generating AI sticker:', error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'An error occurred while generating the AI sticker.');
    }
});
//# sourceMappingURL=index.js.map