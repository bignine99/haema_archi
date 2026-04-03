/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KAKAO_REST_KEY: string
  readonly VITE_VWORLD_API_KEY: string
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_BUILDING_REGISTER_API_KEY: string
  readonly VITE_LAND_USE_API_KEY: string
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
