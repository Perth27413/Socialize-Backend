import { EntityRepository, Repository } from "typeorm";
import { PostEntity } from "../database/entities/PostEntity"

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> { }