import { fastifySwagger } from "@fastify/swagger"
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from "fastify-type-provider-zod"

import fastify from "fastify"

import { createCourseRoute } from "./src/routes/create-course.ts"
import { getCourseByIdRoute } from "./src/routes/get-course-by-id.ts"
import { getCoursesRoute } from "./src/routes/get-courses.ts"

import scalarAPIReference from "@scalar/fastify-api-reference"
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
}).withTypeProvider<ZodTypeProvider>()

if(process.env.NODE_ENV === 'development') {
        server.register(fastifySwagger, {
        openapi: {
            info: {
                title: "Desafio Node.js",
                version: '1.0.0'
            }
        },

        transform: jsonSchemaTransform
    })  

    server.register(scalarAPIReference, {
        routePrefix: '/reference',
    })
}

server.setSerializerCompiler(serializerCompiler) 
server.setValidatorCompiler(validatorCompiler) // Valida os metodos HTTP

server.register(createCourseRoute)
server.register(getCourseByIdRoute)
server.register(getCoursesRoute)

server.listen({port: 3333}).then(() => {
    console.log("Servidor rodando")
})