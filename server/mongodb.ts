import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

const client = new MongoClient(process.env.MONGODB_URI);

let clientPromise: Promise<MongoClient>;

// In development mode, use a global variable to avoid re-connecting on every hot reload
if (process.env.NODE_ENV === 'development') {
  // Use a global variable in development to avoid creating multiple connections
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  clientPromise = client.connect();
}

export default clientPromise;

// Database name
export const dbName = 'zafer-restaurant';

// Get database instance
export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}