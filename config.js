export default {
  site: {
    siteUrl: process.env.SITE_URL || 'https://mangust5580.github.io',
    basePath: process.env.SITE_BASE_PATH || '/BrandBoost',
    name: 'BrandBoost',
    shortName: 'BrandBoost',
  },

  images: {
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
  },
}
