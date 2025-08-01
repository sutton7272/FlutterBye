import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, MessageSquare, Link as LinkIcon, Image as ImageIcon, ExternalLink } from "lucide-react";

interface MetadataFormData {
  additionalMessages: string[];
  links: Array<{ url: string; title: string }>;
  gifs: string[];
}

interface EnhancedMetadataFormProps {
  onMetadataChange: (metadata: MetadataFormData) => void;
  initialData?: MetadataFormData;
}

export function EnhancedMetadataForm({ onMetadataChange, initialData }: EnhancedMetadataFormProps) {
  const [additionalMessages, setAdditionalMessages] = useState<string[]>(
    initialData?.additionalMessages || []
  );
  const [links, setLinks] = useState<Array<{ url: string; title: string }>>(
    initialData?.links || []
  );
  const [gifs, setGifs] = useState<string[]>(initialData?.gifs || []);
  
  // Form inputs for new entries
  const [newMessage, setNewMessage] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newGif, setNewGif] = useState("");

  const updateMetadata = () => {
    onMetadataChange({
      additionalMessages,
      links,
      gifs
    });
  };

  const addMessage = () => {
    if (newMessage.trim() && additionalMessages.length < 5) {
      const updated = [...additionalMessages, newMessage.trim()];  
      setAdditionalMessages(updated);
      setNewMessage("");
      onMetadataChange({ additionalMessages: updated, links, gifs });
    }
  };

  const removeMessage = (index: number) => {
    const updated = additionalMessages.filter((_, i) => i !== index);
    setAdditionalMessages(updated);
    onMetadataChange({ additionalMessages: updated, links, gifs });
  };

  const addLink = () => {
    if (newLinkUrl.trim() && newLinkTitle.trim() && links.length < 3) {
      try {
        new URL(newLinkUrl); // Validate URL
        const updated = [...links, { url: newLinkUrl.trim(), title: newLinkTitle.trim() }];
        setLinks(updated);
        setNewLinkUrl("");
        setNewLinkTitle("");
        onMetadataChange({ additionalMessages, links: updated, gifs });
      } catch {
        // Invalid URL - could show error message
      }
    }
  };

  const removeLink = (index: number) => {
    const updated = links.filter((_, i) => i !== index);
    setLinks(updated);
    onMetadataChange({ additionalMessages, links: updated, gifs });
  };

  const addGif = () => {
    if (newGif.trim() && gifs.length < 3) {
      try {
        new URL(newGif); // Validate URL
        const updated = [...gifs, newGif.trim()];
        setGifs(updated);
        setNewGif("");
        onMetadataChange({ additionalMessages, links, gifs: updated });
      } catch {
        // Invalid URL - could show error message
      }
    }
  };

  const removeGif = (index: number) => {
    const updated = gifs.filter((_, i) => i !== index);
    setGifs(updated);
    onMetadataChange({ additionalMessages, links, gifs: updated });
  };

  return (
    <div className="space-y-6">
      
      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <ExternalLink className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Enhanced Solscan Visibility
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                This metadata will be permanently embedded in your token and visible on the Solana blockchain explorer (Solscan).
                Users can click on your token to see additional messages, links, and GIFs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            Additional Messages
            <Badge variant="secondary">{additionalMessages.length}/5</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add extra message content..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              maxLength={140}
              className="flex-1"
            />
            <Button 
              onClick={addMessage}
              disabled={!newMessage.trim() || additionalMessages.length >= 5}
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {additionalMessages.length > 0 && (
            <div className="space-y-2">
              {additionalMessages.map((message, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="flex-1 text-sm">{message}</span>
                  <Button
                    onClick={() => removeMessage(index)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            Add up to 5 additional messages that will appear on Solscan (140 characters each)
          </p>
        </CardContent>
      </Card>

      {/* Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-green-600" />
            Links & Resources
            <Badge variant="secondary">{links.length}/3</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input
              placeholder="https://example.com"
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-2">
              <Input
                placeholder="Link title"
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={addLink}
                disabled={!newLinkUrl.trim() || !newLinkTitle.trim() || links.length >= 3}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {links.length > 0 && (
            <div className="space-y-2">
              {links.map((link, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <LinkIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{link.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                  </div>
                  <Button
                    onClick={() => removeLink(index)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            Add up to 3 clickable links (websites, social media, documentation)
          </p>
        </CardContent>
      </Card>

      {/* GIFs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-pink-600" />
            GIFs & Media
            <Badge variant="secondary">{gifs.length}/3</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://media.giphy.com/media/..."
              value={newGif}
              onChange={(e) => setNewGif(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={addGif}
              disabled={!newGif.trim() || gifs.length >= 3}
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {gifs.length > 0 && (
            <div className="space-y-2">
              {gifs.map((gif, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <ImageIcon className="h-4 w-4 text-pink-600 flex-shrink-0" />
                  <span className="flex-1 text-sm truncate">{gif}</span>
                  <Button
                    onClick={() => removeGif(index)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}  
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            Add up to 3 GIF URLs from Giphy, Tenor, or direct image links
          </p>
        </CardContent>
      </Card>

      {/* Summary */}
      {(additionalMessages.length > 0 || links.length > 0 || gifs.length > 0) && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2">Metadata Summary</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• {additionalMessages.length} additional messages</p>
              <p>• {links.length} external links</p>
              <p>• {gifs.length} GIF media items</p>
            </div>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground">
              This enhanced metadata will be permanently stored on the Solana blockchain and visible on Solscan.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}