import { sveltekit } from "@sveltejs/kit/vite";

// Uncomment if installing Pintura in ./local_modules (also requires installing @pqina/svelte-pintura to local_modules)
// import { searchForWorkspaceRoot } from "vite";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],

  // Uncomment if installing Pintura in ./local_modules
  // server: {
  //   fs: {
  //     allow: [searchForWorkspaceRoot(process.cwd()), "/local_modules"],
  //   },
  // },
};

export default config;
