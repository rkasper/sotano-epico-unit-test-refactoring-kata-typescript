# Sótano Épico Records Unit Test Refactoring Kata (TypeScript/Deno Version)

## Introduction

Welcome to **[Sótano Épico Records](http://sotanoepicorecords.com)**! We're a passionate and growing record label, home to a diverse roster of artists, including our first and namesake band, [Sótano Épico](http://sotanoepico.com). Our journey began with a humble catalog tracking system, a legacy codebase crafted by the enigmatic and somewhat sinister developer, Dr. Codenstern. One fateful day, Dr. Codenstern took a brief sabbatical to the enigmatic land of Null Island and, in a twist of fate, never returned.

As our catalog expands, so does the need to evolve our system. We're excited to introduce a new feature to our catalog system: the ability to add and retrieve reviews for our albums. But there's a catch! Our existing system, while functional, is a labyrinth of legacy code with tests that are far from being true micro-scale unit tests.

Your mission, should you choose to accept it, is to dive into the depths of Sótano Épico's codebase, refactor the existing tests into genuine micro-scale unit tests, and perhaps even reshape the production code along the way.

## Existing Features

- **View Artist Information:** Retrieve details of an artist, including name and genre.
- **View Album Information:** Access details of an album, such as title and release year.
- **Add Artist/Album:** Capability to expand our catalog with new artists and albums.

## New Feature

- **Add/Get Review:** A new endpoint to add and retrieve reviews for albums, enhancing the interaction with our catalog.

## Running the System

### Prerequisites

- [Deno](https://deno.land/) installed on your system

### Starting the Server

Run the following command in the project root:

```bash
deno --allow-read --allow-write --allow-net src/app.ts
```

### Interacting with the Application Using `curl`

Once the server is running, you can interact with it using `curl` commands. Here are some examples:

- **Add an Artist:**
```
curl -X POST http://localhost:8000/artist -H "Content-Type: application/json" -d '{"name":"Sótano Épico","genre":"Metal"}'
```
- **Get Artist Information:**
```
curl http://localhost:8000/artist/1
```
- **Add an Album:**
```
curl -X POST http://localhost:8000/album -d '{"artist_id":1,"title":"Interstate Jungle Dynamite","release_year":2023}'
```
- **Get Album Information:**
```
curl http://localhost:8000/album/1
```

## Running the Tests

Run the tests using the following command:

```bash
deno test --allow-read --allow-write --allow-net
```

## Your Task

1. **Refactor the Tests:** Transform the existing tests into true micro-scale unit tests. This may involve using mocking and stubbing techniques.
2. **Refactor the Code:** As you work through the tests, you might find opportunities to refactor the production code for better testability and maintainability.
3. **Add the New Feature:** Implement the functionality to add and retrieve album reviews, along with corresponding tests.

## Project Exploration Activity

To get familiar with the project structure and its components, let's dive into a short exploration activity. This will help you understand the role of each file in the project. Below are some questions to guide your exploration:

1. **Identify the Files:**
    - What is the filename of the tests?
    - What is the filename of the production code?
    - List all other files you find in the project.

2. **Understand the Purpose:**
    - What is the purpose of the `app.ts` file?
    - Describe what the `app_test.ts` file is used for.
    - Explain the role of any database-related files you find.

3. **Reflect and Question:**
    - Are there any files or parts of the code that you don't understand or find confusing?
    - Write down any questions or uncertainties you have about the project structure.

## Test-Refactoring Activity

Now that you're familiar with the project structure, the next step is to refactor the tests to transform them into true micro-scale unit tests. This activity will be carried out in several stages, each focusing on a specific aspect of refactoring.

Here are some suggested initial refactorings. You can apply them in any order:

### Idea 1: Factor Out the Database Methods

- **Objective:** Improve the separation between the database interaction logic and the request handlers.
- **Action:** Add automated tests for database-related methods. Move those methods to their own utilities file.
- **Expected Outcome:** The request handlers are better isolated from the database operations.

### Idea 2: Isolate Tests from the Database

- **Objective:** Ensure that tests do not directly interact with the database.
- **Action:** Introduce mocking for database interactions. Use a mocking framework to simulate database responses in the test file.
- **Expected Outcome:** Tests should no longer depend on the actual database, and should run without requiring a live database connection.

### Idea 3: Isolate Tests from the Server Context

- **Objective:** Decouple tests from the server context and HTTP requests.
- **Action:** Refactor tests to focus on the logic within request handlers, rather than testing through HTTP requests. This may involve restructuring some of the code in `app.ts` to separate logic from request handling.
- **Expected Outcome:** Tests should directly call and test the underlying logic without needing to simulate HTTP requests.

### Idea 4: Isolate Tests from JSON Formatting

- **Objective:** Ensure that tests focus on business logic and data handling, rather than the specifics of JSON response formatting.
- **Action:** Mock file system operations (like reading from or writing to files) in your tests.
- **Expected Outcome:** Tests validate the correctness of data processing or business logic, independent of data format. Tests become more focused on the application's core functionality and less brittle.

### Reflection and Next Steps

After completing each stage, reflect on the following:

- How did the behavior and reliability of the tests change after each refactoring?
- Were there any challenges or surprises during the refactoring process?
- What would be your next steps to further improve the test suite?

### Share Your Experience

Once you have completed the refactoring stages, share your experience, insights, and any challenges you faced. Discussing these with your peers or mentors can provide valuable learning opportunities and different perspectives on tackling such refactorings.

# Resources and Support

As you embark on this refactoring journey, here are some resources that might help:

- [Deno Manual](https://deno.land/manual)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Deno Testing API](https://deno.land/manual/testing)

## Acknowledgements

This Unit Test Refactoring Kata is inspired by the work of Emily Bache and her [Gilded Rose Refactoring Kata](https://github.com/emilybache/GildedRose-Refactoring-Kata). We extend our heartfelt gratitude to Emily for her contributions to the software development community and for inspiring educational exercises like this one.
