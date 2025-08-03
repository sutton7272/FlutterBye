import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SMSTest() {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <Card className="bg-slate-800/50 border-green-500/20">
        <CardHeader>
          <CardTitle className="text-white">SMS Test Page</CardTitle>
        </CardHeader>
        <CardContent className="text-white">
          <div className="text-lg">This is a simple test page to verify SMS routing works.</div>
          <div className="mt-4 text-sm text-gray-400">
            If you can see this page and it stays loaded, then the basic routing is working.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}