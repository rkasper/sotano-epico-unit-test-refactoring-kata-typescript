import { DB } from "https://deno.land/x/sqlite@v3.9.0/mod.ts";
import { assertEquals } from "https://deno.land/std@0.204.0/testing/asserts.ts";
import { createApp } from "../src/app.ts";

const TEST_DB_PATH = "test_catalog.db";

function setupTestDb(): DB {
    const db = new DB(TEST_DB_PATH);
    const schema = Deno.readTextFileSync("schema.sql");
    db.execute(schema);

    // Insert test data
    db.query("INSERT INTO artists (name, genre) VALUES (?, ?)", ["Sótano Épico", "Metal"]);
    db.query("INSERT INTO albums (artist_id, title, release_year) VALUES (?, ?, ?)", [1, "Interstate Jungle Dynamite", 2023]);

    return db;
}

function teardownTestDb(db: DB) {
    db.close();
    Deno.removeSync(TEST_DB_PATH);
}

Deno.test("API Tests", async (t) => {
    const db = setupTestDb();
    const app = createApp(TEST_DB_PATH);  // Pass the test database path to the app

    // Start the server
    const controller = new AbortController();
    const { signal } = controller;
    const serverPromise = app.listen({ port: 8000, signal });

    await t.step("Add Artist", async () => {
        const response = await fetch(`http://localhost:8000/artist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "New Artist", genre: "Rock" }),
        });
        assertEquals(response.status, 201);
        const data = await response.json();
        assertEquals(data, { message: "Artist added successfully" });
    });

    await t.step("Get Artist", async () => {
        const response = await fetch(`http://localhost:8000/artist/1`);
        assertEquals(response.status, 200);
        const data = await response.json();
        assertEquals(data, { id: 1, name: "Sótano Épico", genre: "Metal" });
    });

    await t.step("Add Album", async () => {
        const response = await fetch(`http://localhost:8000/album`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ artist_id: 1, title: "New Album", release_year: 2024 }),
        });
        assertEquals(response.status, 201);
        const data = await response.json();
        assertEquals(data, { message: "Album added successfully" });
    });

    await t.step("Get Album", async () => {
        const response = await fetch(`http://localhost:8000/album/1`);
        assertEquals(response.status, 200);
        const data = await response.json();
        assertEquals(data, { id: 1, artist_id: 1, title: "Interstate Jungle Dynamite", release_year: 2023 });
    });

    // Stop the server
    controller.abort();
    await serverPromise;

    // Teardown
    teardownTestDb(db);
});
