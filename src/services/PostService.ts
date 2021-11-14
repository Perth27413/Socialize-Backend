import { getConnection, Not } from 'typeorm';
import { CommentEntity } from '../database/entities/CommentEntity';
import { CommentLikedEntity } from '../database/entities/CommentLikedEntity';
import { FollowEntity } from '../database/entities/FollowEntity';
import { PostEntity } from '../database/entities/PostEntity';
import { PostLikedEntity } from '../database/entities/PostLikedEntity';
import { PostViewedEntity } from '../database/entities/PostViewedEntity';
import { UserEntity } from '../database/entities/UserEntity';
import PostModel from '../models/Posts/PostModel';
import PostOwnerModel from '../models/Posts/PostOwnerModel';
import PostPageModel from '../models/Posts/PostPageModel';
import PostRequestModel from '../models/Posts/PostRequestModel';
import { CommentLikedRepository } from '../repository/CommentLIkedRepository';
import { CommentRepository } from '../repository/CommentRepository';
import { FollowRepository } from '../repository/FollowRepository';
import { PostLikedRepository } from '../repository/PostLikedRepository';
import { PostRepository } from '../repository/PostRepository';
import { PostViewedRepository } from '../repository/PostViewedRepository';
import { UserRepository } from '../repository/UserRepository';

export class PostService {
  private postRepository: PostRepository
  private userRepository: UserRepository
  private postLikedRepository: PostLikedRepository
  private postViewedRepository: PostViewedRepository
  private commentRepository: CommentRepository
  private commentLikedRepository: CommentLikedRepository

  constructor() {
    this.postRepository = getConnection("postgres").getCustomRepository(PostRepository)
    this.userRepository = getConnection("postgres").getCustomRepository(UserRepository)
    this.postLikedRepository = getConnection("postgres").getCustomRepository(PostLikedRepository)
    this.postViewedRepository = getConnection("postgres").getCustomRepository(PostViewedRepository)
    this.commentRepository = getConnection("postgres").getCustomRepository(CommentRepository)
    this.commentLikedRepository = getConnection("postgres").getCustomRepository(CommentLikedRepository)
  }
  
  public async getAllPostByUserId(request: PostRequestModel): Promise<PostPageModel> {
    try {
      const pageItem: number = 5
      let allPosts: Array<PostEntity> = await this.postRepository.find()
      if (request.isCurrent) {
        allPosts = await this.postRepository.find({where: {owner: {id: request.userId}}})
      }
      const posts: Array<PostEntity> = await this.postRepository.find({
        relations: ['owner'],
        where: {owner: {id: request.isCurrent ? request.userId : Not(request.userId)}},
        order: {
          createdAt: 'DESC'
        },
        skip: (request.page * pageItem) - pageItem,
        take: pageItem
      })
      const results: PostPageModel = new PostPageModel()
      results.currentPage = request.page
      results.pageItem = pageItem
      results.totalPage = Math.ceil(allPosts.length / pageItem)
      results.posts = await this.mapPostEntityToPostResponse(posts, request.currentUserId)
      return results
    } catch (error) {
      console.error(error)
    }
    return new PostPageModel
  }

  public async deletePost(postId: number): Promise<string> {
    try {
      const postLiked: Array<PostLikedEntity> = await this.postLikedRepository.find({where: {post: postId}})
      const postViewed: Array<PostViewedEntity> = await this.postViewedRepository.find({where: {post: postId}})
      const comments: Array<CommentEntity> = await this.commentRepository.find({where: {post: postId}})
      for await (const item of comments) {
        const commentliked: Array<CommentLikedEntity> = await this.commentLikedRepository.find({where: {comment: item.id}})
        await this.commentLikedRepository.remove(commentliked)
      }
      const post: PostEntity = await this.postRepository.findOne({where: {id: postId}, relations: ['owner']}) as PostEntity
      await this.postLikedRepository.remove(postLiked)
      await this.postViewedRepository.remove(postViewed)
      await this.commentRepository.remove(comments)
      await this.postRepository.remove(post)
      return 'success'
    } catch (error) {
      console.error(error)
    }
    return ''
  }

  public async postLiked(request: PostLikedRequestModel): Promise<PostLikedReponseModel> {
    try {
      const posts: Array<PostLikedEntity> = await this.postLikedRepository.find({where: {post: request.postId, user: request.userId}, relations: ['post', 'user']})
      if (posts.length) {
        await this.postLikedRepository.delete(posts[0])
      } else {
        const liked: PostLikedEntity = new PostLikedEntity
        liked.post = request.postId
        liked.user = request.userId
        await this.postLikedRepository.save(liked)
      }
      const liked: Array<PostLikedEntity> = await this.postLikedRepository.find({where: {post: request.postId}, relations: ['post', 'user']})
      const isLiked: boolean = (await this.postLikedRepository.find({where: {post: request.postId, user: request.userId}, relations: ['post', 'user']})).length > 0
      const result: PostLikedReponseModel = {
        isLiked: isLiked,
        liked: liked.length
      }
      return result
    } catch (error) {
      console.error(error)
    }
    return new PostLikedReponseModel
  }

  public async addPost(request: PostAddRequestModel) {
    try {
      const post: PostEntity = new PostEntity
      post.contents = request.contents
      post.picture = request.picture.join(',')
      post.owner = await this.userRepository.findOne({where: {id: request.userId}}) as UserEntity
      post.createdAt = new Date()
      post.updatedAt = new Date()
      this.postRepository.save(post)
      return 'Add Post Successfully'
    } catch (error) {
      console.error(error)
    }
    return ''
  }

  private async mapPostEntityToPostResponse(posts: Array<PostEntity>, currentUserId: number): Promise<Array<PostModel>> {
    let results: Array<PostModel> = []
    for await (const item of posts) {
      const liked: Array<PostLikedEntity> = await this.postLikedRepository.find({where: {post: item.id}, relations: ['post', 'user']})
      const isLiked: boolean = (await this.postLikedRepository.find({where: {post: item.id, user: currentUserId}, relations: ['post', 'user']})).length > 0
      let isViewed: boolean = (await this.postViewedRepository.find({where: {post: item.id, user: currentUserId}, relations: ['post', 'user']})).length > 0
      if (!isViewed) {
        let postViewed: PostViewedEntity = new PostViewedEntity
        postViewed.post = item.id
        postViewed.user = currentUserId
        this.postViewedRepository.save(postViewed)
        isViewed = true
      }
      const viewed: Array<PostViewedEntity> = await this.postViewedRepository.find({where: {post: item.id}, relations: ['post', 'user']})
      let post: PostModel = new PostModel()
      post.id = item.id,
      post.contents = item.contents
      post.picture = item.picture?.split(',') ?? []
      post.date = item.createdAt
      post.liked = liked.length
      post.isLiked = isLiked
      post.viewed = viewed.length
      post.isViewed = isViewed
      post.owner = {
        id: item.owner.id,
        firstName: item.owner.firstName,
        lastName: item.owner.lastName,
        details: item.owner.details ?? '',
        profilePicture: item.owner.profilePicture ?? ''
      }
      results.push(post)
    }
    return results
  }

}