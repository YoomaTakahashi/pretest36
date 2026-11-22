const express = require('express')
const bc = require('bcrypt')
const db = require('../../db')
const {verifyToken,requireRole} = require('../../Middleware/authmiddleware')
const router = express.Router()
const crypto = require('crypto')

router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {fname,lname,email,username,password,role} = req.body
        const hash = await bc.hash(password,10)
        const [rows] = await db.query(`insert into tb_member(fname,lname,email,username,password,role,statusPw) values(?,?,?,?,?,?,'n')`,[fname,lname,email,username,hash,role])
        res.json({rows,message:"save success"})
    } catch (error) {
        console.error("error save",error);
        res.status(500).json({message:"error save"})
    }
})

router.put('/update/:id_member',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_member} = req.params
        const {fname,lname,email,username,password,role} = req.body
        if(password && password.trim()){
            const hash = await bc.hash(password,10)
            const [rows] = await db.query(`update tb_member set fname=?,lname=?,email=?,username=?,password=?,role=? where id_member=?`,[fname,lname,email,username,hash,role,id_member])
            res.json({rows,message:"update success"})
        }else{
            const [rows] = await db.query(`update tb_member set fname=?,lname=?,email=?,username=?,role=? where id_member=?`,[fname,lname,email,username,role,id_member])
            res.json({rows,message:"update success"})
        }
        
    } catch (error) {
        console.error("error update",error);
        res.status(500).json({message:"error update"})
    }
})

router.put('/resetPw/:id_member',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_member} = req.params
        const [rows] = await db.query(`select role from tb_member where id_member=?`,[id_member])
        const m = rows[0]
        if(m.role === 'ฝ่ายบุคลากร'){
            return res.status(403).json({message:"ไม่สามารถรีเซ็ตรหัสผ่านได้"})
        }
        let tempPw = ''
        const chars = 'ABCDEFGHIJKLMNOPKRSTUVWXYZ1234567890'
        for (let i = 0; i < 8; i++)tempPw += chars[crypto.randomInt(chars.length)]
        const hash = await bc.hash(tempPw,10)
        await db.query(`update tb_member set password=? , statusPw='y' where id_member=?`,[hash,id_member])
        res.json({tempPw,message:"รีเซ็ตรหัสผ่านสำเร็จ"})
    } catch (error) {
        console.error("error update",error);
        res.status(500).json({message:"error update"})
    }
})

router.delete('/delete/:id_member',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_member} = req.params

        const [rows] = await db.query(`delete from tb_member where id_member=?`,[id_member])
        res.json({rows,message:"delete success"})

        
    } catch (error) {
        console.error("error delete",error);
        res.status(500).json({message:"error delete"})
    }
})

router.get('/pick/:id_member',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {
        const {id_member} = req.params

        const [rows] = await db.query(`select id_member,fname,lname,email,username,role from tb_member where id_member=?`,[id_member])
        res.json(rows[0])

        
    } catch (error) {
        console.error("error get",error);
        res.status(500).json({message:"error get"})
    }
})

router.get('/showE',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {

        const [rows] = await db.query(`select * from tb_member where role='ผู้รับการประเมินผล' order by id_member desc`)
        res.json(rows)

        
    } catch (error) {
        console.error("error get",error);
        res.status(500).json({message:"error get"})
    }
})

router.get('/showC',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try {

        const [rows] = await db.query(`select * from tb_member where role='กรรมการประเมิน' order by id_member desc`)
        res.json(rows)

        
    } catch (error) {
        console.error("error get",error);
        res.status(500).json({message:"error get"})
    }
})

module.exports = router