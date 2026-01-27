module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["feature", "bugfix", "chore", "hotfix"]],
    "scope-empty": [2, "never"],
    "subject-empty": [2, "never"],
    "header-max-length": [2, "always", 100],
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w+)\(([^)]+)\): (.+)$/,
      headerCorrespondence: ["type", "scope", "subject"],
    },
  },
};
