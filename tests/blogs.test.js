Number.prototype._called = {};

const Page = require("./helper/page");
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000/");
});

afterEach(async () => {
  await page.close();
});

describe("when logged in,", async () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });

  test("can see blog create form", async () => {
    const label = await page.getContentsOf("form label");
    expect(label).toEqual("Blog Title");
  });

  describe("and using invalid inputs", async () => {
    beforeEach(async () => {
      await page.click("form button");
    });
    test("the form shows an error message", async () => {
      const titleError = await page.getContentsOf(".title .red-text");
      const contentError = await page.getContentsOf(
        ".content .red-text"
      );
      expect(titleError).toEqual("You must provide a value");
      expect(contentError).toEqual("You must provide a value");
    });
  });

  describe("and using valid inputs", async () => {
    beforeEach(async () => {
      await page.type(".title input", "My title");
      await page.type(".content input", "My content");
      await page.click("form button");
    });

    test("Submitting takes user to review screen", async () => {
      const text = await page.getContentsOf("h5");
      expect(text).toEqual("Please confirm your entries");
    });

    test("Submit then saving adds blog to index page", async () => {
      await page.waitFor("button.green");
      await page.click("button.green");
      await page.waitFor(".card");
      const title = await page.getContentsOf(".card-title");
      const content = await page.getContentsOf("p");
      expect(title).toEqual("My title");
      expect(content).toEqual("My content");
    });
  });
});

describe("User is not login", async () => {
  const actions = [
    {
      method: "get",
      path: "/api/blogs"
    },
    {
      method: "post",
      path: "/api/blogs",
      data: {
        title: "T",
        content: "C"
      }
    }
  ];

  test("Blog relate actions are prohibited", async () => {
    const results = await page.execRequests(actions);
    results.map(result => {
      expect(result).toEqual({ error: "You must log in!" });
    });
  });
  //   test("User can not create blog posts", async () => {
  //     const result = await page.post("/api/blogs", {
  //       title: "My Title",
  //       content: "My content"
  //     });
  //     expect(result).toEqual({ error: "You must log in!" });
  //   });
  //   test("User can not get a list of blog", async () => {
  //     const result = await page.get("/api/blogs");
  //     expect(result).toEqual({ error: "You must log in!" });
  //   });
});
