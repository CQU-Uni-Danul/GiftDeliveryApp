// Import required modules
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB Atlas URI and client
const uri = "mongodb+srv://hiviebay97:Y5M6OE5DAsUxTSux@cluster0.lbnlhye.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Global collections
let userCollection;
let orderCollection;

// Connect to MongoDB
async function connectDB() {
	try {
		await client.connect();
		console.log("Database up!");

		const db = client.db("giftdelivery");
		userCollection = db.collection("users");
		orderCollection = db.collection("orders");

	} catch (error) {
		console.error("❌ MongoDB connection error:", error);
	}
}

connectDB();

// ========== ROUTES ========== //

// Base route
app.get('/', (req, res) => {
	res.send('<h3>Welcome to Gift Delivery server app!</h3>');
});

// Test: Get all users
app.get('/getUserDataTest', async (req, res) => {
	try {
		const users = await userCollection.find({}, { projection: { _id: 0 } }).toArray();
		console.log("✅ Retrieved users:", users);
		res.status(200).send(`<h1>${JSON.stringify(users)}</h1>`);
	} catch (err) {
		console.error("❌ Error retrieving user data:", err);
		res.status(500).json({ message: "Server error", error: err });
	}
});

// Test: Get all orders
app.get('/getOrderDataTest', async (req, res) => {
	try {
		const orders = await orderCollection.find({}, { projection: { _id: 0 } }).toArray();
		console.log("✅ Retrieved orders:", orders);
		res.status(200).send(`<h1>${JSON.stringify(orders)}</h1>`);
	} catch (err) {
		console.error("❌ Error retrieving order data:", err);
		res.status(500).json({ message: "Server error", error: err });
	}
});

// Login: Verify user credentials
app.post('/verifyUserCredential', async (req, res) => {
	const { email, password } = req.body;
	console.log("🔐 Verifying credentials:", req.body);

	try {
		const user = await userCollection.findOne(
			{ email, password },
			{ projection: { _id: 0 } }
		);

		if (user) {
			console.log("✅ User found:", user);
			res.status(200).send(user);
		} else {
			console.log("❌ No matching user found");
			res.status(200).send({});
		}

	} catch (err) {
		console.error("❌ Error during user verification:", err);
		res.status(500).json({ message: "Server error", error: err });
	}
});

// Order submission: Insert order data
app.post('/insertOrderData', async (req, res) => {
	const orderData = req.body;
	console.log("📦 Inserting order:", orderData);

	try {
		const result = await orderCollection.insertOne(orderData);
		console.log(`✅ Order inserted with ID: ${result.insertedId}`);
		res.status(200).send(result);
	} catch (err) {
		console.error("❌ Error inserting order:", err);
		res.status(500).json({ message: "Server error", error: err });
	}
});

// Start server
app.listen(port, () => {
	console.log(`🚀 Gift Delivery server is running at: http://localhost:${port}`);
});
