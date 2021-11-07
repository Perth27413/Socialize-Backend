import { EntityRepository, Repository } from "typeorm";
import { PostLikedEntity } from "../database/entities/PostLikedEntity";

@EntityRepository(PostLikedEntity)
export class PostLikedRepository extends Repository<PostLikedEntity> { }