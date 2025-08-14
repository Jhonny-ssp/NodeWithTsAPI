import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { courses } from '../database/schema.ts'
import { db } from '../database/client.ts'
import z from 'zod'

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  
    server.get( "/courses", {
      
        schema: {
        tags: ["courses"],
        
        summary: "Get all courses",
        
        response: {
          200: z.object({
            courses: z.array(
              z.object({
                id: z.string().uuid(),
                title: z.string(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      // SELECT id, title FROM courses
      const result = await db
        .select({
          id: courses.id,
          title: courses.title,
        })
        .from(courses);

      return reply.send({ courses: result});
    }
  );
};

// As funcoes acima vem da lib ZOD


// Em metodos HTTP, SEMPRE RETORNAR UM OBJETO
