import { EntityRepository, Repository } from "typeorm";
import { UserEntity } from "../database/entities/UserEntity";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> { }