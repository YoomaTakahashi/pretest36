const express = require('express')
const db = require('../../db')
const {verifyToken,requireRole} = require('../../Middleware/authmiddleware')
const router = express.Router()

router.get('/:id_eva',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try {
        const {id_eva} = req.params
        const [rows] = await db.query(`select * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_eva=? and c.id_eva=e.id_eva and e.id_member=m.id_member and e.id_sys=s.id_sys order by c.id_eva desc`,[id_eva])
        res.json(rows)
    } catch (error) {
        console.error('Error get',error)
        res.status(500).json({message:'Error get'})
    }
})

module.exports = router