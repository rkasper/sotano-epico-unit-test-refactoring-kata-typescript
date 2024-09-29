import { Application, Router } from "https://deno.land/x/oak@v17.0.0/mod.ts";
import { DB } from "https://deno.land/x/sqlite@v3.9.0/mod.ts";

export function createApp(dbPath: string = "catalog.db"): Application {
    const db = new DB(dbPath);

    // Initialize database if needed
    const schema = Deno.readTextFileSync("schema.sql");
    db.execute(schema);

    const app = new Application();
    const router = new Router();

    router
        // Add a new artist
        .post("/artist", async (ctx) => {
            const body = ctx.request.body;
            if (body.type() === "json") {
                const jsonData = await body.json();
                const name = jsonData.name;
                const genre = jsonData.genre;
                db.query("INSERT INTO artists (name, genre) VALUES (?, ?)", [name, genre]);
                ctx.response.status = 201;
                ctx.response.body = { message: "Artist added successfully" };
            }
        })

        // Get artist information
        .get("/artist/:id", (ctx) => {
            const id = ctx.params.id;
            const [artist] = db.query("SELECT * FROM artists WHERE id = ?", [id]);
            if (artist) {
                ctx.response.body = {
                    id: artist[0],
                    name: artist[1],
                    genre: artist[2],
                };
            } else {
                ctx.response.status = 404;
            }
        })

        // Add a new album
        .post("/album", async (ctx) => {
            const body = ctx.request.body;
            if (body.type() === "json") {
                const jsonData = await body.json();
                const artistId = jsonData.artist_id;
                const title = jsonData.title;
                const releaseYear = jsonData.release_year;
                db.query(
                    "INSERT INTO albums (artist_id, title, release_year) VALUES (?, ?, ?)",
                    [artistId, title, releaseYear]
                );
                ctx.response.status = 201;
                ctx.response.body = { message: "Album added successfully" };
            }
        })

        // Get album information
        .get("/album/:id", (ctx) => {
            const id = ctx.params.id;
            const [album] = db.query("SELECT * FROM albums WHERE id = ?", [id]);
            if (album) {
                ctx.response.body = {
                    id: album[0],
                    artist_id: album[1],
                    title: album[2],
                    release_year: album[3],
                };
            } else {
                ctx.response.status = 404;
            }
        });

    app.use(router.routes());
    app.use(router.allowedMethods());

    return app;
}

// Only start the server if this file is run directly
if (import.meta.main) {
    const app = createApp();
    console.log("Server running on http://localhost:8000");
    await app.listen({port: 8000});
}
