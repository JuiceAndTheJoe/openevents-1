export async function register() {
  // Only run on the server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await loadConfigFromOSC()
  }
}

async function loadConfigFromOSC() {
  // Skip if DATABASE_URL is already set
  if (process.env.DATABASE_URL) {
    console.log('[instrumentation] DATABASE_URL already set, skipping config fetch')
    return
  }

  // Prefer explicit config service URL injected by the platform.
  const explicitConfigServiceUrl =
    process.env.APP_CONFIG_URL ||
    process.env.CONFIG_SERVICE_URL ||
    process.env.CONFIG_SERVICE ||
    process.env.ConfigService

  // Backward-compatible fallback for older deployments.
  const configServiceName = process.env.CONFIG_SERVICE_NAME || 'openeventsconfig'
  const configServiceUrl = explicitConfigServiceUrl
    ? explicitConfigServiceUrl.replace(/\/$/, '')
    : `https://team2-${configServiceName}.eyevinn-app-config-svc.auto.prod.osaas.io`

  console.log(`[instrumentation] Fetching config from ${configServiceUrl}`)

  try {
    const response = await fetch(`${configServiceUrl}/api/v1/config`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error(`[instrumentation] Failed to fetch config: ${response.status}`)
      return
    }

    const data = await response.json()

    if (data.items && Array.isArray(data.items)) {
      for (const item of data.items) {
        if (item.key && item.value && !process.env[item.key]) {
          process.env[item.key] = item.value
          console.log(`[instrumentation] Set ${item.key}`)
        }
      }
    }

    console.log('[instrumentation] Config loaded successfully')
  } catch (error) {
    console.error('[instrumentation] Error loading config:', error)
  }
}
