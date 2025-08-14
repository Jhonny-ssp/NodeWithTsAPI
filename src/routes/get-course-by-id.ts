import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { courses } from '../database/schema.ts'
import { db } from '../database/client.ts'
import z from 'zod'
import { eq } from "drizzle-orm" // Para usar operadores no drizze, tem que importar para usar no WHERE

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {

server.get("/courses/:id", {

    schema: {
        tags: ["courses"],
        summary: "Get course by ID",
        
        params: z.object({
            id:z.uuid()
        }),
        
        response: {
            200: z.object({
                
                course: z.object({
                    id: z.uuid(),
                    title: z.string(),
                    description: z.string().nullable()    
                }),
            }),
            404: z.null().describe("Course Not found")
        },
    },

}, async (request, reply) => {

    const courseId = request.params.id

    const result = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId))
    
    if(result.length > 0) {
        return { course: result[0]}
    }

    return reply.status(404).send()
})
 
}



// As funcoes acima vem da lib ZOD


// Em metodos HTTP, SEMPRE RETORNAR UM OBJETO
