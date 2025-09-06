import { type User, type InsertUser, type Shop, type InsertShop, type Stock, type InsertStock, type Beneficiary, type InsertBeneficiary } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmailAndRole(email: string, role: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Shops
  getShop(id: string): Promise<Shop | undefined>;
  getAllShops(): Promise<Shop[]>;
  createShop(shop: InsertShop): Promise<Shop>;

  // Stock
  getStockByShop(shopId: string): Promise<Stock[]>;
  getStockByShopAndItem(shopId: string, itemType: string): Promise<Stock | undefined>;
  getAllStock(): Promise<Stock[]>;
  updateStock(shopId: string, itemType: string, quantity: number, unit: string): Promise<Stock>;

  // Beneficiaries
  getBeneficiaryByUserId(userId: string): Promise<Beneficiary | undefined>;
  createBeneficiary(beneficiary: InsertBeneficiary): Promise<Beneficiary>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private shops: Map<string, Shop>;
  private stock: Map<string, Stock>;
  private beneficiaries: Map<string, Beneficiary>;

  constructor() {
    this.users = new Map();
    this.shops = new Map();
    this.stock = new Map();
    this.beneficiaries = new Map();
    this.seedData();
  }

  private seedData() {
    // Create shops
    const shop1: Shop = {
      id: "shop1",
      name: "Main Street Shop",
      address: "123 Main Street",
      contactNumber: "555-0101"
    };
    
    const shop2: Shop = {
      id: "shop2",
      name: "Central Market Shop",
      address: "456 Central Avenue",
      contactNumber: "555-0102"
    };

    const shop3: Shop = {
      id: "shop3",
      name: "East Side Shop",
      address: "789 East Road",
      contactNumber: "555-0103"
    };

    this.shops.set(shop1.id, shop1);
    this.shops.set(shop2.id, shop2);
    this.shops.set(shop3.id, shop3);

    // Create users
    const adminUser: User = {
      id: "admin1",
      email: "admin@pds.gov",
      password: "admin123",
      role: "admin",
      name: "Admin User",
      shopId: null
    };

    const shopUser: User = {
      id: "shop1",
      email: "shop@mainstreet.com",
      password: "shop123",
      role: "shop",
      name: "Shop Manager",
      shopId: "shop1"
    };

    const beneficiaryUser: User = {
      id: "ben1",
      email: "john@example.com",
      password: "user123",
      role: "beneficiary",
      name: "John Doe",
      shopId: null
    };

    this.users.set(adminUser.id, adminUser);
    this.users.set(shopUser.id, shopUser);
    this.users.set(beneficiaryUser.id, beneficiaryUser);

    // Create beneficiary
    const beneficiary: Beneficiary = {
      id: "ben1",
      userId: "ben1",
      shopId: "shop1",
      rationCardNumber: "RC123456",
      familySize: 4
    };

    this.beneficiaries.set(beneficiary.id, beneficiary);

    // Create initial stock
    const stockItems = [
      { shopId: "shop1", itemType: "rice", quantity: 450, unit: "kg" },
      { shopId: "shop1", itemType: "wheat", quantity: 125, unit: "kg" },
      { shopId: "shop1", itemType: "sugar", quantity: 280, unit: "kg" },
      { shopId: "shop1", itemType: "kerosene", quantity: 0, unit: "L" },
      
      { shopId: "shop2", itemType: "rice", quantity: 520, unit: "kg" },
      { shopId: "shop2", itemType: "wheat", quantity: 380, unit: "kg" },
      { shopId: "shop2", itemType: "sugar", quantity: 195, unit: "kg" },
      { shopId: "shop2", itemType: "kerosene", quantity: 150, unit: "L" },
      
      { shopId: "shop3", itemType: "rice", quantity: 0, unit: "kg" },
      { shopId: "shop3", itemType: "wheat", quantity: 0, unit: "kg" },
      { shopId: "shop3", itemType: "sugar", quantity: 45, unit: "kg" },
      { shopId: "shop3", itemType: "kerosene", quantity: 0, unit: "L" },
    ];

    stockItems.forEach(item => {
      const stockItem: Stock = {
        id: randomUUID(),
        shopId: item.shopId,
        itemType: item.itemType,
        quantity: item.quantity,
        unit: item.unit,
        lastUpdated: new Date()
      };
      this.stock.set(`${item.shopId}-${item.itemType}`, stockItem);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmailAndRole(email: string, role: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email && user.role === role
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, shopId: insertUser.shopId || null };
    this.users.set(id, user);
    return user;
  }

  async getShop(id: string): Promise<Shop | undefined> {
    return this.shops.get(id);
  }

  async getAllShops(): Promise<Shop[]> {
    return Array.from(this.shops.values());
  }

  async createShop(insertShop: InsertShop): Promise<Shop> {
    const id = randomUUID();
    const shop: Shop = { ...insertShop, id, contactNumber: insertShop.contactNumber || null };
    this.shops.set(id, shop);
    return shop;
  }

  async getStockByShop(shopId: string): Promise<Stock[]> {
    return Array.from(this.stock.values()).filter(item => item.shopId === shopId);
  }

  async getStockByShopAndItem(shopId: string, itemType: string): Promise<Stock | undefined> {
    return this.stock.get(`${shopId}-${itemType}`);
  }

  async getAllStock(): Promise<Stock[]> {
    return Array.from(this.stock.values());
  }

  async updateStock(shopId: string, itemType: string, quantity: number, unit: string): Promise<Stock> {
    const key = `${shopId}-${itemType}`;
    const existing = this.stock.get(key);
    
    const stockItem: Stock = {
      id: existing?.id || randomUUID(),
      shopId,
      itemType,
      quantity,
      unit,
      lastUpdated: new Date()
    };
    
    this.stock.set(key, stockItem);
    return stockItem;
  }

  async getBeneficiaryByUserId(userId: string): Promise<Beneficiary | undefined> {
    return Array.from(this.beneficiaries.values()).find(
      (beneficiary) => beneficiary.userId === userId
    );
  }

  async createBeneficiary(insertBeneficiary: InsertBeneficiary): Promise<Beneficiary> {
    const id = randomUUID();
    const beneficiary: Beneficiary = { ...insertBeneficiary, id };
    this.beneficiaries.set(id, beneficiary);
    return beneficiary;
  }
}

export const storage = new MemStorage();
