
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Search, BookOpen } from "lucide-react";
import { 
  PromptItem, 
  PromptCategory, 
  promptCategories, 
  samplePrompts, 
  copyToClipboard 
} from '@/utils/promptUtils';
import { AppSidebar } from '@/components/AppSidebar';

const Explorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | 'all'>('all');
  const [filteredPrompts, setFilteredPrompts] = useState<PromptItem[]>([]);
  const { toast } = useToast();

  // Apply filters whenever search or category changes
  useEffect(() => {
    let results = [...samplePrompts];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        prompt => 
          prompt.text.toLowerCase().includes(query) || 
          prompt.suggestions.some(s => s.toLowerCase().includes(query))
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      results = results.filter(prompt => prompt.category === selectedCategory);
    }
    
    setFilteredPrompts(results);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="container mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Prompt Explorer</h1>
            <p className="text-muted-foreground">Discover and browse through creative prompts</p>
          </header>

          {/* Search and filter section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Prompts
              </CardTitle>
              <CardDescription>
                Find prompts by keyword or browse by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <Input
                    placeholder="Search by keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="w-full md:w-64">
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => setSelectedCategory(value as PromptCategory | 'all')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {promptCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results section */}
          <div className="grid gap-6">
            {filteredPrompts.length > 0 ? (
              filteredPrompts.map((prompt) => (
                <Card key={prompt.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl capitalize">{prompt.text}</CardTitle>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        {promptCategories.find(c => c.value === prompt.category)?.label || 'General'}
                      </span>
                    </div>
                    <CardDescription>
                      {new Date(prompt.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {prompt.suggestions.map((suggestion, index) => (
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
              ))
            ) : (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">No prompts found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or changing the category filter
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Explorer;
