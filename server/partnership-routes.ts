import express from "express";
import { randomUUID } from "crypto";

const router = express.Router();

// Mock partnership data with six diverse test partners
let partnerships: any[] = [
  {
    id: "partnership-001",
    name: "Solana Foundation",
    description: "Official blockchain partnership providing infrastructure and developer support for Web3 innovation",
    websiteUrl: "https://solana.com",
    logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDgiIGZpbGw9IiM5MUFBM0EiLz48cGF0aCBkPSJNMjAgNDBsMjAgLTEwIDIwIDEwdjIwbC0yMCAxMC0yMCAtMTB2LTIweiIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwIiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TT0xBTkE8L3RleHQ+PC9zdmc+",
    isActive: true,
    displayOrder: 1,
    partnershipType: "strategic",
    clickCount: 2847,
    lastClickedAt: "2025-08-22T14:30:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-08-22T14:30:00Z"
  },
  {
    id: "partnership-002", 
    name: "Magic Eden",
    description: "Leading NFT marketplace driving digital asset adoption and creator economy growth",
    websiteUrl: "https://magiceden.io",
    logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDgiIGZpbGw9IiNFMzMxRTYiLz48cGF0aCBkPSJNMzAgMzBsMjAgMTAgMjAgLTEwdjI1bC0yMCAxMC0yMCAtMTB2LTI1eiIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwIiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NQUdJQzwvdGV4dD48L3N2Zz4=",
    isActive: true,
    displayOrder: 2,
    partnershipType: "technology",
    clickCount: 1923,
    lastClickedAt: "2025-08-21T09:15:00Z",
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2025-08-21T09:15:00Z"
  },
  {
    id: "partnership-003",
    name: "Chainlink Labs",
    description: "Oracle network powering secure and reliable data feeds for DeFi and Web3 applications",
    websiteUrl: "https://chainlinklabs.com",
    logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDgiIGZpbGw9IiMyNDU3QUIiLz48cmVjdCB4PSIzNSIgeT0iMzUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2ZmZiIgcng9IjQiLz48Y2lyY2xlIGN4PSI0NSIgY3k9IjQ1IiByPSIzIiBmaWxsPSIjMjQ1N0FCIi8+PGNpcmNsZSBjeD0iNTUiIGN5PSI0NSIgcj0iMyIgZmlsbD0iIzI0NTdBQiIvPjxjaXJjbGUgY3g9IjQ1IiBjeT0iNTUiIHI9IjMiIGZpbGw9IiMyNDU3QUIiLz48Y2lyY2xlIGN4PSI1NSIgY3k9IjU1IiByPSIzIiBmaWxsPSIjMjQ1N0FCIi8+PHRleHQgeD0iNTAiIHk9Ijc4IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iOSIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q0hBSU5MSU5LPC90ZXh0Pjwvc3ZnPg==",
    isActive: true,
    displayOrder: 3,
    partnershipType: "technology",
    clickCount: 1654,
    lastClickedAt: "2025-08-20T16:45:00Z",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2025-08-20T16:45:00Z"
  },
  {
    id: "partnership-004",
    name: "Coinbase Ventures",
    description: "Strategic investment partner supporting the next generation of blockchain innovation and adoption",
    websiteUrl: "https://ventures.coinbase.com",
    logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDgiIGZpbGw9IiMwMDUyRkYiLz48cmVjdCB4PSI0MCIgeT0iNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIgcng9IjEwIi8+PHRleHQgeD0iNTAiIHk9Ijc1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iOSIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q09JTkJBU0U8L3RleHQ+PC9zdmc+",
    isActive: true,
    displayOrder: 4,
    partnershipType: "sponsor",
    clickCount: 1287,
    lastClickedAt: "2025-08-19T12:20:00Z",
    createdAt: "2024-04-10T00:00:00Z",
    updatedAt: "2025-08-19T12:20:00Z"
  },
  {
    id: "partnership-005",
    name: "ConsenSys",
    description: "Ethereum infrastructure leader building the foundational tools for decentralized applications",
    websiteUrl: "https://consensys.net",
    logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDgiIGZpbGw9IiMzMjU5RDEiLz48cG9seWdvbiBwb2ludHM9IjM1LDM1IDY1LDM1IDU3LjUsNTAgNjUsNjUgMzUsNjUgNDIuNSw1MCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwIiB5PSI3OCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjgiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNPTlNFTlNZUzwvdGV4dD48L3N2Zz4=",
    isActive: true,
    displayOrder: 5,
    partnershipType: "strategic",
    clickCount: 945,
    lastClickedAt: "2025-08-18T08:30:00Z",
    createdAt: "2024-05-20T00:00:00Z",
    updatedAt: "2025-08-18T08:30:00Z"
  },
  {
    id: "partnership-006",
    name: "Helius",
    description: "High-performance Solana RPC provider enabling scalable dApp development with superior reliability",
    websiteUrl: "https://helius.xyz",
    logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi0vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDgiIGZpbGw9IiNGRjcwMDAiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjQwIiByPSI4IiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iNDAiIGN5PSI1NSIgcj0iNiIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iNTUiIHI9IjYiIGZpbGw9IiNmZmYiLz48dGV4dCB4PSI1MCIgeT0iNzgiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SEVMSVVTPC90ZXh0Pjwvc3ZnPg==",
    isActive: true,
    displayOrder: 6,
    partnershipType: "technology",
    clickCount: 721,
    lastClickedAt: "2025-08-17T15:45:00Z",
    createdAt: "2024-06-15T00:00:00Z",
    updatedAt: "2025-08-17T15:45:00Z"
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