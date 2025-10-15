/** @type {import('next').NextConfig} */
const repo = "ed-dialogue";
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  output: "export",            // produce static HTML
  images: { unoptimized: true },
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
};
