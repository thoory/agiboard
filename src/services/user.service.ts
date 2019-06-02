import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { User } from "../entity/user.entity";
import { UserRegisterDto } from '../dtos/user.dto';

@Service()
export class UserService {

    /**
     * @constructor
     * @param {Repository<User>} userRepository 
     */
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    /**
     * Create a user
     * @param {UserRegisterDto} user user to create
     * @returns {Promise<User>}
     */
    async create(user: UserRegisterDto): Promise<User> {
        let { name, email, password, creationDate, lastUpdate } = user;
        name = email.split('@')[0];
        password = await hash(password, 10);
        creationDate = new Date();
        lastUpdate = new Date();
        return await this.userRepository.save({ name, email, password, creationDate, lastUpdate });
    }

    /**
     * Return all user
     * @returns {Promise<User[]>}
     */
    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    /**
     * Find user by id
     * @param {number} id 
     * @returns {Promise<User>}
     */
    async findOne(id: number): Promise<User> {
        return await this.userRepository.findOne(id);
    }

    /**
     * Find user by email
     * @param {string} email
     * @returns {Promise<User>}
     */
    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({ email });
    }

    /**
     * Update a user
     * @param {User} user user to update
     * @returns {Promise<User>}
     */
    async save(user: User): Promise<User> {
        user.lastUpdate = new Date();
        return await this.userRepository.save(user);
    }

    /**
     * Delete a user
     * @param {User} user user to update to delete
     * @returns {Promise<User>}
     */
    async delete(user: User): Promise<User> {
        user.deleted = true;
        return await this.userRepository.save(user);
    }
}