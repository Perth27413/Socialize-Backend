import { EntityRepository, Repository } from "typeorm";
import { FollowEntity } from "../database/entities/FollowEntity";

@EntityRepository(FollowEntity)
export class FollowRepository extends Repository<FollowEntity> { }