import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Zap, Coins, Activity, Cpu, Radio, Battery } from "lucide-react";

export default function ElectricDemo() {
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-gradient">
            Electric Circuit Theme
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the electric blue and green theme with animated pulse effects running through frames and components.
          </p>
        </div>

        {/* Electric Frame Examples */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gradient">Electric Frames</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <Card className="electric-frame">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 modern-gradient rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle>Electric Pulse Frame</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This frame pulses between electric blue and green with animated border effects.
                </p>
              </CardContent>
            </Card>

            <Card className="pulse-border premium-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 modern-gradient rounded-lg flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle>Pulse Border Card</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Border color cycles through blue, teal, and green with internal glow effects.
                </p>
              </CardContent>
            </Card>

            <Card className="circuit-glow premium-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 modern-gradient rounded-lg flex items-center justify-center">
                    <Cpu className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle>Circuit Glow Effect</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Hover over this card to see the circuit glow change from blue to green.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Interactive Components */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gradient">Interactive Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Electric Buttons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="modern-gradient w-full" size="lg">
                  <Zap className="mr-2 h-4 w-4" />
                  Electric Primary Button
                </Button>
                
                <Button variant="outline" className="pulse-border w-full" size="lg">
                  <Radio className="mr-2 h-4 w-4" />
                  Pulse Border Button
                </Button>
                
                <Button variant="ghost" className="circuit-glow w-full" size="lg">
                  <Battery className="mr-2 h-4 w-4" />
                  Circuit Glow Button
                </Button>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Electric Inputs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Electric Blue Input</label>
                  <Input 
                    placeholder="Type something electric..." 
                    className="pulse-border"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Circuit Glow Input</label>
                  <Input 
                    placeholder="Feel the current flow..." 
                    className="circuit-glow"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Badge className="modern-gradient">Electric</Badge>
                  <Badge variant="outline" className="pulse-border">Pulse</Badge>
                  <Badge variant="secondary" className="circuit-glow">Circuit</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Token Cards with Electric Effects */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gradient">Electric Token Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { message: "gm crypto fam", value: "0.05 SOL", type: "electric-frame" },
              { message: "to the moon", value: "0.1 SOL", type: "pulse-border premium-card" },
              { message: "hodl strong", value: "0.15 SOL", type: "circuit-glow premium-card" },
              { message: "wen lambo ser", value: "0.08 SOL", type: "electric-frame" },
              { message: "diamond hands", value: "0.12 SOL", type: "pulse-border premium-card" },
              { message: "probably nothing", value: "0.03 SOL", type: "circuit-glow premium-card" },
            ].map((token, index) => (
              <Card key={index} className={`${token.type} token-card cursor-pointer`}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className="modern-gradient">FLBY-MSG</Badge>
                      <div className="text-sm text-accent font-semibold">{token.value}</div>
                    </div>
                    
                    <div className="text-lg font-mono font-semibold text-center py-4">
                      "{token.message}"
                    </div>
                    
                    <Button size="sm" variant="ghost" className="w-full circuit-glow">
                      <Coins className="mr-2 h-4 w-4" />
                      View Token
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Circuit Pattern Background Demo */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gradient">Circuit Background Effects</h2>
          
          <div className="electric-frame p-8 text-center space-y-4" style={{minHeight: '300px'}}>
            <div className="text-4xl font-bold text-gradient">
              Circuit Flow Animation
            </div>
            <p className="text-muted-foreground max-w-md mx-auto">
              This entire frame has electric pulses running through it, with a circuit pattern background that flows and changes colors.
            </p>
            <Button className="modern-gradient" size="lg">
              <Activity className="mr-2 h-5 w-5" />
              Feel the Current
            </Button>
          </div>
        </section>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/">
            <Button variant="outline" className="pulse-border" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}