import z from "zod";

const task = z.object({
  id: z.number(),
  label: z.string(),
  difficulty: z.number(),
  impact: z.number(),
  order: z.number(),
  status: z.union([z.literal("completed"), z.literal("toDo")]),
});

export default task;
