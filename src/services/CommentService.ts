import { getConnection } from 'typeorm';
import { CommentEntity } from '../database/entities/CommentEntity';
import { CommentLikedEntity } from '../database/entities/CommentLikedEntity';
import { PostEntity } from '../database/entities/PostEntity';
import { UserEntity } from '../database/entities/UserEntity';
import CommentModel from '../models/Comments/CommentModel';
import CommentPageModel from '../models/Comments/CommentPageModel';
import { CommentLikedRepository } from '../repository/CommentLIkedRepository';
import { CommentRepository } from '../repository/CommentRepository';
import { PostRepository } from '../repository/PostRepository';
import { UserRepository } from '../repository/UserRepository';

export class CommentService {
  private commentRepository: CommentRepository
  private commentLikedRepository: CommentLikedRepository
  private userRepository: UserRepository
  private postRepository: PostRepository

  constructor() {
    this.commentRepository = getConnection("postgres").getCustomRepository(CommentRepository)
    this.commentLikedRepository = getConnection("postgres").getCustomRepository(CommentLikedRepository)
    this.userRepository = getConnection("postgres").getCustomRepository(UserRepository)
    this.postRepository = getConnection("postgres").getCustomRepository(PostRepository)
  }
  
  public async getCommentByPostId(request: CommentRequestModel): Promise<CommentPageModel> {
    try {
      let comments: Array<CommentEntity> = await this.commentRepository.find({relations: ['post', 'owner'], where: {post: {id: request.postId}}, order: {createdAt: 'DESC'}})
      const result: CommentPageModel = new CommentPageModel
      result.postId = request.postId
      result.comments = await this.mapCommentEntityToCommentModel(comments, request.userId)
      return result
    } catch (error) {
      console.error(error)
    }
    return new CommentPageModel
  }

  public async commentLiked(request: CommentLikedRequestModel): Promise<string> {
    try {
      const commentsLiked: Array<CommentLikedEntity> = await this.commentLikedRepository.find({where: {comment: request.commentId, userId: request.userId}, relations: ['comment', 'userId']})
      if (commentsLiked.length) {
        this.commentLikedRepository.delete(commentsLiked[0])
      } else {
        const liked: CommentLikedEntity = new CommentLikedEntity
        liked.comment = request.commentId
        liked.userId = request.userId
        await this.commentLikedRepository.save(liked)
      }
      return 'Comment Like Successed'
    } catch (error) {
      console.error(error)
    }
    return ''
  }

  public async addComment(request: CommentAddRequestModel): Promise<CommentPageModel> {
    try {
      const comment: CommentEntity = new CommentEntity
      comment.contents = request.contents
      comment.owner = await this.userRepository.findOne({where: {id: request.userId}}) as UserEntity
      comment.post = await this.postRepository.findOne({where: {id: request.postId}}) as PostEntity
      comment.createdAt = new Date()
      comment.updatedAt = new Date()
      await this.commentRepository.save(comment)
      const getCommentRequest: CommentRequestModel = {
        postId: request.postId,
        userId: request.userId
      }
      const result: CommentPageModel = await this.getCommentByPostId(getCommentRequest)
      return result
    } catch (error) {
      console.error(error)
    }
    return new CommentPageModel
  }

  private async mapCommentEntityToCommentModel(comments: Array<CommentEntity>, currentUserId: number): Promise<Array<CommentModel>> {
    const results: Array<CommentModel> = []
    for await (const item of comments) {
      const liked: Array<CommentLikedEntity> = await this.commentLikedRepository.find({where: {comment: item.id}, relations: ['comment', 'userId']})
      const isLiked: boolean = (await this.commentLikedRepository.find({where: {comment: item.id, userId: currentUserId}, relations: ['comment', 'userId']})).length > 0
      const comment: CommentModel = new CommentModel
      comment.id = item.id
      comment.contents = item.contents
      comment.date = item.createdAt
      comment.liked = liked.length
      comment.isLiked = isLiked
      comment.owner = {
        id: item.owner.id,
        firstName: item.owner.firstName,
        lastName: item.owner.lastName,
        profilePicture: item.owner.profilePicture
      }
      results.push(comment)
    }
    return results
  }
}