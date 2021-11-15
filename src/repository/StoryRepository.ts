import { EntityRepository, Repository } from "typeorm";
import { StoryEntity } from "../database/entities/StoryEntity";

@EntityRepository(StoryEntity)
export class StoryRepository extends Repository<StoryEntity> { }