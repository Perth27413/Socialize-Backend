import { getConnection, Not } from 'typeorm';
import { FollowEntity } from '../database/entities/FollowEntity';
import { PostEntity } from '../database/entities/PostEntity';
import { PostLikedEntity } from '../database/entities/PostLikedEntity';
import { PostViewedEntity } from '../database/entities/PostViewedEntity';
import PostModel from '../models/Posts/PostModel';
import PostOwnerModel from '../models/Posts/PostOwnerModel';
import PostPageModel from '../models/Posts/PostPageModel';
import PostRequestModel from '../models/Posts/PostRequestModel';
import { FollowRepository } from '../repository/FollowRepository';
import { PostLikedRepository } from '../repository/PostLikedRepository';
import { PostRepository } from '../repository/PostRepository';
import { PostViewedRepository } from '../repository/PostViewedRepository';

export class PostService {
  private postRepository: PostRepository
  private followRepository: FollowRepository
  private postLikedRepository: PostLikedRepository
  private postViewedRepository: PostViewedRepository
  

  constructor() {
    this.postRepository = getConnection("postgres").getCustomRepository(PostRepository)
    this.followRepository = getConnection("postgres").getCustomRepository(FollowRepository)
    this.postLikedRepository = getConnection("postgres").getCustomRepository(PostLikedRepository)
    this.postViewedRepository = getConnection("postgres").getCustomRepository(PostViewedRepository)
  }
  
  public async getAllPostByUserId(request: PostRequestModel): Promise<PostPageModel> {
    try {
      const pageItem: number = 5
      const posts: Array<PostEntity> = await this.postRepository.find({
        relations: ['owner'],
        where: {owner: {id: Not(request.userId)}},
        order: {
          createdAt: 'DESC'
        },
        skip: (request.page * pageItem) - pageItem,
        take: pageItem
      })
      const results: PostPageModel = new PostPageModel()
      results.currentPage = request.page
      results.pageItem = pageItem
      results.totalPage = Math.ceil(posts.length / pageItem)
      results.posts = await this.mapPostEntityToPostResponse(posts, request.userId)
      return results
    } catch (error) {
      console.error(error)
    }
    return new PostPageModel
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
      const viewed: Array<PostViewedEntity> = await this.postViewedRepository.find({where: {post: item.id, user: currentUserId}, relations: ['post', 'user']})
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