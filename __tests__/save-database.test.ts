require("dotenv/config");
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import UserController from "../src/controllers/user";
import UserCalendar from "../src/models/calendar";
import { request, response } from "express";

describe("save database", () => {
  let mongoServer: MongoMemoryServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoServer.getUri());
    console.log(mongoose.connection.readyState);
  });

  beforeEach(async () => {
    mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should save a user", async () => {
    const user = new UserCalendar({
      username: "my_username",
      aurionToken: "my_token",
      calendarLink: "/assets/my_calendar.ics",
    });
    await user.save();
    console.log(user);
    console.log(await UserCalendar.find({}));
    const userFound = await UserController.getUser(user.username);
    console.log(userFound);
    expect(userFound).toBeDefined();
    expect(userFound.username).toEqual(user.username);
    expect(userFound.aurionToken).toEqual(user.aurionToken);
    expect(userFound.calendarLink).toEqual(user.calendarLink);
  });
});
