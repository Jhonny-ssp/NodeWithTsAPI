import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { courses } from '../database/schema.ts'
import { db } from '../database/client.ts'
import z from 'zod'

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
    
    server.post("/courses", { 
        schema: {
            tags: ['courses'],
            summary: "Create a course",
            description: "Essa rota recebe um titulo e cria um curso no Banco de dados",
            body: z.object({
                title: z.string().min(5, "Titulo precisa ter mais que 5 caracteres")
            }),
            response: {
                201: z.object({courseId: z.uuid()}).describe('Curso criado com sucesso')
            }

        }    // Validacao do corpo da requisicao, tudo feito por objetos
    }, async (request, reply) => {
        
        const courseTitle = request.body.title
    
        const result = await db
            .insert(courses)
            .values({ title: courseTitle })
            .returning() // Retorna o valor(es) inserido
            // Banco de dados sempre retorna array
    
        return reply.status(201).send({ courseId: result[0].id })
    })
}



// As funcoes acima vem da lib ZOD


// Em metodos HTTP, SEMPRE RETORNAR UM OBJETO
