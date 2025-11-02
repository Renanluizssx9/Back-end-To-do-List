import { authMiddleware } from "../../src/middlewares/verifyJWT";
import jwt from "jsonwebtoken";
import User from "../../src/models/userModel";

jest.mock("jsonwebtoken");
jest.mock("../../src/models/userModel");

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe("authMiddleware", () => {
  const JWT_SECRET = "testsecret";
  process.env.JWT_SECRET = JWT_SECRET;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if token is missing", async () => {
    const req: any = { headers: {} };
    const res = mockRes();

    await authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Missing or malformed token.",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if token is malformed", async () => {
    const req: any = { headers: { authorization: "InvalidToken" } };
    const res = mockRes();

    await authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Missing or malformed token.",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", async () => {
    const req: any = { headers: { authorization: "Bearer invalidtoken" } };
    const res = mockRes();
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token.",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if user does not exist", async () => {
    const req: any = { headers: { authorization: "Bearer validtoken" } };
    const res = mockRes();
    (jwt.verify as jest.Mock).mockReturnValue({ id: "user123" });
    (User.findById as jest.Mock).mockResolvedValue(null);

    await authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "User no longer exists." });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next if token and user are valid", async () => {
    const req: any = { headers: { authorization: "Bearer validtoken" } };
    const res = mockRes();
    (jwt.verify as jest.Mock).mockReturnValue({ id: "user123" });
    (User.findById as jest.Mock).mockResolvedValue({ _id: "user123" });

    await authMiddleware(req, res, mockNext);

    expect(req.userId).toBe("user123");
    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
