import { EntityRepository, Repository } from "typeorm";
import { PostViewedEntity } from "../database/entities/PostViewedEntity";

@EntityRepository(PostViewedEntity)
export class PostViewedRepository extends Repository<PostViewedEntity> { }