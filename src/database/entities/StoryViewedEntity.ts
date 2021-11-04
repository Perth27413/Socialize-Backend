import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { StoryEntity } from "./StoryEntity"
import { UserEntity } from "./UserEntity"

@Entity('story_viewed')
export class StoryViewedEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => StoryEntity, story => story.id)
  @JoinColumn({name: 'story_id'})
  story: number

  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({name: 'user_id'})
  user: number
}