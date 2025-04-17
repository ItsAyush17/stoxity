
import React, { useState } from "react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Key className="h-4 w-4" />
          <span>Set DeepSeek API Key</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter DeepSeek API Key</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Alert variant="default" className="bg-retro-yellow/30 border-amber-300">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription>
              Your DeepSeek API key is required for live stock analysis. The key is stored locally in your browser and not sent to our servers.
            </AlertDescription>
          </Alert>
          
          <div>
            <Input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
              className="font-mono"
              type="password"
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={!apiKey.trim()}>
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
