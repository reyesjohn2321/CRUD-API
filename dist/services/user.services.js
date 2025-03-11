"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const ormconfig_1 = require("../config/ormconfig");
const User_1 = require("../entities/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService {
    constructor() {
        this.userRepository = ormconfig_1.AppDataSource.getRepository(User_1.User);
    }
    // ✅ Get all users
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.find({
                select: ["id", "email", "title", "firstName", "lastName", "role"],
            });
        });
    }
    // ✅ Get user by ID
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.findOne({
                where: { id },
                select: ["id", "email", "title", "firstName", "lastName", "role"],
            });
        });
    }
    // ✅ Get user by Email
    getByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.findOne({
                where: { email },
                select: ["id", "email", "title", "firstName", "lastName", "role"],
            });
        });
    }
    // ✅ Search users by name
    searchUsers(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.createQueryBuilder("user")
                .where("LOWER(user.firstName) LIKE LOWER(:name)", { name: `%${name}%` })
                .orWhere("LOWER(user.lastName) LIKE LOWER(:name)", { name: `%${name}%` })
                .select(["user.id", "user.email", "user.title", "user.firstName", "user.lastName", "user.role"])
                .getMany();
        });
    }
    // ✅ Get all Admins
    getAdmins() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.find({
                where: { role: "Admin" },
                select: ["id", "email", "title", "firstName", "lastName", "role"],
            });
        });
    }
    // ✅ Create a new user with password hashing
    create(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userData.password) {
                throw new Error("Password is required");
            }
            const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
            const newUser = this.userRepository.create(Object.assign(Object.assign({}, userData), { passwordHash: hashedPassword }));
            delete newUser.password; // ✅ Safe to delete now since it's optional
            return yield this.userRepository.save(newUser);
        });
    }
    // ✅ Update user details
    update(id, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOneBy({ id });
            if (!user)
                return null;
            if (userData.password) {
                userData.passwordHash = yield bcryptjs_1.default.hash(userData.password, 10);
                delete userData.password;
            }
            Object.assign(user, userData);
            return yield this.userRepository.save(user);
        });
    }
    // ✅ Delete a user
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userRepository.delete(id);
            return result.affected !== 0;
        });
    }
}
exports.UserService = UserService;
