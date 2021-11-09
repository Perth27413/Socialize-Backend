import { EntityRepository, Repository } from "typeorm";
import { RoleEntity } from "../database/entities/RoleEntity";

@EntityRepository(RoleEntity)
export class RoleRepository extends Repository<RoleEntity> { }