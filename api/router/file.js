import express from "express";
import {
    uploadHandler,
    getAllHandler,
    downloadHandler,
    downloadAllHandler,
    deleteHandler,
    deleteManyHandler
} from "../controller/fileOpController.js";
const fileRouter = express.Router();

fileRouter.post('/upload', uploadHandler);
fileRouter.get('/fetch-all', getAllHandler);
fileRouter.get('/download/:id', downloadHandler);
fileRouter.get('/download-zip', downloadAllHandler);
fileRouter.delete('/:fileId', deleteHandler);
fileRouter.post('/delete-many', deleteManyHandler);

export default fileRouter;