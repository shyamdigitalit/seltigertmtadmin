import express from "express";
import fileUpload from "../middleware/fileUpload.js";
import {
    uploadHandler,
    getAllHandler,
    downloadHandler,
    downloadAllHandler,
    deleteHandler,
    deleteManyHandler
} from "../controller/fileOpController.js";
const fileRouter = express.Router();

fileRouter.post('/upload', fileUpload.fields([{ name: 'files', maxCount: 10 }]), uploadHandler);
fileRouter.get('/fetch-all', getAllHandler);
fileRouter.get('/download/:id', downloadHandler);
fileRouter.get('/download-zip', downloadAllHandler);
fileRouter.delete('/:fileId', deleteHandler);
fileRouter.post('/delete-many', deleteManyHandler);

export default fileRouter;