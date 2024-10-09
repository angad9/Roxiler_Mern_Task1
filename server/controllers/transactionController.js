const axios = require('axios');
const Transaction = require('../models/transaction');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Database with Third-Party Data
exports.initDatabase = async (req, res) => {
    try {
        const response = await axios.get(process.env.THIRD_PARTY_API_URL);
        const transactions = response.data;

        // Clear existing records
        await Transaction.deleteMany({});

        // Insert fetched data
        await Transaction.insertMany(transactions);

        res.status(200).json({ message: 'Database initialized with seed data' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from third-party API' });
    }
};

// List all transactions with search and pagination
exports.listTransactions = async (req, res) => {
    const { page = 1, perPage = 10, search = '' } = req.query;
    const query = {
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } }
        ]
    };
    try {
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));
        const count = await Transaction.countDocuments(query);

        res.status(200).json({ transactions, total: count });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transactions' });
    }
};

// Get statistics for the selected month
exports.getStatistics = async (req, res) => {
    const { month } = req.query;
    try {
        const soldItems = await Transaction.find({ sold: true, dateOfSale: { $regex: `-${month}-` } });
        const notSoldItems = await Transaction.find({ sold: false, dateOfSale: { $regex: `-${month}-` } });

        const totalSales = soldItems.reduce((total, item) => total + item.price, 0);
        res.status(200).json({
            totalSaleAmount: totalSales,
            totalSoldItems: soldItems.length,
            totalNotSoldItems: notSoldItems.length
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching statistics' });
    }
};

// Get bar chart data for price ranges
exports.getPriceRangeChart = async (req, res) => {
    const { month } = req.query;
    try {
        const transactions = await Transaction.find({ dateOfSale: { $regex: `-${month}-` } });
        const priceRanges = {
            '0-100': 0, '101-200': 0, '201-300': 0, '301-400': 0,
            '401-500': 0, '501-600': 0, '601-700': 0, '701-800': 0,
            '801-900': 0, '901-above': 0
        };

        transactions.forEach(tx => {
            const price = tx.price;
            if (price <= 100) priceRanges['0-100']++;
            else if (price <= 200) priceRanges['101-200']++;
            else if (price <= 300) priceRanges['201-300']++;
            else if (price <= 400) priceRanges['301-400']++;
            else if (price <= 500) priceRanges['401-500']++;
            else if (price <= 600) priceRanges['501-600']++;
            else if (price <= 700) priceRanges['601-700']++;
            else if (price <= 800) priceRanges['701-800']++;
            else if (price <= 900) priceRanges['801-900']++;
            else priceRanges['901-above']++;
        });

        res.status(200).json(priceRanges);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching price range chart' });
    }
};

// Get pie chart data for categories
exports.getCategoryPieChart = async (req, res) => {
    const { month } = req.query;
    try {
        const transactions = await Transaction.find({ dateOfSale: { $regex: `-${month}-` } });
        const categoryCounts = {};

        transactions.forEach(tx => {
            if (categoryCounts[tx.category]) {
                categoryCounts[tx.category]++;
            } else {
                categoryCounts[tx.category] = 1;
            }
        });

        res.status(200).json(categoryCounts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching category pie chart' });
    }
};

// Combine all responses into a single API
exports.getCombinedData = async (req, res) => {
    const { month } = req.query;
    try {
        const statistics = await exports.getStatistics(req, res);
        const priceRangeChart = await exports.getPriceRangeChart(req, res);
        const categoryPieChart = await exports.getCategoryPieChart(req, res);

        res.status(200).json({
            statistics,
            priceRangeChart,
            categoryPieChart
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching combined data' });
    }
};
