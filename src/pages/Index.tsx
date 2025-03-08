
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Lightbulb } from "lucide-react";
import { 
  PromptItem, 
  generateAdvancedSuggestions, 
  loadPromptHistory, 
  savePromptHistory, 
  copyToClipboard, 
  generatePromptId,
  categorizePrompt
} from '@/utils/promptUtils';
import { AppSidebar } from '@/components/AppSidebar';

const Index = () => {
  const [prompt, setPrompt] = useState('');
  const [promptHistory, setPromptHistory] = useState<PromptItem[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  // Load history from localStorage on initial render
  useEffect(() => {
    const history = loadPromptHistory();
    setPromptHistory(history);
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    savePromptHistory(promptHistory);
  }, [promptHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Generate new suggestions using our advanced generator
    const newSuggestions = generateAdvancedSuggestions(prompt);
    setSuggestions(newSuggestions);

    // Categorize the prompt based on its content
    const category = categorizePrompt(prompt);

    // Add to history
    const newPromptItem: PromptItem = {
      id: generatePromptId(),
      text: prompt,
      createdAt: new Date().toISOString(),
      suggestions: newSuggestions,
      category
    };

    setPromptHistory([newPromptItem, ...promptHistory]);
    toast({
      title: "Prompt Created",
      description: "Your prompt has been generated successfully!",
    });

    // Clear the input field
    setPrompt('');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="container mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Prompt Generator</h1>
            <p className="text-muted-foreground">Generate creative prompts for your AI assistants</p>
          </header>

          {/* Prompt input form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create a New Prompt</CardTitle>
              <CardDescription>Enter a topic or idea to generate prompt suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex gap-3">
                <Input
                  placeholder="E.g., space exploration, cooking recipes, digital art..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">Generate</Button>
              </form>
            </CardContent>
          </Card>

          {/* Suggestions section */}
          {suggestions.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Suggestions
                </CardTitle>
                <CardDescription>
                  Use these prompts or modify them to your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-md bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => copyToClipboard(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Prompts */}
          {promptHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Recent Prompts
                </CardTitle>
                <CardDescription>
                  Your recently generated prompts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {promptHistory.slice(0, 3).map((item) => (
                    <div key={item.id} className="border rounded-md p-4 bg-white">
                      <div className="font-medium mb-2">{item.text}</div>
                      <div className="text-sm text-muted-foreground mb-3">
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                      <div className="grid gap-2">
                        {item.suggestions.slice(0, 2).map((suggestion, idx) => (
                          <div
                            key={idx}
                            className="text-sm p-2 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100"
                            onClick={() => copyToClipboard(suggestion)}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              {promptHistory.length > 3 && (
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/history">View All History</a>
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
