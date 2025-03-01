import React, { useState } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Box, 
  CircularProgress as MuiCircularProgress,
  Typography
} from "@mui/material";
import Button from "./Button";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../firebase-config";
import "./style/AIStickerModal.scss";

interface AIStickerModalProps {
  open: boolean;
  onClose: () => void;
  onImageGenerated: (imageUrl: string) => void;
}

const AIStickerModal: React.FC<AIStickerModalProps> = ({ 
  open, 
  onClose,
  onImageGenerated
}) => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const functions = getFunctions(app);

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call Firebase Cloud Function
      const generateAISticker = httpsCallable(functions, 'generateAISticker');
      const result = await generateAISticker({ prompt });
      
      // The result data will contain the base64 image
      const data = result.data as { imageUrl: string };
      
      setGeneratedImage(data.imageUrl);
      onImageGenerated(data.imageUrl);
    } catch (err) {
      console.error("Error generating image:", err);
      setError("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCanvas = () => {
    if (generatedImage) {
      onImageGenerated(generatedImage);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="ai-sticker-modal"
    >
      <DialogTitle className="modal-title">
        <Typography variant="h5">AI Sticker Generator</Typography>
        <Typography variant="subtitle1">Crea un sticker unico con AI</Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box className="modal-content">
          <Box className="image-preview-container">
            {loading ? (
              <Box className="loading-container">
                <MuiCircularProgress />
                <Typography>Generating your sticker...</Typography>
              </Box>
            ) : generatedImage ? (
              <img 
                src={generatedImage} 
                alt="Generated sticker" 
                className="generated-image" 
              />
            ) : (
              <Box className="empty-preview">
                <Typography>Your sticker will appear here</Typography>
              </Box>
            )}
          </Box>
          
          <Box className="prompt-container">
            <TextField
              label="Describe your sticker"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={prompt}
              onChange={handlePromptChange}
              placeholder="Example: A cute cartoon cat with rainbow colors, digital art style"
              disabled={loading}
            />
            {error && (
              <Typography color="error" className="error-message">
                {error}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions className="modal-actions">
        <Button 
          text="Cancel" 
          onClick={onClose} 
          variant="outlined"
        />
        {!generatedImage ? (
          <Button 
            text="Generate Sticker" 
            onClick={() => {
              if (!loading && prompt.trim()) {
                handleGenerateImage();
              }
            }}
          />
        ) : (
          <Button 
            text="Add to Canvas" 
            onClick={handleAddToCanvas}
          />
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AIStickerModal; 