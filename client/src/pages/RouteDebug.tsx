import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RouteDebug() {
  const [location] = useLocation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-slate-800/50 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white">Route Debug Info</CardTitle>
          </CardHeader>
          <CardContent className="text-white space-y-4">
            <div>
              <strong>Current Location:</strong> {location}
            </div>
            <div>
              <strong>Window Location:</strong> {window.location.pathname}
            </div>
            <div>
              <strong>Hash:</strong> {window.location.hash}
            </div>
            <div>
              <strong>Search:</strong> {window.location.search}
            </div>
            <div>
              <strong>Full URL:</strong> {window.location.href}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}