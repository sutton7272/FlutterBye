import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Copy, Download, Share, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRCodeGeneratorProps {
  smsData: string;
  message: string;
  twilioPhone?: string;
}

export function QRCodeGenerator({ smsData, message, twilioPhone }: QRCodeGeneratorProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "SMS link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `flutterbye-sms-qr-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast({
        title: "QR Code Downloaded",
        description: "QR code saved to your downloads",
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Flutterbye SMS Token Creator',
          text: 'Create emotional blockchain tokens via SMS!',
          url: smsData
        });
      } catch (error) {
        copyToClipboard(smsData);
      }
    } else {
      copyToClipboard(smsData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
        >
          <QrCode className="w-4 h-4 mr-2" />
          Share QR
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-slate-900 border-purple-500/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-purple-400" />
            SMS Token Creator QR
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* QR Code Display */}
          <div className="flex justify-center p-6 bg-white rounded-lg">
            <QRCode
              id="qr-code-svg"
              value={smsData}
              size={200}
              bgColor="white"
              fgColor="#000000"
              level="M"
            />
          </div>

          {/* Message Preview */}
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-purple-300">Message Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-300 break-words">
                {message.length > 100 ? `${message.substring(0, 100)}...` : message}
              </div>
              {twilioPhone && (
                <div className="text-xs text-blue-400 mt-2">
                  Send to: {twilioPhone}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(smsData)}
              className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={downloadQR}
              className="border-green-500/30 text-green-300 hover:bg-green-500/10"
            >
              <Download className="w-4 h-4 mr-1" />
              Save
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={shareQR}
              className="border-pink-500/30 text-pink-300 hover:bg-pink-500/10"
            >
              <Share className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-3">
            <div className="text-sm text-blue-300">
              <strong>How to use:</strong>
            </div>
            <div className="text-xs text-blue-400 mt-1">
              1. Scan QR code with your phone
              2. Send the SMS message
              3. Your emotion becomes a blockchain token!
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}