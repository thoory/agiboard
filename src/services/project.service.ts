import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { NotFoundError } from "routing-controllers";
import { Project } from '../entity/project.entity';
import { ProjectCreationDto } from '../dtos/project.dto';

@Service()
export class ProjectService {

    /**
     * @constructor
     * @param {Repository<Project>} projectRepository 
     */
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>
    ) { }

    /**
     * Create a project
     * @param {ProjectCreationDto} project project to create
     * @returns {Promise<Project>}
     */
    async create(project: ProjectCreationDto): Promise<Project> {
        let { name, description, workspace, userProjects, budget, creationDate, startDate, endDate, lastUpdate } = project;
        creationDate = new Date();
        lastUpdate = new Date();
        return await this.projectRepository.save({ name, description, workspace, userProjects, budget, creationDate, startDate, endDate, lastUpdate });
    }

    /**
     * Return all project
     * @returns {Promise<Project[]>}
     */
    async findAll(): Promise<Project[]> {
        return await this.projectRepository.find({relations: ["workspace", "userProjects"]}); //relations : to get full workspace data
    }

    /**
     * Find project by id
     * @param {number} id 
     * @returns {Promise<Project>}
     */
    async findOne(id: number): Promise<Project> {
        const result = await this.projectRepository.findOne(id);
        if (result) {
            return result;
        }
        else {
            throw new NotFoundError;
        }
    }

    /**
     * Update a project
     * @param {Project} project project to update
     * @returns {Promise<Project>}
     */
    async save(project: Project): Promise<Project> {
        return await this.projectRepository.save(project);
    }

    /**
     * Delete a project
     * @param {Project} project project to update to delete
     * @returns {Promise<Project>}
     */
    async delete(project: Project): Promise<Project> {
        project.deleted = true;
        return await this.projectRepository.save(project);
    }
}