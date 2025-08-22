import express from "express";
import { randomUUID } from "crypto";

const router = express.Router();

// Mock partnership data (in production, this would be database operations)
let partnerships: any[] = [
  {
    id: "partnership-001",
    name: "Solana Foundation",
    description: "Official blockchain partnership providing infrastructure and developer support",
    websiteUrl: "https://solana.com",
    logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiM5MUFBM0EiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+U09MPC90ZXh0Pjwvc3ZnPg==",
    isActive: true,
    displayOrder: 1,
    partnershipType: "strategic",
    startDate: "2024-01-01T00:00:00Z",
    endDate: null,
    clickCount: 1247,
    lastClickedAt: "2024-08-20T14:30:00Z",
    addedBy: "admin-001",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-08-20T14:30:00Z"
  },
  {
    id: "partnership-002",
    name: "Phantom Wallet",
    description: "Leading Solana wallet provider enabling seamless user onboarding",
    websiteUrl: "https://phantom.app",
    logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiM0QzFFRjUiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+UEJUTQ==",
    isActive: true,
    displayOrder: 2,
    partnershipType: "technology",
    startDate: "2024-02-15T00:00:00Z",
    endDate: null,
    clickCount: 823,
    lastClickedAt: "2024-08-19T11:15:00Z",
    addedBy: "admin-001",
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-08-19T11:15:00Z"
  },
  {
    id: "partnership-003",
    name: "OpenAI",
    description: "AI technology partnership powering FlutterBye's intelligent features",
    websiteUrl: "https://openai.com",
    logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiMwMEE2RkIiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+QUk8L3RleHQ+PC9zdmc+",
    isActive: true,
    displayOrder: 3,
    partnershipType: "technology",
    startDate: "2024-03-01T00:00:00Z",
    endDate: null,
    clickCount: 654,
    lastClickedAt: "2024-08-18T16:45:00Z",
    addedBy: "admin-001",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-08-18T16:45:00Z"
  }
];

// GET /api/partnerships - Get all partnerships
router.get("/", (req, res) => {
  try {
    const { includeInactive = "false" } = req.query;
    
    let filteredPartnerships = partnerships;
    if (includeInactive !== "true") {
      filteredPartnerships = partnerships.filter(p => p.isActive);
    }
    
    // Sort by display order, then by creation date
    const sortedPartnerships = filteredPartnerships.sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    res.json({
      success: true,
      partnerships: sortedPartnerships,
      total: sortedPartnerships.length,
      analytics: {
        totalClicks: partnerships.reduce((sum, p) => sum + p.clickCount, 0),
        activePartnerships: partnerships.filter(p => p.isActive).length,
        totalPartnerships: partnerships.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch partnerships",
      details: error
    });
  }
});

// GET /api/partnerships/active - Get only active partnerships for landing page
router.get("/active", (req, res) => {
  try {
    const activePartnerships = partnerships
      .filter(p => p.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .slice(0, 6); // Limit to 6 as requested

    res.json({
      success: true,
      partnerships: activePartnerships
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch active partnerships",
      details: error
    });
  }
});

// POST /api/partnerships - Create new partnership
router.post("/", (req, res) => {
  try {
    const { name, description, websiteUrl, logoUrl, partnershipType = "strategic" } = req.body;
    
    if (!name || !description || !websiteUrl || !logoUrl) {
      return res.status(400).json({
        success: false,
        error: "name, description, websiteUrl, and logoUrl are required"
      });
    }

    // Validate URL format
    try {
      new URL(websiteUrl);
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: "Invalid website URL format"
      });
    }

    // Generate next display order
    const maxOrder = partnerships.reduce((max, p) => Math.max(max, p.displayOrder), 0);

    const newPartnership = {
      id: `partnership-${randomUUID().slice(0, 8)}`,
      name,
      description,
      websiteUrl,
      logoUrl,
      isActive: true,
      displayOrder: maxOrder + 1,
      partnershipType,
      startDate: new Date().toISOString(),
      endDate: null,
      clickCount: 0,
      lastClickedAt: null,
      addedBy: "admin-current", // In production, get from session
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    partnerships.push(newPartnership);

    res.status(201).json({
      success: true,
      message: "Partnership created successfully",
      partnership: newPartnership
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create partnership",
      details: error
    });
  }
});

// PUT /api/partnerships/:id - Update partnership
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const partnershipIndex = partnerships.findIndex(p => p.id === id);
    if (partnershipIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Partnership not found"
      });
    }

    // Validate URL if being updated
    if (updates.websiteUrl) {
      try {
        new URL(updates.websiteUrl);
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: "Invalid website URL format"
        });
      }
    }

    // Update partnership
    partnerships[partnershipIndex] = {
      ...partnerships[partnershipIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: "Partnership updated successfully",
      partnership: partnerships[partnershipIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update partnership",
      details: error
    });
  }
});

// DELETE /api/partnerships/:id - Delete partnership
router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;
    
    const partnershipIndex = partnerships.findIndex(p => p.id === id);
    if (partnershipIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Partnership not found"
      });
    }

    const deletedPartnership = partnerships.splice(partnershipIndex, 1)[0];

    res.json({
      success: true,
      message: "Partnership deleted successfully",
      partnership: deletedPartnership
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete partnership",
      details: error
    });
  }
});

// POST /api/partnerships/:id/click - Track partnership click
router.post("/:id/click", (req, res) => {
  try {
    const { id } = req.params;
    
    const partnershipIndex = partnerships.findIndex(p => p.id === id);
    if (partnershipIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Partnership not found"
      });
    }

    // Update click count and timestamp
    partnerships[partnershipIndex].clickCount += 1;
    partnerships[partnershipIndex].lastClickedAt = new Date().toISOString();
    partnerships[partnershipIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: "Partnership click tracked",
      partnership: partnerships[partnershipIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to track partnership click",
      details: error
    });
  }
});

// PUT /api/partnerships/:id/toggle-status - Toggle partnership active status
router.put("/:id/toggle-status", (req, res) => {
  try {
    const { id } = req.params;
    
    const partnershipIndex = partnerships.findIndex(p => p.id === id);
    if (partnershipIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Partnership not found"
      });
    }

    // Toggle status
    partnerships[partnershipIndex].isActive = !partnerships[partnershipIndex].isActive;
    partnerships[partnershipIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: `Partnership ${partnerships[partnershipIndex].isActive ? 'activated' : 'deactivated'} successfully`,
      partnership: partnerships[partnershipIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to toggle partnership status",
      details: error
    });
  }
});

// PUT /api/partnerships/reorder - Reorder partnerships
router.put("/reorder", (req, res) => {
  try {
    const { partnershipIds } = req.body;
    
    if (!Array.isArray(partnershipIds)) {
      return res.status(400).json({
        success: false,
        error: "partnershipIds must be an array"
      });
    }

    // Update display orders
    partnershipIds.forEach((id, index) => {
      const partnershipIndex = partnerships.findIndex(p => p.id === id);
      if (partnershipIndex !== -1) {
        partnerships[partnershipIndex].displayOrder = index + 1;
        partnerships[partnershipIndex].updatedAt = new Date().toISOString();
      }
    });

    res.json({
      success: true,
      message: "Partnership order updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to reorder partnerships",
      details: error
    });
  }
});

export default router;