import * as functions from 'firebase-functions';
import {Response,NextFunction,Request} from 'express'
const express=require('express')
const cors=require("cors")
const admin = require('firebase-admin')
declare module 'express-serve-static-core' {
  interface Request {
    currentUser: string | any
  }
}
admin.initializeApp();
const app = express();
app.use(cors({origin:true}))
// Decodes the Firebase JSON Web Token

/**
 * Decodes the JSON Web Token sent via the frontend app
 * Makes the currentUser (firebase) data available on the body.
 */
async function decodeIDToken(req: Request, res: Response, next: NextFunction) {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req['currentUser'] = decodedToken;

    } catch (err) {
      console.log(err);
    }
  }else{
    res.json({msg:`wrong ${req.headers?.authorization?.startsWith('Bearer ')}`})
  }
console.log("hello")
  next();
}
app.use(decodeIDToken);
app.post('/', (req:Request, res:Response) => {

    const user = req['currentUser'];

    if (!user) { 
        res.status(403).send('You must be logged in!');
    }else{
      res.json({msg:true})
    }
})
exports.loggedin = functions.https.onRequest(app);
//https://us-central1-rocketauth-d71f0.cloudfunctions.net/loggedin