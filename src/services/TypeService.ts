import { getConnection } from 'typeorm';
import { TypeEntity } from '../database/entities/TypeEntity';
import { TypeRepository } from '../repository/TypeRepository';

export class TypeService {
  private typeRepository: TypeRepository

  constructor() {
    this.typeRepository = getConnection("postgres").getCustomRepository(TypeRepository)
  }
  
  public async getAllType(): Promise<TypeEntity> {
    return await this.typeRepository.findOne() || new TypeEntity
  }

  public async getTypeById(id: number): Promise<TypeEntity> {
    return await this.typeRepository.findOne({where: {id: id}}) || new TypeEntity
  }


}