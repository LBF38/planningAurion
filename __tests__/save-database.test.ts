import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import UserController from "../src/controllers/user";

describe("save database", () => {
  let mongoServer: MongoMemoryServer;
  let userController = UserController;
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
    await userController.saveUserToken("my_username", "my_aurion_token");
  });
});
