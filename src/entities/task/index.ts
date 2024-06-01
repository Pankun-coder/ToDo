import z from "zod";

const taskBody = z.object({
  label: z.string(),
  difficulty: z.number().optional(),
  impact: z.number().optional(),
  status: z.union([z.literal("completed"), z.literal("toDo")]),
});

export type TaskBody = z.infer<typeof taskBody>;

const task = taskBody.merge(
  z.object({
    id: z.string(),
    order: z.number(),
    created: z.date(),
    updated: z.date(),
  }),
);

export type Task = z.infer<typeof task>;

export default task;
