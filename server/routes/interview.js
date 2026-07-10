import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { analyzeResume, finishInterview, generateQuestion, getMyInterviews, getInterviewReport,submitAnswer } from "../controller/interview.controller.js";
import {upload} from "../middlewares/multer.js";
const interviewRouter = express.Router();
interviewRouter.post('/resume',isAuth,upload.single("resume"),analyzeResume)
interviewRouter.post('/generate-question',isAuth,generateQuestion)
interviewRouter.post('/submit-answer',isAuth,submitAnswer)
interviewRouter.post('/finish',isAuth,finishInterview)
interviewRouter.get('/get-interview',isAuth,getMyInterviews)
interviewRouter.get('/report/:id',isAuth,getInterviewReport)
export default interviewRouter;