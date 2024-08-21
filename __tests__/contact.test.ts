import request from "supertest";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { app } from "../app";
import { contactService } from "../src/contact/service";
import { MessageResponse } from "../src/utils/enum";
import { userService } from "../src/user/service";
import { CustomRequest } from "../src/utils/interface";
import express, { NextFunction, Request, Response, Express } from "express";
import Contact from "../src/contact/entity";
import User from "../src/user/entity";
import { db } from "../jest.setup";

dotenv.config();

jest.mock("../src/contact/service");
jest.mock("../src/user/service");

const mockUserId = "66b12b4acb224570281d51de";

jest.mock("../src/middleware/is_auth", () => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    req.userId = mockUserId;
    next();
  };
});


const mockUser = {
  _id: mockUserId,
  userName: "testUser",
  password: "$2b$12$IQigcjCXZKMRqXa69NCAr.xKynsd64N9HkqZsG7liN8zTtvl2Vl6C",
};

beforeEach(async () => {
  jest.clearAllMocks();
  await Contact.deleteMany({});
  await User.deleteMany({}); // Clear any existing users

  // Insert the mock user into the database
  await User.create(mockUser);
});


describe("Contact API", () => {
  const mockContactId = "66ab1e3c80c29e19231ded23";

  const token = jwt.sign(
    { userId: mockUserId },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  const mockUser = {
    _id: mockUserId,
    userName: "testUser",
    password: "$2b$12$IQigcjCXZKMRqXa69NCAr.xKynsd64N9HkqZsG7liN8zTtvl2Vl6C",
  };

  const mockContact = {
    _id: mockContactId,
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "1234567890",
    creatorId: mockUserId,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  
    // Using mockImplementation
    (userService.findUserById as jest.Mock).mockReturnValue(Promise.resolve(mockUser));
    
  });
  
  // Test cases remain the same
  

  it("should create a new contact", async () => {

    const response = await request(app)
      .post("/api/v1/contact")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "1234567890"
      });

      console.log("Response1", response.body)
    expect(response.status).toBe(201);
    expect(response.body.status).toBe(MessageResponse.Success);
  });

  it("should retrieve all contacts for the user", async () => {
    
    await Contact.create(mockContact);
    (contactService.fetchContactsByCreatorId as jest.Mock).mockResolvedValue([
      mockContact,
    ]);

    const response = await request(app)
      .get("/api/v1/contacts")
      .set("Authorization", `Bearer ${token}`);

      console.log("Response22222222222222222", response.body)

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(MessageResponse.Success);
  });

  it("should retrieve a single contact by ID", async () => {
    (contactService.fetchContactByCreatorId as jest.Mock).mockResolvedValue(
      mockContact
    );

    const response = await request(app)
      .get(`/api/v1/contact/${mockContactId}`)
      .set("Authorization", `Bearer ${token}`);

      console.log("Response3", response.body)

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(MessageResponse.Success);
  });

  it("should update an existing contact", async () => {
    const updatedContact = { ...mockContact, firstName: "Jane" };
    await Contact.create(updatedContact);
    (contactService.editContact as jest.Mock).mockResolvedValue(updatedContact);

    const response = await request(app)
      .patch(`/api/v1/contact/${mockContactId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "Jane",
        lastName: "Doe",
        phoneNumber: "1234567890",
      });

      console.log("Response4", response.body)

    expect(response.status).toBe(201);
    expect(response.body.status).toBe(MessageResponse.Success);
    expect(response.body.data).toMatchObject(updatedContact);
  });

  it("should delete a contact", async () => {
    await Contact.create(mockContact);
    (contactService.deleteContact as jest.Mock).mockResolvedValue(mockContact);

    const response = await request(app)
      .delete(`/api/v1/contact/${mockContactId}`)
      .set("Authorization", `Bearer ${token}`);

      console.log("Response5", response.body)

    expect(response.status).toBe(201);
    expect(response.body.status).toBe(MessageResponse.Success);
    expect(response.body.data).toBeNull();
  });

  it("should return 404 if contact to be deleted is not found", async () => {
    (contactService.deleteContact as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .delete(`/api/v1/contact/${mockContactId}`)
      .set("Authorization", `Bearer ${token}`);

      console.log("Response6", response.body)

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(MessageResponse.Error);
    expect(response.body.message).toBe("Contact not found.");
  });
});



// import request from "supertest";
// import dotenv from "dotenv";
// import jwt from "jsonwebtoken";
// import { app } from "../app";
// import { contactService } from "../src/contact/service";
// import { MessageResponse } from "../src/utils/enum";
// import { userService } from "../src/user/service";
// import { CustomRequest } from "../src/utils/interface";
// import { Response, NextFunction } from "express";
// import Contact from "../src/contact/entity";
// import { db } from "../jest.setup"; // Import the db connection

// dotenv.config();

// jest.mock("../src/contact/service");
// jest.mock("../src/user/service");

// const mockUserId = "66b12b4acb224570281d51de";

// // Mocking the is_auth middleware to inject a user ID into the request
// jest.mock("../src/middleware/is_auth", () => {
//   return (req: CustomRequest, res: Response, next: NextFunction) => {
//     req.userId = mockUserId;
//     next();
//   };
// });

// beforeEach(async () => {
//   jest.clearAllMocks();
//   await Contact.deleteMany({});
// });

// describe("Contact API", () => {
//   const mockUser = {
//     _id: mockUserId,
//     userName: "testUser",
//     password: "$2b$12$IQigcjCXZKMRqXa69NCAr.xKynsd64N9HkqZsG7liN8zTtvl2Vl6C",
//   };

//   beforeEach(() => {
//     (userService.findUserById as jest.Mock).mockResolvedValue(mockUser);
//   });

//   it("should create a new contact", async () => {
//     // Mocking the contact creation service
//     (contactService.createContact as jest.Mock).mockResolvedValue({
//       _id: "66ab1e3c80c29e19231ded23",
//       firstName: "John",
//       lastName: "Doe",
//       phoneNumber: "1234567890",
//       creatorId: mockUserId,
//     });

//     const token = jwt.sign({ userId: mockUserId }, process.env.JWT_SECRET!, {
//       expiresIn: "1h",
//     });

//     const response = await request(app)
//       .post("/api/v1/contact")
//       .set("Authorization", `Bearer ${token}`)
//       .send({
//         firstName: "John",
//         lastName: "Doe",
//         phoneNumber: "1234567890",
//       });

//     expect(response.status).toBe(201);
//     expect(response.body.status).toBe(MessageResponse.Success);
//     expect(response.body.data.creatorId).toBe(mockUserId);

//     // Verify that the contact was created in the database
//     const createdContact = await db.collection('contacts').findOne({ _id: "66ab1e3c80c29e19231ded23" });
//     expect(createdContact).toBeTruthy();
//     expect(createdContact?.firstName).toBe("John");
//     expect(createdContact?.creatorId.toString()).toBe(mockUserId);
//   });
// });