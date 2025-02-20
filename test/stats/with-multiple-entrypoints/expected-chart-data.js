module.exports = [
  {
    label: "react-vendors.js",
    isAsset: true,
    statSize: 138490,
    groups: [
      {
        label: "../node_modules",
        path: "./../node_modules",
        statSize: 135827,
        groups: [
          {
            label: "object-assign",
            path: "./../node_modules/object-assign",
            statSize: 2108,
            groups: [
              {
                id: 320,
                label: "index.js",
                path: "./../node_modules/object-assign/index.js",
                statSize: 2108,
              },
            ],
            parsedSize: 0,
            gzipSize: 0,
          },
          {
            label: "react-dom",
            path: "./../node_modules/react-dom",
            statSize: 122051,
            groups: [
              {
                label: "cjs",
                path: "./../node_modules/react-dom/cjs",
                statSize: 120688,
                groups: [
                  {
                    id: 967,
                    label: "react-dom.production.min.js",
                    path: "./../node_modules/react-dom/cjs/react-dom.production.min.js",
                    statSize: 120688,
                  },
                ],
                parsedSize: 0,
                gzipSize: 0,
              },
              {
                id: 316,
                label: "index.js",
                path: "./../node_modules/react-dom/index.js",
                statSize: 1363,
              },
            ],
            parsedSize: 0,
            gzipSize: 0,
          },
          {
            label: "react",
            path: "./../node_modules/react",
            statSize: 6640,
            groups: [
              {
                label: "cjs",
                path: "./../node_modules/react/cjs",
                statSize: 6450,
                groups: [
                  {
                    id: 426,
                    label: "react.production.min.js",
                    path: "./../node_modules/react/cjs/react.production.min.js",
                    statSize: 6450,
                  },
                ],
                parsedSize: 0,
                gzipSize: 0,
              },
              {
                id: 784,
                label: "index.js",
                path: "./../node_modules/react/index.js",
                statSize: 190,
              },
            ],
            parsedSize: 0,
            gzipSize: 0,
          },
          {
            label: "scheduler",
            path: "./../node_modules/scheduler",
            statSize: 5028,
            groups: [
              {
                label: "cjs",
                path: "./../node_modules/scheduler/cjs",
                statSize: 4830,
                groups: [
                  {
                    id: 475,
                    label: "scheduler.production.min.js",
                    path: "./../node_modules/scheduler/cjs/scheduler.production.min.js",
                    statSize: 4830,
                  },
                ],
                parsedSize: 0,
                gzipSize: 0,
              },
              {
                id: 616,
                label: "index.js",
                path: "./../node_modules/scheduler/index.js",
                statSize: 198,
              },
            ],
            parsedSize: 0,
            gzipSize: 0,
          },
        ],
        parsedSize: 0,
        gzipSize: 0,
      },
      {
        label: "node_modules/prop-types",
        path: "./node_modules/prop-types",
        statSize: 2663,
        groups: [
          {
            id: 703,
            label: "factoryWithThrowingShims.js",
            path: "./node_modules/prop-types/factoryWithThrowingShims.js",
            statSize: 1639,
          },
          {
            id: 697,
            label: "index.js",
            path: "./node_modules/prop-types/index.js",
            statSize: 710,
          },
          {
            label: "lib",
            path: "./node_modules/prop-types/lib",
            statSize: 314,
            groups: [
              {
                id: 414,
                label: "ReactPropTypesSecret.js",
                path: "./node_modules/prop-types/lib/ReactPropTypesSecret.js",
                statSize: 314,
              },
            ],
            parsedSize: 0,
            gzipSize: 0,
          },
        ],
        parsedSize: 0,
        gzipSize: 0,
      },
    ],
    isInitialByEntrypoint: {
      "react-vendors": true,
    },
  },
  {
    label: "other-vendors.js",
    isAsset: true,
    statSize: 561135,
    groups: [
      {
        label: "node_modules",
        path: "./node_modules",
        statSize: 560989,
        groups: [
          {
            label: "isomorphic-fetch",
            path: "./node_modules/isomorphic-fetch",
            statSize: 233,
            groups: [
              {
                id: 301,
                label: "fetch-npm-browserify.js",
                path: "./node_modules/isomorphic-fetch/fetch-npm-browserify.js",
                statSize: 233,
              },
            ],
            parsedSize: 0,
            gzipSize: 0,
          },
          {
            label: "lodash",
            path: "./node_modules/lodash",
            statSize: 544098,
            groups: [
              {
                id: 486,
                label: "lodash.js",
                path: "./node_modules/lodash/lodash.js",
                statSize: 544098,
              },
            ],
            parsedSize: 0,
            gzipSize: 0,
          },
          {
            label: "whatwg-fetch",
            path: "./node_modules/whatwg-fetch",
            statSize: 16658,
            groups: [
              {
                id: 147,
                label: "fetch.js",
                path: "./node_modules/whatwg-fetch/fetch.js",
                statSize: 16658,
              },
            ],
            parsedSize: 0,
            gzipSize: 0,
          },
        ],
        parsedSize: 0,
        gzipSize: 0,
      },
      {
        id: 830,
        label: "other-vendors.js",
        path: "./other-vendors.js",
        statSize: 146,
      },
    ],
    isInitialByEntrypoint: {
      "other-vendors": true,
    },
  },
  {
    label: "runtime.js",
    isAsset: true,
    statSize: 3205,
    groups: [
    ],
    isInitialByEntrypoint: {
      "react-vendors": true,
      "other-vendors": true,
    },
  },
  {
    label: "page1.js",
    isAsset: true,
    statSize: 176,
    groups: [
      {
        id: 832,
        label: "page1.js",
        path: "./page1.js",
        statSize: 176,
      },
    ],
    isInitialByEntrypoint: {
      page1: true,
    },
  },
  {
    label: "app.js",
    isAsset: true,
    statSize: 116,
    groups: [
      {
        id: 389,
        label: "app.js",
        path: "./app.js",
        statSize: 116,
      },
    ],
    isInitialByEntrypoint: {
      app: true,
    },
  },
  {
    label: "lazy_js.js",
    isAsset: true,
    statSize: 98,
    groups: [
      {
        id: 401,
        label: "lazy.js",
        path: "./lazy.js",
        statSize: 98,
      },
    ],
    isInitialByEntrypoint: {
    },
  },
]
