
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Key } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState("");
  const [open, setOpen] = useState(false);
  const [hasStoredKey, setHasStoredKey] = useState(false);

  useEffect(() => {
    // Check if there's already a stored key
    const storedKey = localStorage.getItem("gemini_api_key");
    if (storedKey) {
      setHasStoredKey(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
      setOpen(false);
    }
  };

  const handleResetKey = () => {
    localStorage.removeItem("gemini_api_key");
    setHasStoredKey(false);
    setApiKey("");
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Key className="h-4 w-4" />
          <span>{hasStoredKey ? "API Key Saved" : "Set API Key"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Google Gemini API Key</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Alert variant="default" className="bg-retro-yellow/30 border-amber-300">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription>
              Your Gemini API key is required for stock analysis. We store it locally in your browser only.
            </AlertDescription>
          </Alert>
          
          <div>
            <Input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key here..."
              className="font-mono"
              type="password"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            {hasStoredKey && (
              <Button type="button" variant="outline" onClick={handleResetKey}>
                Reset Key
              </Button>
            )}
            <Button type="submit" disabled={!apiKey.trim()}>
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
