/* eslint-disable @next/next/no-img-element */
import { CustomerCodeLogin } from '@/components/public/CustomerCodeLogin'
import { getClientCss } from '@/lib/client-css'
import { FACEBOOK_URL, INSTAGRAM_URL, TIKTOK_URL } from '@/lib/company'

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: getClientCss('login') }} />
      <main className="login-page">
        <nav className="socials" aria-label="Redes sociales">
          <a className="social-link" href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook" data-label="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15.12 8.32H13.2c-.68 0-.9.34-.9.82v1.42h2.73l-.37 2.82H12.3V21H9.38v-7.62H7v-2.82h2.38V8.78C9.38 6.36 10.82 5 13.02 5c1.05 0 1.95.08 2.22.12v2.57h-1.53c-1.2 0-1.41.56-1.41 1.38v1.49h2.84l-.02-2.24Z" />
            </svg>
          </a>

          <a className="social-link" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.75 2.1a1.35 1.35 0 1 1 0 2.7 1.35 1.35 0 0 1 0-2.7ZM12 7.25A4.75 4.75 0 1 1 12 16.75 4.75 4.75 0 0 1 12 7.25Zm0 2A2.75 2.75 0 1 0 12 14.75 2.75 2.75 0 0 0 12 9.25Z" />
            </svg>
          </a>

          <a className="social-link" href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" aria-label="TikTok" data-label="TikTok">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16.7 3c.35 2.23 1.63 3.56 3.8 3.7v3.04c-1.25.08-2.36-.28-3.72-1.05v5.72c0 7.28-7.94 9.55-11.14 4.34-2.06-3.36-.8-9.26 5.82-9.5v3.21c-.41.06-.85.16-1.25.3-1.2.4-1.9 1.16-1.7 2.5.39 2.56 5.06 3.32 4.66-1.68V3h3.53Z" />
            </svg>
          </a>
        </nav>

        <section className="login-content">
          <img className="brand-logo" src="/client/logo.png" alt="Logo Nocturne" />

          <h1 className="login-title">Puntos Premium</h1>

          <CustomerCodeLogin />
        </section>

        <div className="bottom-letters" aria-hidden="true">
          <img src="/client/letras.png" alt="" />
        </div>
      </main>
    </>
  )
}
