const fs = require('fs');
const https = require('https');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product'); // Ensure correct path

const shoeData = [
  { id: '1542291026-7eec264c27ff', name: 'Nike Air Max Red', gender: 'Men', price: 4500, category: 'Sneakers' },
  { id: '1505784045224-1247b2b29cf3', name: 'Nike Classic Black', gender: 'Men', price: 3200, category: 'Sneakers' },
  { id: '1460353581641-37baddab0fa2', name: 'White Minimalist Sneaker', gender: 'Unisex', price: 2500, category: 'Casual' },
  { id: '1525966222134-fcfa99b8ae77', name: 'Vans Old Skool', gender: 'Unisex', price: 2800, category: 'Skate' },
  { id: '1606107557195-0e29a4b5b4aa', name: 'Nike Green Neon', gender: 'Men', price: 5100, category: 'Running' },
  { id: '1560769629-975ec94e6a86', name: 'Colorful Street Sneaker', gender: 'Women', price: 3400, category: 'Casual' },
  { id: '1551107696-a4b0c5a0d9a2', name: 'Adidas Cloud White', gender: 'Men', price: 3800, category: 'Running' },
  { id: '1543163521-1bf539c55dd2', name: 'Elegant High Heels', gender: 'Women', price: 4200, category: 'Heels' },
  { id: '1534653299134-96a171b61581', name: 'Kids Tiny Steps', gender: 'Kids', price: 1500, category: 'Kids' },
  { id: '1595950653106-6c9ebd614d3a', name: 'Nike Air Force 1', gender: 'Unisex', price: 3700, category: 'Sneakers' },
  { id: '1505784045224-1247b2b29cf3', name: 'Kids Red Runner', gender: 'Kids', price: 1800, category: 'Kids' },
  { id: '1579338559194-a162d19bf842', name: 'Pink Fashion Sneaker', gender: 'Women', price: 2900, category: 'Sneakers' },
  { id: '1542291026-7eec264c27ff', name: 'Kids Light Blue Velcro', gender: 'Kids', price: 1600, category: 'Kids' },
  { id: '1562183241-b937e95585b6', name: 'Women Pink Runner', gender: 'Women', price: 3600, category: 'Running' },
  { id: '1608231387042-66d1773070a5', name: 'Puma Retro Style', gender: 'Men', price: 3100, category: 'Sneakers' },
  { id: '1604671801908-6f0c6a092c05', name: 'Nike Yellow Strike', gender: 'Men', price: 4800, category: 'Running' },
  { id: '1603808033192-082d6919d3e1', name: 'Converse All Star', gender: 'Unisex', price: 2200, category: 'Casual' },
  { id: '1511556532299-8f662fc26c06', name: 'Jordan 1 Retro', gender: 'Men', price: 7500, category: 'Sneakers' },
  { id: '1595341888016-a392ef81b7de', name: 'New Balance Classic', gender: 'Unisex', price: 3400, category: 'Sneakers' },
  { id: '1515955656352-a1fa3ffcd111', name: 'Kids Blue Denim Shoe', gender: 'Kids', price: 1700, category: 'Kids' }
];

const targetDir = path.join(__dirname, '../../frontend/public/product');

// Create directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filepath);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      } else {
        reject(new Error(`Failed to download, status code: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('MongoDB connected for seeding...');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products.');

    let count = 1;
    for (const shoe of shoeData) {
      const filename = `shoe-${count}.jpg`;
      const filepath = path.join(targetDir, filename);
      const url = `https://images.unsplash.com/photo-${shoe.id}?w=800&q=80`;

      console.log(`Downloading ${filename}...`);
      try {
        await downloadImage(url, filepath);
        
        // Save to DB
        await Product.create({
          name: shoe.name,
          price: shoe.price,
          sku: `SHOE-${shoe.gender.toUpperCase()}-${count}`,
          image_url: `/product/${filename}`,
          // category_id: shoe.category, // Removed because it expects ObjectId
          description: `High quality ${shoe.gender} shoe perfect for any occasion.`,
          status: 'active'
        });
        
        console.log(`Saved ${shoe.name} to DB and downloaded image.`);
      } catch (err) {
        console.error(`Error processing ${shoe.name}:`, err.message);
      }
      count++;
    }

    console.log('Seeding and downloading complete! 20 items added.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedDatabase();
