import express, {Request, Response} from 'express'
import cors from 'cors'
import { createConnection } from "typeorm"
import { CommentController } from './controller/CommentController'
import { PostController } from './controller/PostController'
import { TypeController } from './controller/TypeController'
import { UserController } from './controller/UserController'

class Server {
  private app: express.Application
  private typeController: TypeController
  private userController: UserController
  private postController: PostController
  private commentController: CommentController

  constructor(){
    this.app = express()
    this.configuration()
    this.routes()
  }

  public configuration() {
    this.app.set('port', process.env.PORT || 3000)
    this.app.use(express.json())
    this.app.use(cors())
  }

  public async routes(){
    await createConnection({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "12345678",
      database: "postgres",
      entities: ["build/database/entities/**/*.js"],
      synchronize: false,
      name: 'postgres'
    })

    this.typeController = new TypeController()
    this.userController = new UserController()
    this.postController = new PostController()
    this.commentController = new CommentController()

    this.app.get( "/", (req: Request, res: Response ) => {
      res.send( "Hello world!" )
    })

    this.app.use('/api/type/', this.typeController.router)
    this.app.use('/api/user/', this.userController.router)
    this.app.use('/api/post/', this.postController.router)
    this.app.use('/api/comment/', this.commentController.router)

  }

  public start(){
    this.app.listen(this.app.get('port'), () => {
      console.log(`Server is listening ${this.app.get('port')} port.`)
    })
  }
}

const server = new Server()
server.start()
