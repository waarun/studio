"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Wand2, RefreshCw, Copy } from 'lucide-react';
import { generateDescriptionAction } from '@/app/server-actions'; // Will create this action

interface AiDescriptionGeneratorProps {
  eventTitle: string;
  eventKeywords?: string;
  currentDescription?: string;
  onDescriptionGenerated: (description: string) => void;
}

export default function AiDescriptionGenerator({
  eventTitle,
  eventKeywords,
  currentDescription,
  onDescriptionGenerated,
}: AiDescriptionGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [aiGeneratedDescription, setAiGeneratedDescription] = useState("");
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!eventTitle) {
      toast({
        title: "Title Required",
        description: "Please enter an event title before generating a description.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateDescriptionAction({ title: eventTitle, keywords: eventKeywords || "" });
      if (result.description) {
        setAiGeneratedDescription(result.description);
        // Do not automatically update the main form field here. User should explicitly use it.
        toast({ title: "AI Description Generated", description: "Review and use the generated description below." });
      } else {
        throw new Error("AI did not return a description.");
      }
    } catch (error) {
      console.error("AI description generation error:", error);
      toast({
        title: "AI Generation Failed",
        description: (error as Error).message || "Could not generate description.",
        variant: "destructive",
      });
      setAiGeneratedDescription(""); // Clear previous if error
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDescription = () => {
    if (aiGeneratedDescription) {
      onDescriptionGenerated(aiGeneratedDescription);
      toast({ title: "Description Applied", description: "AI-generated description has been applied to the form." });
    }
  };
  
  const handleCopyToClipboard = () => {
    if (aiGeneratedDescription) {
      navigator.clipboard.writeText(aiGeneratedDescription);
      toast({ title: "Copied to Clipboard", description: "AI-generated description copied." });
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30 shadow-sm">
      <h3 className="text-lg font-semibold text-primary flex items-center">
        <Wand2 className="mr-2 h-5 w-5" /> AI Event Description Helper
      </h3>
      <p className="text-sm text-muted-foreground">
        Provide a title and optional keywords, then click &quot;Generate with AI&quot;. 
        The AI will create a draft description for your event. You can then edit it or use it as is.
      </p>
      
      <Button
        type="button"
        onClick={handleGenerate}
        disabled={isLoading || !eventTitle}
        variant="outline"
        className="w-full md:w-auto"
      >
        {isLoading ? (
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-4 w-4" />
        )}
        Generate with AI
      </Button>

      {aiGeneratedDescription && (
        <div className="space-y-3 mt-4">
          <Label htmlFor="ai-generated-desc" className="font-medium">AI Generated Suggestion:</Label>
          <Textarea
            id="ai-generated-desc"
            value={aiGeneratedDescription}
            readOnly
            rows={5}
            className="bg-background focus-visible:ring-accent"
          />
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleUseDescription} size="sm" className="bg-accent hover:bg-accent/90">
              Use This Description
            </Button>
             <Button type="button" variant="outline" onClick={handleCopyToClipboard} size="sm">
              <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
            </Button>
          </div>
        </div>
      )}
      {currentDescription && !aiGeneratedDescription && (
         <p className="text-xs text-muted-foreground italic mt-2">
           You can also manually edit the main description field below. If you generate with AI, it will provide a new suggestion here.
         </p>
      )}
    </div>
  );
}
