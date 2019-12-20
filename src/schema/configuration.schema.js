const sharedTypes = require("./shared-types.schema-snippet");
const ruleSet = require("./rule-set.schema-snippet");

module.exports = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://dependency-cruiser.js.org/config-schema",
  title: "dependency-cruiser configuration",
  description:
    "A set of properties describing what dependencies are forbidden and what dependencies are allowed.",
  type: "object",
  additionalProperties: false,
  properties: {
    extends: {
      description: "A configuration this configuration uses as a base",
      oneOf: [
        {
          type: "string"
        },
        {
          type: "array",
          description:
            "A list of rules that describe dependencies that are allowed. dependency-cruiser will emit the warning message 'not-in-allowed' for each dependency that does not at least meet one of them.",
          items: {
            type: "string"
          }
        }
      ]
    },
    ...ruleSet.properties,
    options: {
      type: "object",
      description: "Runtime configuration options",
      additionalProperties: false,
      properties: {
        doNotFollow: {
          oneOf: [
            {
              type: "string",
              description:
                "a regular expression for modules to include, but not follow further"
            },
            {
              type: "object",
              description:
                "Criteria for modules to include, but not to follow further",
              additionalProperties: false,
              properties: {
                path: {
                  type: "string",
                  description:
                    "a regular expression for modules to include, but not follow further"
                },
                dependencyTypes: {
                  type: "array",
                  description:
                    "an array of dependency types to include, but not follow further",
                  items: {
                    $ref: "#/definitions/DependencyType"
                  }
                }
              }
            }
          ]
        },
        exclude: {
          oneOf: [
            {
              type: "string",
              description:
                "a regular expression for modules to exclude from being cruised"
            },
            {
              type: "object",
              description: "Criteria for dependencies to exclude",
              additionalProperties: false,
              properties: {
                path: {
                  type: "string",
                  description:
                    "a regular expression for modules to exclude from being cruised"
                },
                dynamic: {
                  type: "boolean",
                  description:
                    "a boolean indicating whether or not to exclude dynamic dependencies"
                }
              }
            }
          ]
        },
        includeOnly: {
          type: "string",
          description:
            "a regular expression for modules to cruise; anything outside it will be skipped"
        },
        maxDepth: {
          type: "number",
          minimum: 0,
          maximum: 99,
          description:
            "The maximum cruise depth specified. 0 means no maximum specified"
        },
        moduleSystems: { $ref: "#/definitions/ModuleSystemType" },
        prefix: {
          type: "string"
        },
        preserveSymlinks: {
          type: "boolean",
          description:
            "if true leave symlinks untouched, otherwise use the realpath. Defaults to `false` (which is also nodejs's default behavior since version 6)"
        },
        combinedDependencies: {
          type: "boolean",
          description:
            "if true combines the package.jsons found from the module up to the base folder the cruise is initiated from. Useful for how (some) mono-repos manage dependencies & dependency definitions. Defaults to `false`."
        },
        tsConfig: {
          type: "object",
          additionalProperties: false,
          description:
            "Typescript project file ('tsconfig.json') to use for (1) compilation and (2) resolution (e.g. with the paths property)",
          properties: {
            fileName: {
              description:
                "The typescript project file to use. The fileName is relative to dependency-cruiser's current working directory. When not provided defaults to './tsconfig.json'.",
              type: "string"
            }
          }
        },
        tsPreCompilationDeps: {
          description:
            "if true detect dependencies that only exist before typescript-to-javascript compilation.",
          oneOf: [
            {
              type: "boolean"
            },
            {
              type: "string",
              enum: ["specify"]
            }
          ]
        },
        externalModuleResolutionStrategy: {
          type: "string",
          description:
            "What external module resolution strategy to use. Defaults to 'node_modules'",
          enum: ["node_modules", "yarn-pnp"]
        },
        webpackConfig: {
          type: "object",
          additionalProperties: false,
          description:
            "Webpack configuration to use to get resolve options from",
          properties: {
            fileName: {
              type: "string",
              description:
                "The webpack conf file to use (typically something like 'webpack.conf.js'). The fileName is relative to dependency-cruiser's current working directory. When not provided defaults to './webpack.conf.js'."
            },
            env: {
              description:
                "Environment to pass if your config file returns a function",
              oneOf: [
                {
                  type: "object"
                },
                {
                  type: "string"
                }
              ]
            },
            arguments: {
              type: "object",
              description:
                "Arguments to pass if your config file returns a function. E.g. {mode: 'production'} if you want to use webpack 4's 'mode' feature"
            }
          }
        },
        exoticRequireStrings: {
          type: "array",
          description:
            "List of strings you have in use in addition to cjs/ es6 requires & imports to declare module dependencies. Use this e.g. if you've redeclared require (`const want = require`), use a require-wrapper (like semver-try-require) or use window.require as a hack to workaround something",
          items: {
            type: "string"
          }
        }
      }
    }
  },
  definitions: {
    ...ruleSet.definitions,
    ...sharedTypes
  }
};
