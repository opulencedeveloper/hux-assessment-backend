import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { server } from "./app";


// Increase the timeout for all tests globally
jest.setTimeout(10000); 

let mongoServer: MongoMemoryServer;

export const connectDB = async () => {
  //provides an in memory MongoDB server which is good for test.
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  return mongoose.connection;
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

export const clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

// Establish a database connection before running tests
beforeAll(async () => {
  await connectDB();
});

// Close the database connection and server after tests are complete
afterAll(async () => {
  await disconnectDB();
  server.close();
});

// Clear the database between test runs
afterEach(async () => {
  await clearDB();
});

// Export the database connection for use in tests if needed
export const db = mongoose.connection;