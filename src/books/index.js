const express = require("express")
const uniqid = require('uniqid')
const path = require("path")
const { check, body, validationResult, sanitizeBody } = require("express-validator");
const router = express.Router()
const {readJSON, writeJSON, getByID, updateData, removeData, getAllByQuery} = require("../utilities")
const fileDirectory = path.join(__dirname, "books.json");
const commentsPath = path.join(__dirname, "comments.json");


const validateBody = () => {
    return [
        check("asin")
            .exists()
            .withMessage("You should specify the asin"),
        check("title")
            .exists()
            .withMessage("title is required")
            .not()
            .isEmpty()
            .withMessage("Can't be Empty"),
        check("category")
            .exists()
            .withMessage("category is required")
            .not()
            .isEmpty()
            .withMessage("Can't be Empty"),
        check("img")
            .exists()
            .withMessage("img is required")
            .not()
            .isEmpty()
            .withMessage("Can't be Empty"),

        check("price")
            .exists()
            .withMessage("price is  required")
            .not()
            .isEmpty(),
        sanitizeBody("price").toFloat(),
    ];
};
 const validateComments = () => {
     return [

         check("username")
             .exists()
             .withMessage("username is required")
             .not()
             .isEmpty()
             .withMessage("Can't be Empty"),
         check("text")
             .exists()
             .withMessage("text is required")
             .not()
             .isEmpty()
             .withMessage("Can't be Empty"),
     ];
 }
router.route('/')
    .get(async (request, response, next)=>{
        try {
            const json = await readJSON(fileDirectory)
            response.send(json)
        } catch (e) {
            e.httpRequestStatusCode = 404
            next(e)
        }

    })
    .post( validateComments(), async(request, response, next) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({ errors: errors.array() });
            }
            let asin = request.body.asin
            let data = await writeJSON(fileDirectory, request.body, asin)
            console.log(data)
            response.send(data)

        }catch (e) {
            e.httpRequestStatusCode = 500
            next(e)
        }
    })
router.route("/:id")
    .get(async(request, response, next)=> {
        
        try{
            const param = request.params.id;
            console.log(param)
           let book = await getByID(fileDirectory, param)
            response.send(book)
        }catch (e) {
            e.httpRequestStatusCode = 500
            next(e)
        }
    })
    .put( async(request, response, next)=>{
        try{
            const param = request.params.id;
            let updatedData = await updateData(fileDirectory, param, request.body)
            response.send(updatedData)
        }catch (e) {
            e.httpRequestStatusCode = 500
            next(e)
        }
    })
    .delete(async (request, response, next)=> {
       try {
           const param = request.params.id;
           let updateData = removeData(fileDirectory, "asin",  param)
           response.send(updateData)
       } catch (e) {
           e.httpRequestStatusCode = 500
           next(e)
       }
    })

router.route('/:id/comments')
    .get(async (request, response, next)=>{
        try {
            console.log(request.params)
            const json = await getAllByQuery(commentsPath, "asin", request.params.id)
            response.send(json)
        } catch (e) {
            e.httpRequestStatusCode = 404
            next(e)
        }

    })
    .post( validateComments(), async(request, response, next) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({ errors: errors.array() });
            }
             let uniqueId = uniqid()
             let asin = request.params.id
            console.log('trying')
            let data = await writeJSON(commentsPath, request.body, asin,  uniqueId)

            response.send(data)

         }catch (e) {
            e.httpRequestStatusCode = 500
           next(e)
        }
    })
 router.route("/:id/comments/:commentID")

    .delete(async (request, response, next)=> {
        try {
            const param = request.params.commentID;
            let updateData = removeData(commentsPath, "_id", param)
            response.send(updateData)
        } catch (e) {
            e.httpRequestStatusCode = 500
            next(e)
        }
    })

module.exports = router;