import {
  register,
  login,
  deleteAccount,
} from "../../src/controllers/authController";
import { registerUser, loginUser } from "../../src/services/authService";
import User from "../../src/models/userModel";

jest.mock("../../src/services/authService");
jest.mock("../../src/models/userModel");

const mockReq = (body = {}, userId?: string) => ({ body, userId } as any);
const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("authController", () => {
  it("should register user", async () => {
    const req = mockReq({ email: "test@example.com", password: "123456" });
    const res = mockRes();
    (registerUser as jest.Mock).mockResolvedValue({
      status: 201,
      data: { id: "user123" },
    });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: "user123" });
  });

  it("should login user", async () => {
    const req = mockReq({ email: "test@example.com", password: "123456" });
    const res = mockRes();
    (loginUser as jest.Mock).mockResolvedValue({
      status: 200,
      data: { token: "abc123" },
    });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: "abc123" });
  });

  it("should delete account if user exists", async () => {
    const req = mockReq({}, "user123");
    const res = mockRes();
    (User.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: "user123" });

    await deleteAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Account deleted successfully",
    });
  });

  it("should return 404 if user not found", async () => {
    const req = mockReq({}, "user123");
    const res = mockRes();
    (User.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    await deleteAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });
});
