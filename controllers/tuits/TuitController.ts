/**
 * @file Controller RESTful Web service API for tuits resource
 */
import {Request,Response,Express} from "express";
import TuitDao from "../../daos/tuits/TuitDao";
import TuitControllerI  from "../../interfaces/tuits/TuitControllerI";

/**
 * @class TuitController Implements RESTful Web service API for tuits resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /users/:uid/tuits to create a new tuit instance for
 *     a given user</li>
 *     <li>GET /tuits to retrieve all the tuit instances</li>
 *     <li>GET /tuits/:tid to retrieve a particular tuit instances</li>
 *     <li>GET /users/:uid/tuits to retrieve tuits for a given user </li>
 *     <li>PUT /tuits/:tid to modify an individual tuit instance </li>
 *     <li>DELETE /tuits/:tid to remove a particular tuit instance</li>
 * </ul>
 * @property {TuitDao} tuitDao Singleton DAO implementing tuit CRUD operations
 * @property {TuitController} tuitController Singleton controller implementing
 * RESTful Web service API
 */
export default class TuitController implements TuitControllerI{
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static tuitController: TuitController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TuitController
     */
    public static getInstance = (app: Express): TuitController => {
        if(TuitController.tuitController === null) {
            TuitController.tuitController = new TuitController();
            app.get("/tuits", TuitController.tuitController.findAllTuits);
            app.get("/users/:username/tuits", TuitController.tuitController.findAllTuitsByUser);
            app.get('/users/:uid/tuits', TuitController.tuitController.findTuitsByUser);
            app.get("/tuits/:uid", TuitController.tuitController.findTuitById);
            app.post("/users/tuits", TuitController.tuitController.createTuitByUser);
            app.put("/tuits/:uid", TuitController.tuitController.updateTuit);
            app.delete("/tuits/:uid", TuitController.tuitController.deleteTuit);
            app.delete("/tuits/postedby/:postedby/delete", TuitController.tuitController.deleteTuitsByUsername);
        }
        return TuitController.tuitController;
    }

    private constructor() {}

   /**
    * Retrieves all tuits from the database and returns an array of tuits.
    * @param {Request} req Represents request from client
    * @param {Response} res Represents response to client, including the
    * body formatted as JSON arrays containing the tuit objects
    */
    findAllTuits = (req: Request, res: Response) =>
        TuitController.tuitDao.findAllTuits()
            .then(tuits => res.json(tuits));

   /**
    * Retrieves all tuits from the database for a particular user and returns
    * an array of tuits.
    * @param {Request} req Represents request from client
    * @param {Response} res Represents response to client, including the
    * body formatted as JSON arrays containing the tuit objects
    */
    findAllTuitsByUser = (req: Request, res: Response) =>
    {   
        let userId = req.params.uid === "me"
        // @ts-ignore
        && req.session['profile'] ?
        // @ts-ignore
        req.session['profile']._id :
        req.params.uid;
        TuitController.tuitDao.findTuitsByUser(userId)
        .then((tuits: any) => res.json(tuits));
    }

    /**
    * Retrieves all tuits from the database for a particular user and returns
    * an array of tuits.
    * @param {Request} req Represents request from client
    * @param {Response} res Represents response to client, including the
    * body formatted as JSON arrays containing the tuit objects
    */        
    findTuitsByUser = (req: Request, res: Response) => {
        // @ts-ignore
        let userId = req.params.uid === "me" && req.session['profile'] ? req.session['profile']._id : req.params.uid;
        TuitController.tuitDao.findTuitsByUser(userId)
        .then(tuits => res.json(tuits));
    }

   /**
    * @param {Request} req Represents request from client, including path
    * parameter tid identifying the primary key of the tuit to be retrieved
    * @param {Response} res Represents response to client, including the
    * body formatted as JSON containing the tuit that matches the user ID
    */
    findTuitById = (req: Request, res: Response) =>
        TuitController.tuitDao.findTuitById(req.params.uid)
            .then(tuits => res.json(tuits));

   /**
    * @param {Request} req Represents request from client, including body
    * containing the JSON object for the new tuit to be inserted in the
    * database
    * @param {Response} res Represents response to client, including the
    * body formatted as JSON containing the new tuit that was inserted in the
    * database
    */
    createTuitByUser = (req: Request, res: Response) => {
        let userId = req.params.uid === "me"
        // @ts-ignore
        && req.session['profile'] ?
        // @ts-ignore
        req.session['profile']._id :
        req.params.uid;
        TuitController.tuitDao.createTuitByUser(userId, req.body)
        .then((tuit: any) => res.json(tuit));
    }

    /**
    * @param {Request} req Represents request from client, including path
    * parameter tid identifying the primary key of the tuit to be removed
    * @param {Response} res Represents response to client, including status
    * on whether deleting a user was successful or not
    */
    deleteTuit = (req: Request, res: Response) =>
        TuitController.tuitDao.deleteTuit(req.params.uid)
            .then(status => res.json(status));

    /**
    * @param {Request} req Represents request from client, including path
    * parameter tid identifying the primary key of the tuit to be modified
    * @param {Response} res Represents response to client, including status
    * on whether updating a tuit was successful or not
    */
    updateTuit = (req: Request, res: Response) =>
        TuitController.tuitDao.updateTuit(req.params.uid, req.body)
            .then(status => res.json(status));

    /**
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be removed
     * @param {Response} res Represents response to client, including status
     * on whether deleting a user was successful or not
     */
    deleteTuitsByUsername = (req: Request, res: Response) =>
        TuitController.tuitDao.deleteTuitsByUsername(req.params.postedby)
            .then(status => res.json(status));
}