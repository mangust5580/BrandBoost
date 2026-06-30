import { loadUserConfig } from '#gulp/utils/load-user-config.js'

const envUrl = (process.env.SITE_URL || '').trim()
const envBasePath = (process.env.SITE_BASE_PATH || '').trim()

const normalizeSiteUrl = (url) => String(url || '').trim().replace(/\/+$/g, '')

const normalizeBasePath = (basePath) => {
  let bp = String(basePath || '').trim()
  if (bp === '/') bp = ''
  if (bp && !bp.startsWith('/')) bp = `/${bp}`
  bp = bp.replace(/\/+$/g, '')
  return bp
}

const baseSite = {
  siteUrl: normalizeSiteUrl(envUrl || 'https://mangust5580.github.io'),
  basePath: normalizeBasePath(envBasePath || '/BrandBoost'),

  name: (process.env.SITE_NAME || '').trim() || 'BrandBoost',
  shortName: (process.env.SITE_SHORT_NAME || '').trim() || 'BrandBoost',
}

export const site = await loadUserConfig(baseSite, 'site')
