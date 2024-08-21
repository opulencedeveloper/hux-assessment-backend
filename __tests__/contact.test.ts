import request from "supertest";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { app } from "../app";
import { contactService } from "../src/contact/service";
import { MessageResponse } from "../src/utils/enum";
import { userService } from "../src/user/service";
import { CustomRequest } from "../src/utils/interface";
import { NextFunction, Response } from "express";
import Contact from "../src/contact/entity";
import User from "../src/user/entity";

dotenv.config();

// Mocking the contact service and user services
jest.mock("../src/contact/service");
jest.mock("../src/user/service");

// Mocking the authentication middleware to attach userId to req
jest.mock("../src/middleware/is_auth", () => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    req.userId = mockUserId;
    next();
  };
});

// Mocking the contact service and user service modules
const mockUserId = "66b12b4acb224570281d51de";

// Defining a mock user object to be used in tests
const mockUser = {
  _id: mockUserId,
  userName: "testUser",
  password: "$2b$12$IQigcjCXZKMRqXa69NCAr.xKynsd64N9HkqZsG7liN8zTtvl2Vl6C",
};

beforeEach(async () => {
  //Clear mock implementations and calls
  jest.clearAllMocks();

  // Clear the Contact collection to ensure a clean state
  await Contact.deleteMany({});

  // Clear the User collection to ensure a clean state
  await User.deleteMany({});

  // Insert the mock user into the database
  await User.create(mockUser);
});

describe("Contact API", () => {
  const mockContactId = "66ab1e3c80c29e19231ded23";

  // Creating a JWT token for authentication in tests
  const token = jwt.sign({ userId: mockUserId }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  // Defining a mock contact object for use in tests
  const mockContact = {
    _id: mockContactId,
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "1234567890",
    creatorId: mockUserId,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (userService.findUserById as jest.Mock).mockReturnValue(
      Promise.resolve(mockUser)
    );
  });

  it("should create a new contact", async () => {
    const response = await request(app)
      .post("/api/v1/contact")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "1234567890",
      });

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

    console.log("Response3", response.body);

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

    console.log("Response4", response.body);

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

    expect(response.status).toBe(201);

    expect(response.body.status).toBe(MessageResponse.Success);

    expect(response.body.data).toBeNull();
  });

  it("should return 404 if contact to be deleted is not found", async () => {
    // Mock the deleteContact function to return null (indicating no contact found)
    (contactService.deleteContact as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .delete(`/api/v1/contact/${mockContactId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("Response6", response.body);

    expect(response.status).toBe(404);

    expect(response.body.status).toBe(MessageResponse.Error);

    expect(response.body.message).toBe("Contact not found.");
  });
});
