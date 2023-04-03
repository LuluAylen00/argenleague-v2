import * as express from "express";
const app = express.Router();
import {mainController} from '../controllers/mainController';

app.get("/", mainController.home);

app.get("/api/players/:tier", mainController.apiList);

app.get("/api/groups/:tier", mainController.apiGroups);

app.post("/api/groups", mainController.apiSetGroup);

app.delete("/api/groups", mainController.apiRemoveGroup);

app.get("/api/group-phase/:tier", mainController.apiShowGroups);

app.post("/api/group-phase/:tier", mainController.apiSetWinner);

app.put("/api/group-phase/:tier", mainController.apiUpdateMatchInfo);


export {app as indexRoutes}