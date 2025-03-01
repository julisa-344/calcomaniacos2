import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

// Initialize Firebase Admin
admin.initializeApp();

// Configure CORS middleware

/**
 * Cloud Function to generate AI stickers using Together.ai API
 * 
 * This function takes a prompt and sends it to the Together.ai API
 * to generate an image using the FLUX.1-schnell-Free model.
 */
export const generateAISticker = functions.https.onCall(async (data: { prompt: string }, context: functions.https.CallableContext) => {
  try {
    // Ensure the user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.'
      );
    }

    // Get the prompt from the request data
    const { prompt } = data;
    if (!prompt || typeof prompt !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with a valid prompt.'
      );
    }

    // Get the API key from environment variables or Firebase config
    const apiKey = process.env.TOGETHER_API_KEY || functions.config().together?.apikey;
    if (!apiKey) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The Together API key is not configured.'
      );
    }

    // Make the request to Together.ai API
    const response = await axios.post(
      'https://api.together.xyz/v1/images/generations',
      {
        model: 'black-forest-labs/FLUX.1-schnell-Free',
        prompt: prompt,
        width: 1024,
        height: 768,
        steps: 1,
        n: 1,
        response_format: 'b64_json'
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract the base64 image data from the response
    const imageData = response.data.data[0].b64_json;
    
    // Create a data URL from the base64 data
    const imageUrl = `data:image/png;base64,${imageData}`;

    // Return the image URL
    return { imageUrl };
  } catch (error) {
    console.error('Error generating AI sticker:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while generating the AI sticker.'
    );
  }
}); 