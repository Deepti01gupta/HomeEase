
import dns from 'dns';
import mongoose from 'mongoose';

// Ensure SRV records can be resolved properly across environments (e.g. Windows Node.js DNS)
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
    // Fallback gracefully if setServers is restricted
}

const connectDatabase = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is missing from .env');
    }

    if (
        process.env.MONGODB_URI.includes('your_mongodb_connection_string') ||
        process.env.MONGODB_URI.includes('<password>') ||
        process.env.MONGODB_URI.includes('<username>')
    ) {
        throw new Error('MONGODB_URI still contains placeholder credentials');
    }

    try {
        const connection = await mongoose.connect(
            process.env.MONGODB_URI,
            {
                serverSelectionTimeoutMS: 8000,
                connectTimeoutMS: 8000,
            }
        );

        console.log(
            `MongoDB Atlas Connected: ${connection.connection.host}`
        );
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        throw error;
    }
};

export default connectDatabase;
