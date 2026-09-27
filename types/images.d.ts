// next-env.d.ts is gitignored, so CI typechecks without Next's image module
// declarations. Reference them here so `import x from '*.png'` resolves everywhere.
/// <reference types="next/image-types/global" />
