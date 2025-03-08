
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { PlusCircle, Home, History, Search, BookOpen, User, Settings, Lightbulb } from "lucide-react";

const Index = () => {
  const [prompt, setPrompt] = useState('');
  const [promptHistory, setPromptHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const { toast } = useToast();

  // Mock function to generate suggestions based on the prompt
  const generateSuggestions = (input) => {
    // In a real app, this would call an AI API
    const mockSuggestions = [
      `Write a story about ${input}`,
      `Create a tutorial on ${input}`,
      `Design a character based on ${input}`,
      `Develop a business idea around ${input}`,
      `Make a song lyric about ${input}`
    ];
    return mockSuggestions;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Generate new suggestions
    const newSuggestions = generateSuggestions(prompt);
    setSuggestions(newSuggestions);

    // Add to history
    const newPromptItem = {
      id: Date.now(),
      text: prompt,
      createdAt: new Date().toISOString(),
      suggestions: newSuggestions
    };

    setPromptHistory([newPromptItem, ...promptHistory]);
    toast({
      title: "Prompt Created",
      description: "Your prompt has been generated successfully!",
    });

    // Clear the input field
    setPrompt('');
  };

  // Load history from localStorage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem('promptHistory');
    if (savedHistory) {
      setPromptHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
  }, [promptHistory]);

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
                      onClick={() => {
                        navigator.clipboard.writeText(suggestion);
                        toast({
                          title: "Copied to clipboard",
                          description: "The prompt has been copied to your clipboard",
                        });
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prompt history */}
          {promptHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Prompt History
                </CardTitle>
                <CardDescription>
                  Your previously generated prompts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {promptHistory.map((item) => (
                    <div key={item.id} className="border rounded-md p-4 bg-white">
                      <div className="font-medium mb-2">{item.text}</div>
                      <div className="text-sm text-muted-foreground mb-3">
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                      <div className="grid gap-2">
                        {item.suggestions.map((suggestion, idx) => (
                          <div
                            key={idx}
                            className="text-sm p-2 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              navigator.clipboard.writeText(suggestion);
                              toast({
                                title: "Copied to clipboard",
                                description: "The prompt has been copied to your clipboard",
                              });
                            }}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              {promptHistory.length > 5 && (
                <CardFooter>
                  <Button variant="outline" className="w-full">View All History</Button>
                </CardFooter>
              )}
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

// Sidebar component
const AppSidebar = () => {
  const menuItems = [
    { title: "Home", icon: Home, url: "/" },
    { title: "History", icon: History, url: "#history" },
    { title: "Explore", icon: Search, url: "#explore" },
    { title: "Learning", icon: BookOpen, url: "#learning" },
    { title: "Account", icon: User, url: "#account" },
    { title: "Settings", icon: Settings, url: "#settings" },
  ];

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="h-14 flex items-center justify-center p-2 border-b">
        <div className="flex items-center space-x-2">
          <PlusCircle className="h-5 w-5" />
          <span className="font-bold">Prompt Generator</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="text-sm text-muted-foreground">
          Version 1.0.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Index;
