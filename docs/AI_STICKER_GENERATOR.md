# AI Sticker Generator

## Overview

The AI Sticker Generator is a feature that allows users to create custom stickers using artificial intelligence. It uses the FLUX.1-schnell-Free model from Together.ai to generate images based on text prompts.

## User Flow

1. User navigates to the "Make Collection" page
2. User clicks on the "Generar con IA" button or the "AI Sticker" tab in the bottom navigation
3. A modal appears with a text input field and a preview area
4. User enters a descriptive prompt for the sticker they want to create
5. User clicks "Generate Sticker" to create the sticker
6. The AI generates an image based on the prompt
7. User clicks "Add to Canvas" to add the generated sticker to their collection

## Technical Implementation

### Frontend Components

- **AIStickerModal.tsx**: The main modal component that handles user input and displays the generated image
- **AIStickerModal.scss**: Styles for the modal component

### Backend Functions

- **generateAISticker**: A Firebase Cloud Function that securely calls the Together.ai API

### API Integration

The feature integrates with the Together.ai API using the following endpoint:

```
https://api.together.xyz/v1/images/generations
```

Parameters:
- `model`: "black-forest-labs/FLUX.1-schnell-Free"
- `prompt`: User-provided text prompt
- `width`: 1024
- `height`: 768
- `steps`: 1
- `n`: 1
- `response_format`: "b64_json"

## Security Considerations

- The API key is stored securely in Firebase Functions environment variables
- The Cloud Function requires user authentication
- All API calls are made server-side to protect the API key

## Future Improvements

- Add more AI models for different artistic styles
- Allow users to adjust image parameters (size, style, etc.)
- Implement image editing capabilities after generation
- Add a gallery of previously generated stickers
- Implement a caching mechanism to avoid regenerating similar images 