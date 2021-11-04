import { EntityRepository, Repository } from "typeorm";
import { TypeEntity } from "../database/entities/TypeEntity";

@EntityRepository(TypeEntity)
export class TypeRepository extends Repository<TypeEntity> { }