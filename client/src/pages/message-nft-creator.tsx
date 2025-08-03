import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { QrCode, Sparkles, Image as ImageIcon, Zap, Copy, Share2, Eye, Hash, Mic, Play, Pause, Square } from "lucide-react";

interface MessageNFTCollection {
  id: string;
  message: string;
  image?: string;
  imageFile?: string;
  voiceFile?: string;
  creator: string;
  totalSupply: number;
  currentSupply: number;
  valuePerNFT: number;
  currency: string;
  qrCode: string;
  collectionName: string;
  description: string;
  attributes: Record<string, string | number>;
  createdAt: string;
}

interface MessageNFT {
  id: string;
  collectionId: string;
  tokenNumber: number;
  owner: string;
  claimed: boolean;
  valueAttached: number;
  currency: string;
  qrClaimCode: string;
}

export default function MessageNFTCreator() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    message: "",
    image: "",
    imageFile: "", // Base64 encoded custom image
    voiceFile: "", // Base64 encoded voice attachment
    creator: "demo-creator", // TODO: Get from wallet connection
    totalSupply: 10,
    valuePerNFT: 0.01,
    currency: "SOL" as "SOL" | "USDC" | "FLBY",
    collectionName: "",
    description: "",
    burnToRedeem: false, // Enable burn-to-redeem mechanism
    customAttributes: {}
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [voicePreview, setVoicePreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [createdCollection, setCreatedCollection] = useState<{
    collection: MessageNFTCollection;
    nfts: MessageNFT[];
    claimUrl: string;
  } | null>(null);

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("/api/message-nfts/create", "POST", data);
    },
    onSuccess: (result) => {
      setCreatedCollection(result);
      toast({
        title: "Message NFT Collection Created!",
        description: `Successfully created ${result.collection.totalSupply} limited edition NFTs`,
        variant: "default"
      });
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create Message NFT collection",
        variant: "destructive"
      });
    }
  });

  const { data: collections, isLoading: collectionsLoading } = useQuery({
    queryKey: ["/api/message-nfts/browse"],
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message for your NFT collection",
        variant: "destructive"
      });
      return;
    }

    if (formData.totalSupply < 1 || formData.totalSupply > 10000) {
      toast({
        title: "Invalid Supply",
        description: "Total supply must be between 1 and 10,000",
        variant: "destructive"
      });
      return;
    }

    createMutation.mutate(formData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (PNG, JPG, GIF, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setFormData(prev => ({ ...prev, imageFile: base64String }));
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageFile: "" }));
    setImagePreview(null);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64String = event.target?.result as string;
          setFormData(prev => ({ ...prev, voiceFile: base64String }));
          setVoicePreview(base64String);
        };
        reader.readAsDataURL(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      setAudioChunks([]);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Recording Failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const playVoice = () => {
    if (voicePreview) {
      const audio = new Audio(voicePreview);
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
      audio.play();
    }
  };

  const removeVoice = () => {
    setFormData(prev => ({ ...prev, voiceFile: "" }));
    setVoicePreview(null);
    setIsPlaying(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
      variant: "default"
    });
  };

  const shareCollection = () => {
    if (createdCollection && navigator.share) {
      navigator.share({
        title: createdCollection.collection.collectionName,
        text: createdCollection.collection.description,
        url: createdCollection.claimUrl
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-blue-400" />
            FlutterArt Creator
            <Hash className="h-8 w-8 text-green-400" />
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Transform your messages into limited edition NFTs with attached value, QR codes, and blockchain ownership
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Creation Form */}
          <Card className="bg-slate-800/80 border-blue-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Create Collection
              </CardTitle>
              <CardDescription className="text-slate-300">
                Design your limited edition Message NFT collection
|| </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Message Input */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white">Message Content</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your message that will be minted as NFTs..."
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                  />
                  <p className="text-sm text-slate-400">
                    {formData.message.length} characters
                  </p>
                </div>

                {/* Collection Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="collectionName" className="text-white">Collection Name</Label>
                    <Input
                      id="collectionName"
                      placeholder="My Message Collection"
                      value={formData.collectionName}
                      onChange={(e) => setFormData(prev => ({ ...prev, collectionName: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="totalSupply" className="text-white">Total Supply</Label>
                    <Input
                      id="totalSupply"
                      type="number"
                      min="1"
                      max="10000"
                      value={formData.totalSupply}
                      onChange={(e) => setFormData(prev => ({ ...prev, totalSupply: parseInt(e.target.value) }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                {/* Value and Currency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valuePerNFT" className="text-white">Value per NFT</Label>
                    <Input
                      id="valuePerNFT"
                      type="number"
                      step="0.001"
                      min="0"
                      value={formData.valuePerNFT}
                      onChange={(e) => setFormData(prev => ({ ...prev, valuePerNFT: parseFloat(e.target.value) }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-white">Currency</Label>
                    <Select 
                      value={formData.currency} 
                      onValueChange={(value: "SOL" | "USDC" | "FLBY") => 
                        setFormData(prev => ({ ...prev, currency: value }))
                      }
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SOL">SOL</SelectItem>
                        <SelectItem value="USDC">USDC</SelectItem>
                        <SelectItem value="FLBY">FLBY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Burn-to-Redeem Option */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="burnToRedeem"
                      checked={formData.burnToRedeem}
                      onChange={(e) => setFormData(prev => ({ ...prev, burnToRedeem: e.target.checked }))}
                      className="w-4 h-4 text-orange-600 bg-slate-700 border-slate-600 rounded focus:ring-orange-500"
                    />
                    <Label htmlFor="burnToRedeem" className="text-white flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-400" />
                      Enable Burn-to-Redeem (Creates Scarcity)
                    </Label>
                  </div>
                  <p className="text-sm text-slate-400 ml-6">
                    Allows NFT holders to burn their NFT to redeem the attached {formData.currency} value. 
                    This permanently reduces supply and creates scarcity for remaining NFTs.
                  </p>
                </div>

                {/* Custom Image Upload */}
                <div className="space-y-2">
                  <Label className="text-white flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Custom Image (Optional)
                  </Label>
                  {!imagePreview ? (
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                      <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-300 mb-2">Upload a custom image for your NFT collection</p>
                      <p className="text-sm text-slate-400 mb-4">PNG, JPG, GIF up to 5MB</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Choose Image
                      </Button>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="NFT Preview"
                        className="w-full max-h-64 object-cover rounded-lg border border-slate-600"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        className="absolute top-2 right-2"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                  
                  {/* URL Alternative */}
                  <div className="mt-4">
                    <Label htmlFor="image" className="text-white text-sm">Or enter image URL:</Label>
                    <Input
                      id="image"
                      placeholder="https://example.com/image.png"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                    />
                  </div>
                </div>

                {/* Voice Attachment */}
                <div className="space-y-2">
                  <Label className="text-white flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    Voice Message (Optional)
                  </Label>
                  
                  {!voicePreview ? (
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                      <Mic className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-300 mb-2">Record a voice message for your NFT collection</p>
                      <p className="text-sm text-slate-400 mb-4">Add emotional depth with your voice</p>
                      
                      <Button
                        type="button"
                        variant={isRecording ? "destructive" : "outline"}
                        onClick={isRecording ? stopRecording : startRecording}
                        className={isRecording 
                          ? "border-red-500 text-red-300 bg-red-500/20" 
                          : "border-green-500/50 text-green-300 hover:bg-green-500/20"
                        }
                      >
                        {isRecording ? (
                          <>
                            <Square className="w-4 h-4 mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4 mr-2" />
                            Start Recording
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="border border-slate-600 rounded-lg p-4 bg-slate-700/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                            <Mic className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Voice Message</p>
                            <p className="text-slate-400 text-sm">Ready to attach to NFT</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={playVoice}
                            disabled={isPlaying}
                            className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeVoice}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="AI will generate one if left empty..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-3"
                >
                  {createMutation.isPending ? "Creating NFTs..." : `Create ${formData.totalSupply} NFTs`}
                </Button>

                {/* Estimated Total Value */}
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-slate-300">
                    Total Collection Value: <span className="text-green-400 font-bold">
                      {(formData.totalSupply * formData.valuePerNFT).toFixed(3)} {formData.currency}
                    </span>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Success Display */}
          {createdCollection && (
            <Card className="bg-gradient-to-br from-green-900/50 to-blue-900/50 border-green-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-400" />
                  Collection Created Successfully!
                </CardTitle>
                <CardDescription className="text-green-200">
                  Your Message NFT collection is ready to be claimed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Collection Info */}
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/60 rounded-lg">
                    <h3 className="text-white font-medium mb-2">{createdCollection.collection.collectionName}</h3>
                    <p className="text-slate-300 text-sm mb-3">{createdCollection.collection.message}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{createdCollection.collection.totalSupply} NFTs</Badge>
                      <Badge variant="secondary">{createdCollection.collection.valuePerNFT} {createdCollection.collection.currency}</Badge>
                      <Badge variant="secondary">ID: {createdCollection.collection.id.slice(0, 8)}...</Badge>
                    </div>
                  </div>

                  {/* QR Code Display */}
                  <div className="text-center">
                    <h4 className="text-white font-medium mb-3 flex items-center justify-center gap-2">
                      <QrCode className="h-4 w-4" />
                      Claim QR Code
                    </h4>
                    <div className="inline-block p-4 bg-white rounded-lg">
                      <img 
                        src={createdCollection.collection.qrCode} 
                        alt="Claim QR Code"
                        className="w-48 h-48 mx-auto"
                      />
                    </div>
                    <p className="text-slate-400 text-sm mt-2">
                      Scan to claim NFTs from this collection
                    </p>
                  </div>

                  {/* Voice Message Display */}
                  {createdCollection.collection.voiceFile && (
                    <div className="border border-slate-600 rounded-lg p-4 bg-slate-700/30">
                      <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                        <Mic className="h-4 w-4 text-green-400" />
                        Attached Voice Message
                      </h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                            <Mic className="w-4 h-4 text-green-400" />
                          </div>
                          <p className="text-slate-300 text-sm">Voice attachment included in NFT</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const audio = new Audio(createdCollection.collection.voiceFile);
                            audio.play();
                          }}
                          className="border-green-500/50 text-green-300 hover:bg-green-500/20"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button 
                      onClick={() => copyToClipboard(createdCollection.claimUrl, "Claim URL")}
                      variant="outline"
                      className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy URL
                    </Button>
                    
                    <Button 
                      onClick={shareCollection}
                      variant="outline"
                      className="border-green-500/50 text-green-300 hover:bg-green-500/20"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  {/* Collection Stats */}
                  <Separator className="bg-slate-600" />
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-400">{createdCollection.collection.currentSupply}</p>
                      <p className="text-slate-400 text-sm">Claimed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-400">{createdCollection.collection.totalSupply - createdCollection.collection.currentSupply}</p>
                      <p className="text-slate-400 text-sm">Available</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-400">{createdCollection.collection.totalSupply}</p>
                      <p className="text-slate-400 text-sm">Total</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Collections */}
          {!createdCollection && collections && (
            <Card className="bg-slate-800/80 border-slate-600/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-400" />
                  Recent Collections
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Latest Message NFT collections on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {collectionsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-slate-700/50 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {collections.collections?.slice(0, 5).map((collection: MessageNFTCollection) => (
                      <div key={collection.id} className="p-3 bg-slate-700/50 rounded-lg">
                        <h4 className="text-white font-medium truncate">{collection.collectionName}</h4>
                        <p className="text-slate-300 text-sm truncate">{collection.message}</p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="text-xs">{collection.totalSupply} NFTs</Badge>
                            <Badge variant="secondary" className="text-xs">{collection.valuePerNFT} {collection.currency}</Badge>
                          </div>
                          <p className="text-slate-400 text-xs">
                            {collection.currentSupply}/{collection.totalSupply} claimed
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}