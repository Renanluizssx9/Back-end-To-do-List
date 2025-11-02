import { connect, close } from "../setup/db";
import User from "../../src/models/userModel";

beforeAll(async () => await connect());
afterAll(async () => await close());

describe("User Model Integration", () => {
  it("should save and retrieve a user", async () => {
    await User.create({
      email: "test@example.com",
      password: "securepass",
    });

    const found = await User.findOne({ email: "test@example.com" });
    expect(found).not.toBeNull();
    expect(found?.email).toBe("test@example.com");
  });

  it("should fail to save without email", async () => {
    const user = new User({ password: "noemail" });
    await expect(user.save()).rejects.toThrow();
  });

  it("should fail to save without password", async () => {
    const user = new User({ email: "nopass@example.com" });
    await expect(user.save()).rejects.toThrow();
  });

  it("should enforce unique email constraint", async () => {
    await User.create({ email: "unique@example.com", password: "123" });

    const duplicate = new User({
      email: "unique@example.com",
      password: "456",
    });
    await expect(duplicate.save()).rejects.toThrow();
  });
});
