import * as esbuild from "esbuild"
import esbuildPluginTsc from "esbuild-plugin-tsc"

const ctx = await esbuild.context({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  packages: "external",
  // external: ["three"],
  plugins: [
    esbuildPluginTsc({
      force: true,
    }),
  ],
  loader: {
    ".glsl": "text",
  },
  format: "esm",
  outdir: "./dist",
  logLevel: "info",
})

await ctx.watch()
