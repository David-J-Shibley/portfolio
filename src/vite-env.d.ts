/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_ORIGIN?: string;
  readonly VITE_EMAIL_TEMPLATE_ID?: string;
  readonly VITE_EMAIL_PUBLIC_KEY?: string;
  readonly VITE_EMAIL_SERVICE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
