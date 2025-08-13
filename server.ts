// const fastify = require('fastify')
// const crypto = require('crypto')

import fastify from "fastify"
import crypto from "node:crypto"
// node: importacao ==> Padrão para imports do node nativamente, sem instalacao por fora

// Esse objeto logger serve para deixar os logs mais "legiveis" e detalhados no terminal
const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    }
})

const courses = [
     {id: "1", title: "Curso de node"},
     {id: "2", title: "Curso de React"},
     {id: "3", title: "Curso de PHP"}
]

// Em metodos HTTP, SEMPRE RETORNAR UM OBJETO
server.get("/courses", () => {
    return { courses }
})

server.get("/courses/:id", (request, reply) => {

    const courseId = request.params.id

    const course = courses.find(course => course.id === courseId )

    if(course) {
        return course
    }

    return reply.status(404).send()
})

server.post("/courses", (request, reply) => {
    const courseId = crypto.randomUUID()
    const courseTitle = request.body.title

    if(!courseTitle) {
        return reply.statusCode(400).send( {message: "Titulo obrigatório"})
    }

    courses.push( {id: courseId, courseTitle} )

    return reply.status(201).send({courseId})
})


server.listen({port: 3333}).then(() => {
    console.log("Servidor rodando")
})