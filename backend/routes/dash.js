const express = require('express')
const db =require('../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../Middleware/authmiddleware')

router.get('/staff',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{
    try {
        const [[staff]] = await db.query(`select count(*)as total from tb_member where role='ฝ่ายบุคลากร'`)
        const [[eva]] = await db.query(`select count(*)as total from tb_member where role='ผู้รับการประเมินผล'`)
        const [[commit]] = await db.query(`select count(*)as total from tb_member where role='กรรมการประเมิน'`)
        const [[evaCount]] = await db.query(`select count(*)as total from tb_eva`)
        const [[y]] = await db.query(`select count(*)as total from tb_eva where status_eva=3`)
        const [[n]] = await db.query(`select count(*)as total from tb_eva where status_eva!=3`)
        res.json({
            box:[
                {title:'ฝ่ายบุคลากรทั้งหมด',value:staff.total || 0, icon:'mdi-account-tie',color:'#647687'},
                {title:'ผู้รับการประเมินทั้งหมด',value:eva.total || 0, icon:'mdi-account-school',color:'#4453ae'},
                {title:'กรรมประเมินทั้งหมด',value:commit.total || 0, icon:'mdi-account-star',color:'#007fff'},
            ],
            box2:[
                {title:'แบบประเมินทั้งหมด',value:evaCount.total || 0, icon:'mdi-file-document-multiple',color:'blue'},
                {title:'แบบประเมินที่ประเมินผลแล้ว',value:evaCount.total > 0 ? `${(y.total*100/evaCount.total).toFixed(2)}%` : '00.00%',icon:'mdi-check-circle',color:'success'},
                {title:'แบบประเมินที่ยังไม่ได้ประเมิน',value:evaCount.total > 0 ? `${(n.total*100/evaCount.total).toFixed(2)}%` : '00.00%',icon:'mdi-clock-alert',color:'error'},
            ]
        })
    } catch (error) {
        console.error('Error get',error)
        res.status(500).json({message:'Error get'})
    }
})

router.get('/eva',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const [[evaCount]] = await db.query(`select count(*)as total from tb_member m,tb_eva e where e.id_member=? and e.id_member=m.id_member`,[id_member])
        const [[y]] = await db.query(`select count(*)as total from tb_member m,tb_eva e where e.id_member=? and e.id_member=m.id_member and status_eva!=1`,[id_member])
        const [[n]] = await db.query(`select count(*)as total from tb_member m,tb_eva e where e.id_member=? and e.id_member=m.id_member and status_eva=1`,[id_member])
        res.json({
            
            box:[
                {title:'แบบประเมินทั้งหมด',value:evaCount.total || 0},
                {title:'แบบประเมินที่ประเมินผลแล้ว',value:evaCount.total > 0 ? `${(y.total*100/evaCount.total).toFixed(2)}%` : '00.00%'},
                {title:'แบบประเมินที่ยังไม่ได้ประเมิน',value:evaCount.total > 0 ? `${(n.total*100/evaCount.total).toFixed(2)}%` : '00.00%'},
            ]
        })
    } catch (error) {
        console.error('Error get',error)
        res.status(500).json({message:'Error get'})
    }
})

module.exports = router