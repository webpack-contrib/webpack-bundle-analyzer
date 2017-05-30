declare module "webpack-bundle-analyzer" {
  import { Plugin, Options } from "webpack";

  export type AnalyzerMode = "server" | "static" | "disabled";
  export type ModuleSize = "stat" | "parsed" | "gzip";
  export type LogLevel = "info" | "warn" | "error" | "silent";

  export interface Options {
    analyzerMode: AnalyzerMode;
    /** Host that will be used in `server` mode to start HTTP server. */
    analyzerHost?: string;
    /** Port that will be used in `server` mode to start HTTP server. */
    analyzerPort?: number;
    /**
     * Path to bundle report file that will be generated in `static`
     * mode. Relative to bundles output directory.
     */
    reportFilename?: string;
    /** Module sizes to show in report by default. */
    defaultSizes?: ModuleSize;
    /** Automatically open report in default browser */
    openAnalyzer?: boolean;
    /** If `true`, Webpack Stats JSON file will be generated in bundles output directory */
    generateStatsFile?: boolean;
    /**
     * Name of Webpack Stats JSON file that will be generated if
     * `generateStatsFile` is `true`. Relative to bundles output directory.
     */
    statsFilename?: string;
    /**
     * Options for `stats.toJson()` method.
     * For example you can exclude sources of your modules from stats
     * file with `source: false` option.
     * See more options here:
     * https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
     */
    statsOptions?: null | Options.Stats;
    /** Log level. Can be 'info', 'warn', 'error' or 'silent'. */
    logLevel?: LogLevel;
  }

  export default class BundleAnalyzerPlugin extends Plugin {
    constructor(options?: Options);
  }
}
