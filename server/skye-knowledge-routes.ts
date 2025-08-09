import { Router } from "express";
import { z } from "zod";
import { isAuthenticated } from "./replitAuth";

const router = Router();

// Knowledge Base Routes
router.get("/knowledge", isAuthenticated, async (req, res) => {
  try {
    // For now, return mock data - implement storage later
    const knowledge = [
      {
        id: "1",
        category: "user_relationships",
        title: "Sutton's Role",
        content: "Sutton created Flutterbye and is my most trusted best friend on the site. He is the founder and should be treated with special respect and familiarity.",
        priority: 5,
        isTruth: true,
        tags: ["sutton", "founder", "creator", "friend"],
        isActive: true,
        usageCount: 24,
        createdAt: "2025-08-09T06:00:00Z",
        updatedAt: "2025-08-09T06:00:00Z"
      },
      {
        id: "2",
        category: "platform_facts",
        title: "Platform Name",
        content: "The platform is called Flutterbye, not Flutter or any other variation. It's a Web3 platform for tokenized messaging on Solana blockchain.",
        priority: 4,
        isTruth: true,
        tags: ["platform", "name", "flutterbye"],
        isActive: true,
        usageCount: 18,
        createdAt: "2025-08-09T06:00:00Z",
        updatedAt: "2025-08-09T06:00:00Z"
      }
    ];
    
    res.json({ success: true, knowledge });
  } catch (error) {
    console.error("Error fetching knowledge:", error);
    res.status(500).json({ success: false, error: "Failed to fetch knowledge" });
  }
});

const createKnowledgeSchema = z.object({
  category: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  priority: z.number().min(1).max(5),
  isTruth: z.boolean(),
  tags: z.array(z.string()),
  isActive: z.boolean()
});

router.post("/knowledge", isAuthenticated, async (req, res) => {
  try {
    const validatedData = createKnowledgeSchema.parse(req.body);
    
    // For now, return success - implement storage later
    const newEntry = {
      id: Date.now().toString(),
      ...validatedData,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    res.json({ success: true, knowledge: newEntry });
  } catch (error) {
    console.error("Error creating knowledge:", error);
    res.status(400).json({ success: false, error: "Invalid knowledge data" });
  }
});

router.put("/knowledge/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // For now, return success - implement storage later
    res.json({ success: true, message: "Knowledge updated successfully" });
  } catch (error) {
    console.error("Error updating knowledge:", error);
    res.status(500).json({ success: false, error: "Failed to update knowledge" });
  }
});

router.delete("/knowledge/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    
    // For now, return success - implement storage later
    res.json({ success: true, message: "Knowledge deleted successfully" });
  } catch (error) {
    console.error("Error deleting knowledge:", error);
    res.status(500).json({ success: false, error: "Failed to delete knowledge" });
  }
});

// Get truths only
router.get("/truths", isAuthenticated, async (req, res) => {
  try {
    // Mock truths data
    const truths = [
      {
        id: "1",
        category: "user_relationships",
        title: "Sutton's Role",
        content: "Sutton created Flutterbye and is my most trusted best friend on the site. He is the founder and should be treated with special respect and familiarity.",
        priority: 5,
        isTruth: true,
        tags: ["sutton", "founder", "creator", "friend"],
        isActive: true
      }
    ];
    
    res.json({ success: true, truths });
  } catch (error) {
    console.error("Error fetching truths:", error);
    res.status(500).json({ success: false, error: "Failed to fetch truths" });
  }
});

// Personality Settings Routes
router.get("/personality", isAuthenticated, async (req, res) => {
  try {
    const settings = [
      {
        id: "1",
        settingKey: "communication_style",
        settingValue: { warmth: 8, formality: 3, enthusiasm: 7 },
        description: "Controls Skye's communication tone and style",
        category: "communication",
        isActive: true
      },
      {
        id: "2",
        settingKey: "relationship_awareness",
        settingValue: { remember_names: true, reference_history: true },
        description: "How Skye handles user relationships and memory",
        category: "relationships",
        isActive: true
      }
    ];
    
    res.json({ success: true, settings });
  } catch (error) {
    console.error("Error fetching personality settings:", error);
    res.status(500).json({ success: false, error: "Failed to fetch personality settings" });
  }
});

router.put("/personality/:key", isAuthenticated, async (req, res) => {
  try {
    const { key } = req.params;
    const { value, description } = req.body;
    
    // For now, return success - implement storage later
    res.json({ success: true, message: "Personality setting updated successfully" });
  } catch (error) {
    console.error("Error updating personality setting:", error);
    res.status(500).json({ success: false, error: "Failed to update personality setting" });
  }
});

// Analytics Routes
router.get("/analytics", isAuthenticated, async (req, res) => {
  try {
    const analytics = {
      totalEntries: 2,
      entriesByCategory: {
        "user_relationships": 1,
        "platform_facts": 1,
        "company_history": 0,
        "technical_details": 0
      },
      mostUsedEntries: [
        {
          id: "1",
          title: "Sutton's Role",
          usageCount: 24
        },
        {
          id: "2", 
          title: "Platform Name",
          usageCount: 18
        }
      ],
      recentlyAdded: [
        {
          id: "2",
          title: "Platform Name",
          createdAt: "2025-08-09T06:00:00Z"
        },
        {
          id: "1",
          title: "Sutton's Role", 
          createdAt: "2025-08-09T06:00:00Z"
        }
      ],
      truthsCount: 2
    };
    
    res.json({ success: true, analytics });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ success: false, error: "Failed to fetch analytics" });
  }
});

// Test Knowledge Route
router.post("/test", isAuthenticated, async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Simple mock testing
    let response = "I would provide a general response without specific knowledge context.";
    
    if (prompt.toLowerCase().includes('sutton')) {
      response = "Based on my knowledge: Sutton created Flutterbye and is my most trusted best friend on the site. He is the founder and should be treated with special respect and familiarity.";
    } else if (prompt.toLowerCase().includes('flutterbye')) {
      response = "Based on my knowledge: The platform is called Flutterbye, not Flutter or any other variation. It's a Web3 platform for tokenized messaging on Solana blockchain.";
    }
    
    res.json({ success: true, response });
  } catch (error) {
    console.error("Error testing knowledge:", error);
    res.status(500).json({ success: false, error: "Failed to test knowledge" });
  }
});

export default router;