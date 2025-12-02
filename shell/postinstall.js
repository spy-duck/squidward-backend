// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require("child_process");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { existsSync } = require("fs");

console.log('# Postinstall CI: ', process.env.CI)

if (process.env.CI_POSTINSTALL_DISABLED) {
    console.log('# Postinstall disabled')
    process.exit(0);
}

if (process.env.CI) {
    console.log('# Installing contracts from node repository')

    execSync("npm install @squidward-node/contracts@https://github.com/spy-duck/squidward-node/releases/latest/download/squidward-node-contracts.tgz --no-save", { stdio: "inherit" });
} else {
    console.log('# Installing contracts from local node repository')
    if (!existsSync("../squidward-node/libs/contracts")) {
        console.log(
            "\n\n" +
            "#######################################################################################\n" +
            "###                                                                                 ###\n" +
            "###                    Squidward Node local repository not found.                   ###\n" +
            "###                                                                                 ###\n" +
            "###                                      Run:                                       ###\n" +
            "###                                                                                 ###\n" +
            "###    git clone https://github.com/spy-duck/squidward-node.git ../squidward-node   ###\n" +
            "###                                                                                 ###\n" +
            "#######################################################################################\n\n"
        );
        process.exit(1);
    }
    execSync("npm install @squidward-node/contracts@file:../squidward-node/libs/contracts --no-save", { stdio: "inherit" });
}