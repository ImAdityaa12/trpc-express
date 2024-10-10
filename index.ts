import express, { Express, Request, Response } from "express";
import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { z } from "zod";
const app: Express = express();
const port = process.env.PORT || 3000;
type Context = {};
const createContext =
  ({}: trpcExpress.CreateExpressContextOptions): Context => ({});

//create a router
const t = trpc.initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;
const appRouter = router({
  greeting: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello, ${input.name}!`,
      };
    }),

  createUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(({ input }) => {
      // Here you would typically save to a database
      return {
        id: "1",
        ...input,
      };
    }),
});
export type AppRouter = typeof appRouter;
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(7000, () => {
  console.log(`[server]: Server is running at http://localhost:7000`);
});
