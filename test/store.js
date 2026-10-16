globalThis.matchMedia = () => ({ matches: false });

const { Store } = require("../client/store");

function createStore() {
  const store = new Store();

  store.setModules([
    {
      label: "main.js",
      statSize: 35,
      groups: [
        {
          label: "lodash",
          path: "./node_modules/lodash",
          statSize: 30,
          groups: [
            {
              label: "find.js",
              path: "./node_modules/lodash/find.js",
              statSize: 10,
            },
            {
              label: "map.js",
              path: "./node_modules/lodash/map.js",
              statSize: 20,
            },
          ],
        },
        { label: "index.js", path: "./src/index.js", statSize: 5 },
      ],
    },
  ]);

  return store;
}

describe("Store", () => {
  it.each([
    ["lodash", 30],
    ["find", 10],
    ["map|index", 25],
    ["lodash|find", 30],
  ])(
    "should not count modules inside a found directory twice (%s)",
    (query, expectedSize) => {
      const store = createStore();
      store.setSearchQuery(query);

      expect(store.foundModulesSize).toBe(expectedSize);
    },
  );
});
