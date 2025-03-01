# Calcomaniacos - Sticker Creator App

## Features

### AI Sticker Generator

The app now includes an AI-powered sticker generator that allows users to create unique stickers using text prompts. This feature uses the FLUX.1-schnell-Free model from Together.ai to generate high-quality images based on user descriptions.

#### How to Use

1. Navigate to the "Make Collection" page
2. Click on the "Generar con IA" button or use the "AI Sticker" tab in the bottom navigation
3. Enter a descriptive prompt for your sticker
4. Click "Generate Sticker" to create your custom sticker
5. Once generated, click "Add to Canvas" to add it to your collection

#### Technical Implementation

The AI Sticker Generator feature consists of:

- A React modal component for the user interface
- A Firebase Cloud Function that securely calls the Together.ai API
- Integration with the existing Canvas component for adding generated stickers

#### Setup Instructions

To set up the AI Sticker Generator feature:

1. Set up Firebase Cloud Functions:
   ```bash
   cd functions
   ./setup.sh
   ```

2. Update the `.env` file in the `functions` directory with your Together.ai API key:
   ```
   TOGETHER_API_KEY=your_together_api_key_here
   ```

3. Set up Firebase Functions environment variables:
   ```bash
   firebase functions:config:set together.apikey="your_together_api_key_here"
   ```

4. Deploy the Firebase Functions:
   ```bash
   cd functions
   npm run deploy
   ```

## Development

### Local Development

To run the app locally:

```bash
npm install
npm start
```

To run the Firebase Functions locally:

```bash
cd functions
npm run serve
```

### Deployment

To deploy the app to Firebase Hosting:

```bash
npm run build
firebase deploy --only hosting
```

To deploy the Firebase Functions:

```bash
cd functions
npm run deploy
```
