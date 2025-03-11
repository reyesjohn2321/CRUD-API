import { AppDataSource } from "../config/ormconfig";
import { User } from "../entities/User";
import { Repository } from "typeorm";
import bcrypt from "bcryptjs";

export class UserService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    // ✅ Get all users
    async getAll(): Promise<User[]> {
        return await this.userRepository.find({
            select: ["id", "email", "title", "firstName", "lastName", "role"],
        });
    }

    // ✅ Get user by ID
    async getById(id: number): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { id },
            select: ["id", "email", "title", "firstName", "lastName", "role"],
        });
    }

    // ✅ Get user by Email
    async getByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { email },
            select: ["id", "email", "title", "firstName", "lastName", "role"],
        });
    }

    // ✅ Search users by name
    async searchUsers(name: string): Promise<User[]> {
        return await this.userRepository.createQueryBuilder("user")
            .where("LOWER(user.firstName) LIKE LOWER(:name)", { name: `%${name}%` })
            .orWhere("LOWER(user.lastName) LIKE LOWER(:name)", { name: `%${name}%` })
            .select(["user.id", "user.email", "user.title", "user.firstName", "user.lastName", "user.role"])
            .getMany();
    }

    // ✅ Get all Admins
    async getAdmins(): Promise<User[]> {
        return await this.userRepository.find({
            where: { role: "Admin" },
            select: ["id", "email", "title", "firstName", "lastName", "role"],
        });
    }

    // ✅ Create a new user with password hashing
    async create(userData: Partial<User> & { password?: string }): Promise<User> {
        if (!userData.password) {
            throw new Error("Password is required");
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = this.userRepository.create({
            ...userData,
            passwordHash: hashedPassword,
        });

        delete newUser.password; // ✅ Safe to delete now since it's optional

        return await this.userRepository.save(newUser);
    }

    // ✅ Update user details
    async update(id: number, userData: Partial<User> & { password?: string }): Promise<User | null> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) return null;

        if (userData.password) {
            userData.passwordHash = await bcrypt.hash(userData.password, 10);
            delete userData.password;
        }

        Object.assign(user, userData);
        return await this.userRepository.save(user);
    }

    // ✅ Delete a user
    async delete(id: number): Promise<boolean> {
        const result = await this.userRepository.delete(id);
        return result.affected !== 0;
    }
}
