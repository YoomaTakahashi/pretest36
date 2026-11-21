const express = require('express')
const bc = require('bcrypt')
const db = require('../../db')
const {verifyToken,requireRole} = require('../../Middleware/authmiddleware')
const router = express.Router()
const crypto = require('crypto')

router.post('/save/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_eva} = req.params
        await db.query(`delete from tb_commit where id_eva = ?`,[id_eva])
        const m = req.body
        const v = m.map(p=>[id_eva,p.id_member,'n',p.role])
        const [rows] = await db.query(`insert into tb_commit(id_eva,id_member,status_commit,level_commit) values ?`,[v])
        res.json({rows,message:"save success"})
    } catch (error) {
        console.error("error save",error);
        res.status(500).json({message:"error save"})
    }
})

router.delete('/delete/:id_commit',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_commit} = req.params

        const [rows] = await db.query(`delete from tb_commit where id_commit=?`,[id_commit])
        res.json({rows,message:"delete success"})

        
    } catch (error) {
        console.error("error delete",error);
        res.status(500).json({message:"error delete"})
    }
})


router.get('/header/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_eva} = req.params
        const [rows] = await db.query(`select * from tb_eva e,tb_system s,tb_member m where id_eva=? and e.id_sys = s.id_sys and e.id_member = m.id_member order by id_eva desc`,[id_eva])
        res.json(rows[0])

        
    } catch (error) {
        console.error("error get",error);
        res.status(500).json({message:"error get"})
    }
})

router.get('/member/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_eva} = req.params
        const [pick] = await db.query(`select id_member,concat(fname,' ',lname)as fullname_commit from tb_member where role='กรรมการประเมิน' order by id_member desc`)
        const [picked] = await db.query(`select m.id_member,fname,lname,c.id_commit,level_commit as role from tb_member m,tb_eva e,tb_commit c where c.id_eva = ? and c.id_eva = e.id_eva and c.id_member = m.id_member`,[id_eva])
        res.json({pick,picked})

        
    } catch (error) {
        console.error("error get",error);
        res.status(500).json({message:"error get"})
    }
})

module.exports = router