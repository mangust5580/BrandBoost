import { loadUserConfig } from '#gulp/utils/load-user-config.js'
const baseImages = {
  extensions: {
    raster: ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif'],
    vector: [],
  },

  dev: {
    mode: 'derived',
    allowEmpty: true,
    concurrency: 16,
    retina: { enabled: true, suffix: '@2x', scale: 2, generate1xFrom2x: true },
    formats: { webp: false, avif: false },
  },

  prod: {
    allowEmpty: true,
    concurrency: 6,
    retina: { enabled: true, suffix: '@2x', scale: 2, generate1xFrom2x: true },
    formats: { webp: false, avif: false },
    quality: {
      jpeg: { quality: 78, mozjpeg: true, progressive: true },
      png: { compressionLevel: 9, palette: true },
      webp: { quality: 76 },
      avif: { quality: 46 },
    },
  },

  exclude: {
    optimize: [],
    generateFormats: [],
  },

  responsive: {
    enabled: false,
    widths: [320, 480, 640, 768, 1024, 1280],
    keepOriginal: true,
    minSourceWidth: 640,
  },

  // Per-file/path generation overrides.
  // Rule shape:
  // {
  //   match: 'hero/**' | ['hero/**', 'og/index.jpg'],
  //   optimize: true|false,          // force/disable optimization
  //   formats: { webp: true, avif: true|false },
  //   retina: { enabled: true, suffix: '@2x', scale: 2, generate1xFrom2x: true },
  //   quality: { jpeg: {...}, png: {...}, webp: {...}, avif: {...} },
  //   responsive: { enabled: true|false, widths: [...], keepOriginal: true|false, minSourceWidth: 640 },
  // }
  rules: [
    {
      match: 'hero/**',
      formats: { webp: true, avif: true },
      quality: {
        png: { compressionLevel: 9, palette: true },
        webp: { quality: 68 },
        avif: { quality: 34 },
      },
      responsive: {
        enabled: true,
        widths: 'auto',
        keepOriginal: false,
        minSourceWidth: 640,
      },
    },
    {
      match: 'blog/**',
      formats: { webp: true, avif: true },
      quality: {
        jpeg: { quality: 74, mozjpeg: true, progressive: true },
        webp: { quality: 72 },
        avif: { quality: 42 },
      },
      responsive: {
        enabled: true,
        widths: 'auto',
        keepOriginal: false,
        minSourceWidth: 640,
      },
    },
    {
      match: 'error/**',
      formats: { webp: true, avif: true },
      quality: {
        png: { compressionLevel: 9, palette: false },
        webp: { quality: 76 },
        avif: { quality: 42 },
      },
      responsive: { enabled: false },
    },
    {
      match: 'services/strategy-illustration.png',
      formats: { webp: true, avif: true },
      quality: {
        png: { compressionLevel: 9, palette: true },
        webp: { quality: 72 },
        avif: { quality: 38 },
      },
      responsive: {
        enabled: true,
        widths: 'auto',
        keepOriginal: false,
        minSourceWidth: 320,
      },
    },
    {
      match: ['og/**', 'services/strategy-illustration-v2.png'],
      formats: { webp: false, avif: false },
      quality: {
        jpeg: { quality: 76, mozjpeg: true, progressive: true },
      },
      responsive: { enabled: false },
    },
  ],
}

export const images = await loadUserConfig(baseImages, 'images')
