process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let item = { name: "popsicle", price: 1.45 };

beforeEach(function () {
  items.push(item);
});

afterEach(function () {
  items.length = 0;
});

describe("GET /items", function () {
  test("Get list of items", async function () {
    const resp = await request(app).get(`/items`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ items: [item] });
  });
});

describe("GET /items/:name", function () {
  test("Get item", async function () {
    const resp = await request(app).get(`/items/${item.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ item });
  });
  test("Respond with 404 for invalid name", async function () {
    const resp = await request(app).get(`/items/none`);
    expect(resp.statusCode).toBe(404);
  });
});

describe("POST /items", function () {
  test("Create new item", async function () {
    const resp = await request(app).post(`/items`).send({
      name: "test",
      price: 5,
    });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ items: [item, { name: "test", price: 5 }] });
  });
  test("Respond with 400 if name is missing", async function () {
    const resp = await request(app).post(`/items`).send();
    expect(resp.statusCode).toBe(400);
  });
});

describe("Patch /items/:name", function () {
  test("Update item", async function () {
    const resp = await request(app).patch(`/items/popsicle`).send({
      name: "test",
      price: 5,
    });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ item: { name: "test", price: 5 } });
  });
  test("Respond with 404 for invalid name", async function () {
    const resp = await request(app).patch(`/items/none`).send({ name: "test" });
    expect(resp.statusCode).toBe(404);
  });
});

describe("Delete /items/:name", function () {
  test("Delete item", async function () {
    const resp = await request(app).delete(`/items/${item.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });
  });
});
