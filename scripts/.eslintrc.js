module.exports = {
    "root": true,
    "plugins": ["node"],
    "extends": ["eslint:recommended", "plugin:node/recommended"],
    "rules": {
        "node/exports-style": ["error", "module.exports"],
        "node/no-unsupported-features": ["error", {
            "version": 7.6,
            "ignores": []
        }],
        "no-console": [0],
        "indent": ["error", 2],
        "semi": ["error", "never"]
    }
}