import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Calendar, Filter, X, Search } from 'lucide-react';

interface AdvancedFiltersProps {
  onFiltersChange: (filters: any) => void;
  onClose: () => void;
}

export function AdvancedFilters({ onFiltersChange, onClose }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState({
    emotion: '',
    dateRange: 'all',
    valueRange: [0, 100],
    viralScore: [0, 100],
    searchQuery: ''
  });

  const emotions = [
    'Gratitude', 'Love', 'Joy', 'Hope', 'Excitement', 'Pride', 
    'Inspiration', 'Compassion', 'Determination', 'Serenity'
  ];

  const applyFilters = () => {
    onFiltersChange(filters);
    onClose();
  };

  const clearFilters = () => {
    const clearedFilters = {
      emotion: '',
      dateRange: 'all',
      valueRange: [0, 100],
      viralScore: [0, 100],
      searchQuery: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <Card className="bg-black/90 backdrop-blur-sm border-purple-500/30 max-w-md w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="h-5 w-5 text-purple-400" />
            Advanced Filters
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label className="text-white">Search Messages</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by content..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Emotion Filter */}
        <div className="space-y-2">
          <Label className="text-white">Filter by Emotion</Label>
          <Select value={filters.emotion} onValueChange={(value) => setFilters({ ...filters, emotion: value })}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="All emotions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All emotions</SelectItem>
              {emotions.map((emotion) => (
                <SelectItem key={emotion} value={emotion.toLowerCase()}>
                  {emotion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label className="text-white">Time Period</Label>
          <Select value={filters.dateRange} onValueChange={(value) => setFilters({ ...filters, dateRange: value })}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="quarter">This quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Value Range */}
        <div className="space-y-3">
          <Label className="text-white">Value Range (SOL)</Label>
          <div className="px-2">
            <Slider
              value={filters.valueRange}
              onValueChange={(value) => setFilters({ ...filters, valueRange: value })}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>{filters.valueRange[0]} SOL</span>
              <span>{filters.valueRange[1]} SOL</span>
            </div>
          </div>
        </div>

        {/* Viral Score */}
        <div className="space-y-3">
          <Label className="text-white">Viral Impact Score</Label>
          <div className="px-2">
            <Slider
              value={filters.viralScore}
              onValueChange={(value) => setFilters({ ...filters, viralScore: value })}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>{filters.viralScore[0]}%</span>
              <span>{filters.viralScore[1]}%</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button onClick={applyFilters} className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={clearFilters} className="border-white/20 text-white hover:bg-white/10">
            Clear All
          </Button>
        </div>

        {/* Active Filters */}
        {(filters.emotion || filters.dateRange !== 'all' || filters.searchQuery) && (
          <div className="space-y-2 pt-4 border-t border-white/10">
            <Label className="text-white">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.emotion && (
                <Badge className="bg-purple-600/20 text-purple-200">
                  Emotion: {filters.emotion}
                </Badge>
              )}
              {filters.dateRange !== 'all' && (
                <Badge className="bg-blue-600/20 text-blue-200">
                  Time: {filters.dateRange}
                </Badge>
              )}
              {filters.searchQuery && (
                <Badge className="bg-green-600/20 text-green-200">
                  Search: "{filters.searchQuery.substring(0, 20)}..."
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}