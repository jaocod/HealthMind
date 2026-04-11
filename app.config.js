/**
 * app.config.js — expose env vars to Expo 'extra' so EAS builds can inject secrets
 */
import 'dotenv/config'

export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...(config.extra || {}),
      // Supabase configuration handled via environment variables
    },
  }
}
