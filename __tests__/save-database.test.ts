require("dotenv/config");
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import UserController from "../src/controllers/user";
import { request, response } from "express";

describe("save database", () => {
  let mongoServer: MongoMemoryServer;
  let userController = new UserController();
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should save a user", async () => {
    await userController._saveUserToken("my_username", "my_aurion_token");
  });

  it("should get the user token", async () => {
    request.body.username = "my_username";
    const user = await userController.getUser(request, response, null);
    expect(user).toBeDefined();
    // Pour résoudre mon erreur, faire un return dans la fonction _getUserToken.
  });
});
