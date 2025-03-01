# AI Sticker Generator Firebase Functions

This directory contains the Firebase Cloud Functions for the AI Sticker Generator feature.

## Setup

1. Install dependencies:
   ```bash
   cd functions
   npm install
   ```

2. Set up environment variables:
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit the `.env` file and add your Together.ai API key:
     ```
     TOGETHER_API_KEY=your_together_api_key_here
     ```

3. Set up Firebase Functions environment variables:
   ```bash
   firebase functions:config:set together.apikey="your_together_api_key_here"
   ```

## Local Development

To run the functions locally:

```bash
npm run serve
```

## Deployment

To deploy the functions to Firebase:

```bash
npm run deploy
```

## Function Details

### generateAISticker

This function generates AI stickers using the Together.ai API with the FLUX.1-schnell-Free model.

**Input Parameters:**
- `prompt`: The text prompt to generate the image

**Response:**
- `imageUrl`: A data URL containing the generated image

## Security

The function requires authentication to be used, ensuring that only authenticated users can generate images.

## Troubleshooting

If you encounter issues with the API key, make sure it's correctly set in both the `.env` file and the Firebase Functions configuration. 