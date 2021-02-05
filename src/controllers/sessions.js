const Student = require("../models/Student");
const bcrpy = require("bcryptjs");
const auth = require("../config/auth.json");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils");
module.exports = {
    async store(req, res) {
        const {email, password} = req.body;
        //traz os dados
        try {
            const student = await Student.findOne({
                where: {
                    email
                }
            })
//faz uma comparação para ver se os dados existem
            if(!student || !bcrpy.compareSync(password, student.password))
                return res.status(403).send({error: "Usuário e/ou senha invalidos"})
            // passa os dados no payload do token
            const token = generateToken({
                studentId: student.id,
                 studentName: student.name
            })

            
        //envia a resposta se os dados foram criados
            res.status(201).send({
                student: {
                    studentId: student.id,
                    name : student.name,
                    ra: student.ra,
                    email: student.email
                },
                token
            })
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}