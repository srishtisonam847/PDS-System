import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, stockUpdateSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Login endpoint
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password, role } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmailAndRole(email, role);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Get additional user data based on role
      let userData: any = { ...user };
      delete userData.password;

      if (role === "beneficiary") {
        const beneficiary = await storage.getBeneficiaryByUserId(user.id);
        if (beneficiary) {
          const shop = await storage.getShop(beneficiary.shopId);
          userData.beneficiary = beneficiary;
          userData.assignedShop = shop;
        }
      } else if (role === "shop" && user.shopId) {
        const shop = await storage.getShop(user.shopId);
        userData.shop = shop;
      }

      res.json(userData);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Get stock for a specific shop
  app.get("/api/stock/:shopId", async (req, res) => {
    try {
      const { shopId } = req.params;
      const stock = await storage.getStockByShop(shopId);
      res.json(stock);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stock" });
    }
  });

  // Update stock for a shop
  app.post("/api/stock/:shopId", async (req, res) => {
    try {
      const { shopId } = req.params;
      const stockData = stockUpdateSchema.parse(req.body);
      
      const updatedStock = [];
      
      for (const [itemType, quantity] of Object.entries(stockData)) {
        if (quantity !== undefined) {
          const unit = itemType === 'kerosene' ? 'L' : 'kg';
          const stock = await storage.updateStock(shopId, itemType, quantity, unit);
          updatedStock.push(stock);
        }
      }
      
      res.json(updatedStock);
    } catch (error) {
      res.status(400).json({ message: "Invalid stock data" });
    }
  });

  // Get all shops with stock information (for admin)
  app.get("/api/admin/shops", async (req, res) => {
    try {
      const shops = await storage.getAllShops();
      const shopsWithStock = await Promise.all(
        shops.map(async (shop) => {
          const stock = await storage.getStockByShop(shop.id);
          return {
            ...shop,
            stock: stock.reduce((acc, item) => {
              acc[item.itemType] = item;
              return acc;
            }, {} as any)
          };
        })
      );
      
      res.json(shopsWithStock);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shops data" });
    }
  });

  // Get dashboard statistics (for admin)
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const shops = await storage.getAllShops();
      const allStock = await storage.getAllStock();
      
      const lowStockAlerts = allStock.filter(item => {
        if (item.itemType === 'kerosene') {
          return item.quantity < 50; // Low if less than 50L
        }
        return item.quantity < 100; // Low if less than 100kg
      }).length;

      const outOfStockItems = allStock.filter(item => item.quantity === 0).length;
      
      const stats = {
        totalShops: shops.length,
        beneficiaries: 1245, // Mock data
        lowStockAlerts,
        outOfStockItems,
        distributionRate: 94 // Mock data
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
