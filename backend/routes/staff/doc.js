const express = require('express')
const path = require('path')
const uploadDir = path.join(__dirname,'../../uploads/document')
const db = require('../../db')
const {verifyToken,requireRole} = require('../../Middleware/authmiddleware')
const router = express.Router()
const fs = require('fs')

router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {name_doc} = req.body
        const file = req.files?.file
        const maxSize = 10*1024*1024
        if(file.size > maxSize){
            return res.status(400).json({message:"ไฟล์มีขนาดเกิน 10MB"})
        }
        const filename = Date.now() + path.extname(file.name)
        await file.mv(path.join(uploadDir,filename))
        const [rows] = await db.query(`insert into tb_doc(name_doc,day_doc,file) values(?,CURDATE(),?)`,[name_doc,filename])
        res.json(rows)
    } catch (error) {
        console.error("error save",error);
        res.status(500).json({message:"error save"})
    }
})

router.delete('/delete/:id_topic',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_topic} = req.params

        const [rows] = await db.query(`delete from tb_topic where id_topic=?`,[id_topic])
        res.json({rows,message:"delete success"})

        
    } catch (error) {
        console.error("error delete",error);
        res.status(500).json({message:"error delete"})
    }
})


router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {

        const [rows] = await db.query(`select * from tb_topic  order by id_topic desc`)
        res.json(rows)

        
    } catch (error) {
        console.error("error get",error);
        res.status(500).json({message:"error get"})
    }
})

// router.get('/showC',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
//     try {

//         const [rows] = await db.query(`select * from tb_member where role='กรรมการประเมิน' order by id_member desc`)
//         res.json(rows)

        
//     } catch (error) {
//         console.error("error get",error);
//         res.status(500).json({message:"error get"})
//     }
// })

module.exports = router