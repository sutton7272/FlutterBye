import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Edit, ExternalLink, ToggleLeft, ToggleRight, Image } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Partnership {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  logoUrl: string;
  isActive: boolean;
  displayOrder: number;
  partnershipType: string;
  clickCount: number;
  lastClickedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface PartnershipFormData {
  name: string;
  description: string;
  websiteUrl: string;
  logoUrl: string;
  partnershipType: string;
}

export function PartnershipManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PartnershipFormData>({
    name: "",
    description: "",
    websiteUrl: "",
    logoUrl: "",
    partnershipType: "strategic"
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch partnerships
  const { data: partnershipsResponse, isLoading } = useQuery({
    queryKey: ["/api/partnerships"],
  });

  const partnerships = partnershipsResponse?.partnerships || [];
  const analytics = partnershipsResponse?.analytics;

  // Create partnership mutation
  const createMutation = useMutation({
    mutationFn: async (data: PartnershipFormData) => {
      const response = await fetch("/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to create partnership");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partnerships"] });
      toast({
        title: "Success",
        description: "Partnership created successfully"
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create partnership",
        variant: "destructive"
      });
    }
  });

  // Update partnership mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PartnershipFormData> }) => {
      const response = await fetch(`/api/partnerships/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to update partnership");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partnerships"] });
      toast({
        title: "Success", 
        description: "Partnership updated successfully"
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update partnership",
        variant: "destructive"
      });
    }
  });

  // Delete partnership mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/partnerships/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete partnership");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partnerships"] });
      toast({
        title: "Success",
        description: "Partnership deleted successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete partnership",
        variant: "destructive"
      });
    }
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/partnerships/${id}/toggle-status`, {
        method: "PUT"
      });
      if (!response.ok) throw new Error("Failed to toggle partnership status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partnerships"] });
      toast({
        title: "Success",
        description: "Partnership status updated"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update partnership status",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      websiteUrl: "",
      logoUrl: "",
      partnershipType: "strategic"
    });
    setImagePreview("");
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (partnership: Partnership) => {
    setFormData({
      name: partnership.name,
      description: partnership.description,
      websiteUrl: partnership.websiteUrl,
      logoUrl: partnership.logoUrl,
      partnershipType: partnership.partnershipType
    });
    setImagePreview(partnership.logoUrl);
    setEditingId(partnership.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.websiteUrl || !formData.logoUrl) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData({ ...formData, logoUrl: result });
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Summary */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400">{analytics.totalClicks.toLocaleString()}</div>
              <div className="text-sm text-slate-400">Total Clicks</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-400">{analytics.activePartnerships}</div>
              <div className="text-sm text-slate-400">Active Partners</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-400">{analytics.totalPartnerships}</div>
              <div className="text-sm text-slate-400">Total Partners</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Partnership Management</h3>
          <p className="text-sm text-slate-400">Manage strategic partnerships displayed on landing page (max 6 active)</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
          data-testid="button-add-partnership"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Partnership
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Partnership" : "Add New Partnership"}</CardTitle>
            <CardDescription>
              Partnerships will appear as clickable logos on the landing page footer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Partner Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Solana Foundation"
                    data-testid="input-partner-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input
                    id="websiteUrl"
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    placeholder="https://partner-website.com"
                    data-testid="input-partner-url"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the partnership..."
                  data-testid="textarea-partner-description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnershipType">Partnership Type</Label>
                <select
                  id="partnershipType"
                  value={formData.partnershipType}
                  onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  data-testid="select-partner-type"
                >
                  <option value="strategic">Strategic</option>
                  <option value="technology">Technology</option>
                  <option value="marketing">Marketing</option>
                  <option value="sponsor">Sponsor</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Partner Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="bg-slate-700 border-slate-600"
                  data-testid="input-partner-logo"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Logo preview" 
                      className="w-20 h-20 object-cover rounded border border-slate-600"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="button-save-partnership"
                >
                  {editingId ? "Update Partnership" : "Create Partnership"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  data-testid="button-cancel-partnership"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Partnerships List */}
      <div className="space-y-4">
        {partnerships.map((partnership: Partnership) => (
          <Card key={partnership.id} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src={partnership.logoUrl} 
                    alt={partnership.name}
                    className="w-16 h-16 object-cover rounded border border-slate-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-lg">{partnership.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        partnership.partnershipType === 'strategic' ? 'bg-purple-600' :
                        partnership.partnershipType === 'technology' ? 'bg-blue-600' :
                        partnership.partnershipType === 'marketing' ? 'bg-green-600' :
                        'bg-orange-600'
                      } text-white`}>
                        {partnership.partnershipType}
                      </span>
                      {partnership.isActive ? (
                        <span className="px-2 py-1 bg-green-600 text-green-100 rounded-full text-xs">Active</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-600 text-gray-100 rounded-full text-xs">Inactive</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{partnership.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span>Order: {partnership.displayOrder}</span>
                      <span>Clicks: {partnership.clickCount.toLocaleString()}</span>
                      {partnership.lastClickedAt && (
                        <span>Last clicked: {new Date(partnership.lastClickedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(partnership.websiteUrl, '_blank')}
                    data-testid={`button-visit-${partnership.id}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatusMutation.mutate(partnership.id)}
                    data-testid={`button-toggle-${partnership.id}`}
                  >
                    {partnership.isActive ? (
                      <ToggleRight className="h-4 w-4 text-green-400" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(partnership)}
                    data-testid={`button-edit-${partnership.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(partnership.id)}
                    className="text-red-400 hover:text-red-300"
                    data-testid={`button-delete-${partnership.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {partnerships.length === 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <Image className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No partnerships yet</h3>
            <p className="text-slate-400 mb-4">
              Add your first partnership to start building strategic relationships
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Partnership
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}