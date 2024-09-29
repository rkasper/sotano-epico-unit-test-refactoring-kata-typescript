import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { DB } from "https://deno.land/x/sqlite@v3.9.0/mod.ts";

const PORT = 8000;
const BASE_URL = `http://localhost:${PORT}`;

// Ensure the app is running on port 8000 before running these tests

function setupTestDatabase(): DB {
    const db = new DB("test_catalog.db");
    const schema = Deno.readTextFileSync("schema.sql");
    db.execute(schema);

    // Insert test data
    db.query("INSERT INTO artists (name, genre) VALUES (?, ?)", ["Sótano Épico", "Metal"]);
    db.query("INSERT INTO albums (artist_id, title, release_year) VALUES (?, ?, ?)", [1, "Interstate Jungle Dynamite", 2023]);

    return db;
}

function teardownTestDatabase(db: DB) {
    db.close();
    Deno.removeSync("test_catalog.db");
}

Deno.test("API Tests", async (t) => {
    const db = setupTestDatabase();

    await t.step("Add Artist", async () => {
        const response = await fetch(`${BASE_URL}/artist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "New Artist", genre: "Rock" }),
        });
        assertEquals(response.status, 201);
        const data = await response.json();
        assertEquals(data, { message: "Artist added successfully" });
    });

    await t.step("Get Artist", async () => {
        const response = await fetch(`${BASE_URL}/artist/1`);
        assertEquals(response.status, 200);
        const data = await response.json();
        assertEquals(data, { id: 1, name: "Sótano Épico", genre: "Metal" });
    });

    await t.step("Add Album", async () => {
        const response = await fetch(`${BASE_URL}/album`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ artist_id: 1, title: "New Album", release_year: 2024 }),
        });
        assertEquals(response.status, 201);
        const data = await response.json();
        assertEquals(data, { message: "Album added successfully" });
    });

    await t.step("Get Album", async () => {
        const response = await fetch(`${BASE_URL}/album/1`);
        assertEquals(response.status, 200);
        const data = await response.json();
        assertEquals(data, { id: 1, artist_id: 1, title: "Interstate Jungle Dynamite", release_year: 2023 });
    });

    teardownTestDatabase(db);
});
