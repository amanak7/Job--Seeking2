import express from "express";
import { getalljobs,postjob,getmyjob,updateJob,deletethejob} from "../controllers/jobController.js";
import {isAuthorized} from "../middlewares/auth.js";
const router = express.Router();

router.get("/alljobs",getalljobs);
router.post("/postjobs",isAuthorized,postjob);
router.get("/myjobs",isAuthorized,getmyjob);
router.put("/update/:id",isAuthorized,updateJob);
router.delete("/delete/:id",isAuthorized,deletethejob);
export default router;