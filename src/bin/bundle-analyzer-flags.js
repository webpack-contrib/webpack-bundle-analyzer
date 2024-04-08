"use strict";

module.exports = {
  version: {
    configs: [
      {
        type: "boolean",
        multiple: false,
        description: "Output the version number",
        path: "version",
      },
    ],
    description: "Output the version number",
    simpleType: "boolean",
    multiple: false,
  },
  mode: {
    configs: [
      {
        type: "enum",
        values: ["server", "static", "json"],
        multiple: false,
        description: "The mode to run the analyzer in: server, static, or json.",
        path: "mode",
        defaultValue: "server",
      },
    ],
    description: "The mode to run the analyzer in: server, static, or json.",
    simpleType: "string",
    multiple: false,
  },
  report: {
    configs: [
      {
        type: "string",
        multiple: false,
        description: 'Path to bundle report file that will be generated in "static" mode.',
        path: "report",
        defaultValue: "report.html",
      },
    ],
    description: 'Path to bundle report file that will be generated in "static" mode.',
    simpleType: "string",
    multiple: false,
  },
  title: {
    configs: [
      {
        type: "string",
        multiple: false,
        description: "String to use in title element of html report.",
        path: "title",
        defaultValue: "Webpack Bundle Report",
      },
    ],
    description: "String to use in title element of html report.",
    simpleType: "string",
    multiple: false,
  },
  size: {
    configs: [
      {
        type: "enum",
        values: ["stat", "parsed", "gzip"],
        multiple: false,
        description: "Module sizes to show in treemap by default.",
        path: "defaultSizes",
        defaultValue: "parsed",
      },
    ],
    description: "Module sizes to show in treemap by default.",
    simpleType: "string",
    multiple: false,
  },
  "Dont Open": {
    configs: [
      {
        type: "boolean",
        multiple: false,
        description: "Don't open report in default browser automatically",
        path: "noOpen",
        defaultValue: false,
      },
    ],
    description: "Don't open report in default browser automatically",
    simpleType: "boolean",
    multiple: false,
  },
  port: {
    configs: [
      {
        type: "number",
        multiple: false,
        description: "Port that will be used in `server` mode, default is 8888.",
        path: "port",
        defaultValue: 8888,
      },
    ],
    description: "Port that will be used in `server` mode, default is 8888.",
    simpleType: "number",
    multiple: false,
  },
  host: {
    configs: [
      {
        type: "string",
        multiple: false,
        description: "Host that will be used in `server` mode, default is 127.0.0.1.",
        path: "host",
        defaultValue: "127.0.0.1",
      },
    ],
    description: "Host that will be used in `server` mode, default is 127.0.0.1.",
    simpleType: "string",
    multiple: false,
  },
  "log-level": {
    configs: [
      {
        type: "enum",
        values: ["debug", "info", "warn", "error", "silent"],
        multiple: true,
        description: "Level of logger (info, warn, error, silent).",
        path: "logLevel",
        defaultValue: "info",
      },
    ],
    description: "Level of logger (info, warn, error, silent).",
    simpleType: "string",
    multiple: true,
  },
  exclude: {
    configs: [
      {
        type: "string",
        multiple: false,
        description: "Assets that should be excluded from the report.",
        path: "exclude",
        defaultValue: "",
      },
    ],
    description: "Assets that should be excluded from the report.",
    simpleType: "string",
    multiple: false,
  },
  help: {
    configs: [
      {
        type: "boolean",
        multiple: false,
        description: "output usage information",
        path: "help",
      },
    ],
    description: "Output usage information",
    simpleType: "boolean",
    multiple: false,
  },
};
