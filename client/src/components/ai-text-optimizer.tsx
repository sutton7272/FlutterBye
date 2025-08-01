import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Lightbulb, 
  Copy, 
  Check, 
  Wand2, 
  MessageSquare,
  ArrowDown
} from "lucide-react";
import { optimizeTextFor27Chars, getOptimizationTips } from "@/lib/text-optimizer";
import { useToast } from "@/hooks/use-toast";

interface AITextOptimizerProps {
  onOptimizedTextSelect: (text: string) => void;
  className?: string;
}

export default function AITextOptimizer({ onOptimizedTextSelect, className }: AITextOptimizerProps) {
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{text: string; technique: string; score: number}>>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleOptimize = () => {
    if (!inputText.trim()) return;
    
    setIsOptimizing(true);
    
    // Simulate AI processing delay for better UX
    setTimeout(() => {
      const optimizedSuggestions = optimizeTextFor27Chars(inputText);
      setSuggestions(optimizedSuggestions);
      setIsOptimizing(false);
    }, 800);
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({
        title: "Copied!",
        description: "Optimized text copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleSelectSuggestion = (text: string) => {
    onOptimizedTextSelect(text);
    toast({
      title: "Applied!",
      description: "Optimized text applied to your message field.",
    });
  };

  const tips = getOptimizationTips();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          AI Text Optimizer
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Convert longer messages into optimized 27-character tokens using smart abbreviations and shorthand.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="optimizer" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="optimizer">Optimize Text</TabsTrigger>
            <TabsTrigger value="tips">Pro Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="optimizer" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter your longer message:</label>
                <Textarea
                  placeholder="Type your message here... (can be any length)"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={3}
                  className="resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{inputText.length} characters</span>
                  {inputText.length > 27 && (
                    <span className="text-orange-500">
                      {inputText.length - 27} characters over limit
                    </span>
                  )}
                </div>
              </div>

              <Button 
                onClick={handleOptimize} 
                disabled={!inputText.trim() || isOptimizing}
                className="w-full"
              >
                {isOptimizing ? (
                  <>
                    <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Optimize for 27 Characters
                  </>
                )}
              </Button>

              {suggestions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ArrowDown className="h-4 w-4 text-primary" />
                    <span className="font-medium">Optimized Suggestions:</span>
                  </div>
                  
                  {suggestions.map((suggestion, index) => (
                    <Card key={index} className="p-4 bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {suggestion.technique}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              {suggestion.text.length}/27 chars
                            </span>
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${Math.min((suggestion.text.length / 27) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-background rounded border font-mono text-sm">
                          {suggestion.text}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(suggestion.text, index)}
                            className="flex-1"
                          >
                            {copiedIndex === index ? (
                              <>
                                <Check className="mr-2 h-3 w-3" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="mr-2 h-3 w-3" />
                                Copy
                              </>
                            )}
                          </Button>
                          
                          <Button
                            size="sm"
                            onClick={() => handleSelectSuggestion(suggestion.text)}
                            className="flex-1"
                          >
                            <MessageSquare className="mr-2 h-3 w-3" />
                            Use This
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Optimization Techniques:</span>
              </div>
              
              <div className="grid gap-3">
                {tips.map((tip, index) => (
                  <Card key={index} className="p-3 bg-muted/50">
                    <p className="text-sm">{tip}</p>
                  </Card>
                ))}
              </div>
              
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Example Optimization:
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="text-red-600 dark:text-red-400">
                      ❌ "I am so excited about this amazing new cryptocurrency project and want to celebrate with everyone!"
                      <span className="text-xs text-muted-foreground ml-2">(98 chars)</span>
                    </div>
                    <div className="text-green-600 dark:text-green-400">
                      ✅ "so hype abt this amzng crypto! 🎉"
                      <span className="text-xs text-muted-foreground ml-2">(27 chars)</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}