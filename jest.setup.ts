import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { ConnectOptions } from "mongoose";
import { server } from "./app";

let mongoServer: MongoMemoryServer;

export const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri); // Ensure the correct type is used for connection options
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

// Export the database connection for use in tests
export const db = mongoose.connection;




// import { MongoMemoryServer } from 'mongodb-memory-server';
// import mongoose from 'mongoose';
// import { server } from './app';

// let mongoServer: MongoMemoryServer;

// beforeAll(async () => {
//   mongoServer = await MongoMemoryServer.create();
//   const uri = mongoServer.getUri();

//   await mongoose.connect(uri);
// });

// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongoServer.stop();
//   server.close();
// });

// afterEach(async () => {
//   const collections = mongoose.connection.collections;
//   for (const key in collections) {
//     const collection = collections[key];
//     await collection.deleteMany({});
//   }
// });
