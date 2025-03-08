
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { History as HistoryIcon, Clock, Search, Trash2 } from "lucide-react";
import { 
  PromptItem, 
  loadPromptHistory, 
  savePromptHistory, 
  copyToClipboard 
} from '@/utils/promptUtils';
import { AppSidebar } from '@/components/AppSidebar';

const History = () => {
  const [promptHistory, setPromptHistory] = useState<PromptItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [filteredHistory, setFilteredHistory] = useState<PromptItem[]>([]);
  const { toast } = useToast();

  // Load prompt history on component mount
  useEffect(() => {
    const history = loadPromptHistory();
    setPromptHistory(history);
  }, []);

  // Apply filters whenever search or time filter changes
  useEffect(() => {
    let results = [...promptHistory];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        prompt => 
          prompt.text.toLowerCase().includes(query) || 
          prompt.suggestions.some(s => s.toLowerCase().includes(query))
      );
    }
    
    // Filter by time
    if (timeFilter !== 'all') {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      results = results.filter(prompt => {
        const promptDate = new Date(prompt.createdAt);
        if (timeFilter === 'today') return promptDate >= oneDayAgo;
        if (timeFilter === 'week') return promptDate >= oneWeekAgo;
        if (timeFilter === 'month') return promptDate >= oneMonthAgo;
        return true;
      });
    }
    
    setFilteredHistory(results);
  }, [searchQuery, timeFilter, promptHistory]);

  // Delete a prompt from history
  const deletePrompt = (id: number) => {
    const updatedHistory = promptHistory.filter(prompt => prompt.id !== id);
    setPromptHistory(updatedHistory);
    savePromptHistory(updatedHistory);
    toast({
      title: "Prompt Deleted",
      description: "The prompt has been removed from your history.",
    });
  };

  // Clear all history
  const clearAllHistory = () => {
    setPromptHistory([]);
    savePromptHistory([]);
    toast({
      title: "History Cleared",
      description: "All prompts have been removed from your history.",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="container mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Prompt History</h1>
            <p className="text-muted-foreground">Review and manage your previously generated prompts</p>
          </header>

          {/* Search and filter section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HistoryIcon className="h-5 w-5" />
                Your Prompt History
              </CardTitle>
              <CardDescription>
                Search through your past prompts or filter by time period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <Input
                    placeholder="Search your prompts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="w-full md:w-64">
                  <Tabs defaultValue="all" onValueChange={(value) => setTimeFilter(value as any)}>
                    <TabsList className="grid grid-cols-4 w-full">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="today">Today</TabsTrigger>
                      <TabsTrigger value="week">Week</TabsTrigger>
                      <TabsTrigger value="month">Month</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
              <Button 
                variant="destructive" 
                onClick={clearAllHistory}
                disabled={promptHistory.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All History
              </Button>
            </CardFooter>
          </Card>

          {/* History items */}
          {filteredHistory.length > 0 ? (
            <div className="grid gap-6">
              {filteredHistory.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{item.text}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deletePrompt(item.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {item.suggestions.map((suggestion, idx) => (
                        <div
                          key={idx}
                          className="text-sm p-2 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100"
                          onClick={() => copyToClipboard(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HistoryIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">No prompt history found</h3>
              <p className="text-muted-foreground">
                {promptHistory.length === 0 
                  ? "You haven't created any prompts yet. Try generating some!" 
                  : "No prompts match your current filters. Try adjusting your search."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default History;
