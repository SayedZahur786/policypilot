import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/privacy": ["./content/privacy.md"],
    "/terms": ["./content/terms.md"],
  },
};
export default config;
