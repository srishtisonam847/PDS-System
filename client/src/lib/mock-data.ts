export const stockTrendData = {
  labels: ['Dec 9', 'Dec 10', 'Dec 11', 'Dec 12', 'Dec 13', 'Dec 14', 'Dec 15'],
  datasets: [
    {
      name: 'Rice',
      data: [400, 450, 420, 480, 460, 450, 450],
      color: '#10b981'
    },
    {
      name: 'Wheat', 
      data: [200, 180, 160, 140, 130, 125, 125],
      color: '#f59e0b'
    },
    {
      name: 'Sugar',
      data: [300, 290, 285, 280, 285, 280, 280],
      color: '#3b82f6'
    },
    {
      name: 'Kerosene',
      data: [50, 30, 20, 10, 5, 0, 0],
      color: '#ef4444'
    }
  ]
};

export const shortageData = [
  { name: 'Rice', value: 1, fill: '#10b981' },
  { name: 'Wheat', value: 3, fill: '#f59e0b' },
  { name: 'Sugar', value: 0, fill: '#3b82f6' },
  { name: 'Kerosene', value: 8, fill: '#ef4444' }
];

export const stockByShopData = [
  { shop: 'Main St', rice: 450, wheat: 125, sugar: 280, kerosene: 0 },
  { shop: 'Central', rice: 520, wheat: 380, sugar: 195, kerosene: 150 },
  { shop: 'East Side', rice: 0, wheat: 0, sugar: 45, kerosene: 0 },
  { shop: 'West End', rice: 380, wheat: 220, sugar: 160, kerosene: 80 },
  { shop: 'North Plaza', rice: 290, wheat: 180, sugar: 210, kerosene: 120 }
];
