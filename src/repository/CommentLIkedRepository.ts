import { EntityRepository, Repository } from "typeorm";
import { CommentLikedEntity } from "../database/entities/CommentLikedEntity";

@EntityRepository(CommentLikedEntity)
export class CommentLikedRepository extends Repository<CommentLikedEntity> { }