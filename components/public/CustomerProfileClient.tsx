/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useMemo, useState } from 'react'
import type React from 'react'
import { CATALOG_URL } from '@/lib/company'
import type { PublicReward } from '@/lib/rewards'

type ProfileCustomer = {
  name: string
  code: string
  pointsBalance: number
  status: string
}

type ProfileActivity = {
  id: string
  points: number
  type: 'gain' | 'used'
  title: string
  description: string
}

type RedeemPayload = {
  success?: boolean
  message?: string
  customer?: {
    pointsBalance: number
  }
  redemption?: {
    id: string
    rewardName: string
    pointsUsed: number
    status: ProfileRedemption['status']
    createdAt: string
  }
  whatsappUrl?: string
}

type ProfileRedemption = {
  id: string
  rewardName: string
  pointsUsed: number
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
  completedAt?: string | null
  whatsappUrl?: string
}

type CustomerProfileClientProps = {
  customer: ProfileCustomer
  rewards: PublicReward[]
  usedPoints: number
  redeemCount: number
  activities: ProfileActivity[]
  redemptions: ProfileRedemption[]
  initialNotice?: string
}

const owlEyes = [
  { x: '9%', y: '18%', d: '-1s', s: '4px', o: '.55', t: '7.4s' },
  { x: '18%', y: '43%', d: '-3.6s', s: '3px', o: '.45', t: '8s' },
  { x: '27%', y: '76%', d: '-2.1s', s: '4px', o: '.62', t: '7.2s' },
  { x: '39%', y: '24%', d: '-5.4s', s: '3px', o: '.48', t: '8.5s' },
  { x: '51%', y: '67%', d: '-4.7s', s: '4px', o: '.58', t: '7.8s' },
  { x: '63%', y: '38%', d: '-2.8s', s: '5px', o: '.72', t: '7s' },
  { x: '74%', y: '17%', d: '-6.1s', s: '4px', o: '.68', t: '7.6s' },
  { x: '83%', y: '58%', d: '-1.9s', s: '3px', o: '.5', t: '8.2s' },
  { x: '91%', y: '78%', d: '-5s', s: '4px', o: '.6', t: '7.3s' },
]

const redemptionLabels: Record<ProfileRedemption['status'], string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  COMPLETED: 'Entregado',
  CANCELLED: 'Cancelado',
}

const redemptionHints: Record<ProfileRedemption['status'], string> = {
  PENDING: 'Solicitud recibida. Envia el WhatsApp para validar disponibilidad y coordinar entrega.',
  APPROVED: 'Aprobado por Nocturne. Presenta tu codigo al retirar o coordina por WhatsApp.',
  COMPLETED: 'Producto entregado. Este canje ya fue utilizado.',
  CANCELLED: 'Solicitud cancelada. Si aplicaba, los puntos fueron devueltos.',
}

export function CustomerProfileClient({
  customer,
  rewards,
  usedPoints,
  redeemCount,
  activities,
  redemptions,
  initialNotice,
}: CustomerProfileClientProps) {
  const [availablePoints, setAvailablePoints] = useState(customer.pointsBalance)
  const [usedPointsValue, setUsedPointsValue] = useState(usedPoints)
  const [redeemCountValue, setRedeemCountValue] = useState(redeemCount)
  const [selectedReward, setSelectedReward] = useState(rewards[0])
  const [activityItems, setActivityItems] = useState(activities)
  const [redemptionItems, setRedemptionItems] = useState(redemptions)
  const [infoOpen, setInfoOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [lastWhatsappUrl, setLastWhatsappUrl] = useState('')

  const selectedCost = selectedReward?.cost ?? 1
  const missing = Math.max(selectedCost - availablePoints, 0)
  const canRedeem = customer.status === 'ACTIVE' && availablePoints >= selectedCost
  const percent = Math.min((availablePoints / selectedCost) * 100, 100)
  const degrees = Math.min((availablePoints / selectedCost) * 360, 360)
  const hasAnyRewardAvailable = rewards.some((reward) => availablePoints >= reward.cost)

  const toastText = useMemo(() => toast || '', [toast])

  useEffect(() => {
    if (initialNotice) {
      showToast(initialNotice)
    }
  }, [initialNotice])

  useEffect(() => {
    if (!toastText) return

    const timeout = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [toastText])

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setInfoOpen(false)
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [])

  function showToast(message: string) {
    setToast(message)
  }

  async function redeemSelectedReward() {
    if (!selectedReward || !canRedeem || isRedeeming) return

    setIsRedeeming(true)

    try {
      const response = await fetch('/api/public/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId: selectedReward.id }),
      })
      const payload = (await response.json()) as RedeemPayload

      if (!response.ok || !payload.success || !payload.customer || !payload.redemption) {
        showToast(payload.message ?? 'No se pudo solicitar el canje.')
        return
      }

      const newBalance = payload.customer.pointsBalance
      const redemption = payload.redemption
      setAvailablePoints(newBalance)
      setUsedPointsValue((current) => current + selectedReward.cost)
      setRedeemCountValue((current) => current + 1)
      setActivityItems((current) => [
        {
          id: `local-${Date.now()}`,
          points: -selectedReward.cost,
          type: 'used',
          title: 'Canje solicitado',
          description: `${selectedReward.name} - ahora`,
        },
        ...current,
      ])
      setRedemptionItems((current) => [
        {
          id: redemption.id,
          rewardName: redemption.rewardName,
          pointsUsed: redemption.pointsUsed,
          status: redemption.status,
          createdAt: redemption.createdAt,
          whatsappUrl: payload.whatsappUrl,
        },
        ...current,
      ])

      if (payload.whatsappUrl) {
        setLastWhatsappUrl(payload.whatsappUrl)
        const opened = window.open(payload.whatsappUrl, '_blank', 'noopener,noreferrer')
        showToast(opened ? 'Solicitud creada. WhatsApp abierto.' : 'Solicitud creada. Toca Enviar WhatsApp.')
      } else {
        showToast(`Canje solicitado: ${selectedReward.name}`)
      }

      const nextAvailableReward = rewards.find((reward) => newBalance >= reward.cost)
      if (nextAvailableReward) {
        setSelectedReward(nextAvailableReward)
      }
    } catch {
      showToast('No se pudo solicitar el canje. Intenta de nuevo.')
    } finally {
      setIsRedeeming(false)
    }
  }

  async function copyId() {
    try {
      await navigator.clipboard.writeText(customer.code)
      showToast('ID Nocturne copiado')
    } catch {
      showToast('No se pudo copiar el ID')
    }
  }

  if (!selectedReward) {
    return null
  }

  return (
    <>
      <div className="owl-background" aria-hidden="true">
        <div className="owl-eyes">
          {owlEyes.map((eye, index) => (
            <span
              key={`${eye.x}-${index}`}
              style={
                {
                  '--x': eye.x,
                  '--y': eye.y,
                  '--d': eye.d,
                  '--s': eye.s,
                  '--o': eye.o,
                  '--t': eye.t,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>

      <a className="catalog-link" href={CATALOG_URL} target="_blank" rel="noopener noreferrer" aria-label="Ver catalogo de productos Nocturne">
        <span className="catalog-logo">
          <img src="/client/logo.png" alt="Logo Nocturne" />
        </span>
        <span className="catalog-copy">
          <small>Catalogo oficial</small>
          <strong>Ver productos</strong>
        </span>
        <span className="catalog-arrow">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </span>
      </a>

      <main className="nocturne-page">
        <section className="hero">
          <div className="brand-kicker">
            <span />
            Nocturne Rewards
            <span />
          </div>
          <h1>Puntos Premium</h1>
          <p className="member-name">{customer.name}</p>
          <p className="hero-copy">
            Tus puntos funcionan como saldo Nocturne: eliges una recompensa, la canjeas y esa cantidad se descuenta de tu cuenta.
          </p>
        </section>

        <section className="vault-layout">
          <article className="vault-panel spotlight">
            <div className="moving-border" />
            <div className="vault-top">
              <div>
                <p className="label">Saldo para canjear</p>
                <h2>
                  <span>{availablePoints}</span> <small>pts</small>
                </h2>
              </div>
              <div className={`info-wrap ${infoOpen ? 'open' : ''}`}>
                <button
                  className={`info-trigger ${infoOpen ? 'active' : ''}`}
                  type="button"
                  aria-label="Informacion sobre los puntos"
                  aria-expanded={infoOpen}
                  onClick={(event) => {
                    event.stopPropagation()
                    setInfoOpen((current) => !current)
                  }}
                >
                  i
                </button>
                <div className="info-tooltip">
                  Los puntos son saldo interno. Cuando canjeas una recompensa, los puntos requeridos se descuentan de tu cuenta.
                </div>
              </div>
            </div>

            <div className="ring-zone">
              <div className="progress-ring" style={{ '--progress': `${degrees}deg` } as React.CSSProperties}>
                <div className="ring-core">
                  <span>Canje seleccionado</span>
                  <strong>{selectedReward.name}</strong>
                  <small>{canRedeem ? 'Listo para canjear' : `${missing} pts restantes`}</small>
                </div>
              </div>
              <div className="vault-stats">
                <div>
                  <span>Canjeado</span>
                  <strong>{usedPointsValue} pts</strong>
                </div>
                <div>
                  <span>Canjes realizados</span>
                  <strong>{redeemCountValue}</strong>
                </div>
                <div>
                  <span>Estado</span>
                  <strong>{customer.status === 'ACTIVE' ? (hasAnyRewardAvailable ? 'Canje disponible' : 'Sin canje') : 'Restringido'}</strong>
                </div>
              </div>
            </div>

            <div className="quick-line">
              <div className="quick-copy">
                <span>{canRedeem ? 'Tu saldo alcanza para canjear.' : 'Todavia no alcanza.'}</span>
                <p>
                  {canRedeem
                    ? `Puedes reclamar ${selectedReward.name} ahora mismo.`
                    : `Te faltan ${missing} puntos para canjear ${selectedReward.name}.`}
                </p>
              </div>
              <div className="quick-progress">
                <span style={{ width: `${percent}%` }} />
              </div>
            </div>
          </article>

          <aside className="activity-panel">
            <div className="section-head">
              <p>Actividad</p>
              <h3>Ultimos movimientos</h3>
            </div>
            <div className="trace-list">
              {activityItems.slice(0, 4).map((activity) => (
                <div key={activity.id} className={`trace-item ${activity.type}`}>
                  <div className="trace-dot" />
                  <div>
                    <span>
                      {activity.points > 0 ? '+' : ''}
                      {activity.points} pts
                    </span>
                    <h4>{activity.title}</h4>
                    <p>{activity.description}</p>
                  </div>
                </div>
              ))}
              {activityItems.length === 0 && (
                <div className="trace-item gain">
                  <div className="trace-dot" />
                  <div>
                    <span>0 pts</span>
                    <h4>Sin movimientos</h4>
                    <p>Escanea tu primer QR Nocturne para sumar puntos.</p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </section>

        <section className="redemption-lab">
          <div className="redemption-marquee" aria-hidden="true">
            <span>CLAIM DROP</span>
            <span>NOCTURNE REWARDS</span>
            <span>CLAIM DROP</span>
          </div>
          <div className="redemption-header">
            <p className="label">Canjes Nocturne</p>
            <h2>Cambia tus puntos por piezas reales.</h2>
            <p>
              Elige una recompensa. Si tienes los puntos necesarios, puedes canjearla. Despues del canje, esos puntos se descuentan de tu
              saldo disponible.
            </p>
          </div>
          <div className="redemption-stage">
            <article className="featured-reward spotlight">
              <div className="scan-line" />
              <div className="featured-content">
                <p className="label">Recompensa seleccionada</p>
                <h3>{selectedReward.name}</h3>
                <p>{selectedReward.description}</p>
                <div className="redeem-meter">
                  <div>
                    <span>{canRedeem ? 'Listo para canjear' : `Te faltan ${missing} puntos`}</span>
                    <strong>
                      {availablePoints} / {selectedReward.cost} pts
                    </strong>
                  </div>
                  <div className="meter-track">
                    <span style={{ width: `${percent}%` }} />
                  </div>
                </div>
                <button
                  className={`claim-button ${!canRedeem ? 'locked' : ''}`}
                  type="button"
                  disabled={!canRedeem || isRedeeming}
                  onClick={redeemSelectedReward}
                >
                  {isRedeeming ? 'Procesando...' : canRedeem ? 'Canjear ahora' : `Faltan ${missing} pts`}
                </button>
              </div>
              <div className="reward-visual">
                <div className="reward-token">
                  <span>{String(selectedReward.id).padStart(2, '0')}</span>
                  <strong>{selectedReward.cost}</strong>
                  <small>PTS</small>
                </div>
              </div>
            </article>

            <div className="reward-terminal">
              {rewards.map((reward) => {
                const rewardMissing = Math.max(reward.cost - availablePoints, 0)
                const rewardAvailable = availablePoints >= reward.cost
                const active = reward.id === selectedReward.id

                return (
                  <button
                    key={reward.id}
                    className={`terminal-item ${rewardAvailable ? 'ready' : 'locked'} ${active ? 'active' : ''}`}
                    type="button"
                    onClick={() => setSelectedReward(reward)}
                  >
                    <span className="terminal-index">{String(reward.id).padStart(2, '0')}</span>
                    <div className="terminal-info">
                      <strong>{reward.name}</strong>
                      <span>{reward.cost} puntos requeridos</span>
                    </div>
                    <span className="terminal-status">{rewardAvailable ? 'Disponible' : `Faltan ${rewardMissing}`}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <section className="redemption-status-board">
          <div className="redemption-status-head">
            <div>
              <p className="label">Estado de canjes</p>
              <h2>Solicitudes y entrega.</h2>
            </div>
            <button type="button" onClick={() => window.location.reload()}>
              Actualizar estado
            </button>
          </div>
          <div className="redemption-use-guide">
            <span>Como utilizar tu canje</span>
            <p>
              Cuando el estado sea Aprobado, presenta tu ID Nocturne o escribe por WhatsApp para coordinar entrega. Cuando aparezca Entregado, el
              producto ya fue retirado y el canje no se puede volver a usar.
            </p>
          </div>
          <div className="redemption-status-list">
            {redemptionItems.map((redemption) => (
              <article key={redemption.id} className={`redemption-status-item ${redemption.status.toLowerCase()}`}>
                <div>
                  <span>{redemptionLabels[redemption.status]}</span>
                  <h3>{redemption.rewardName}</h3>
                  <p>{redemptionHints[redemption.status]}</p>
                  {redemption.status === 'PENDING' && redemption.whatsappUrl && (
                    <a className="redemption-whatsapp-link" href={redemption.whatsappUrl} target="_blank" rel="noopener noreferrer">
                      Enviar WhatsApp
                    </a>
                  )}
                </div>
                <strong>{redemption.pointsUsed} pts</strong>
              </article>
            ))}
            {redemptionItems.length === 0 && (
              <article className="redemption-status-item empty">
                <div>
                  <span>Sin solicitudes</span>
                  <h3>Aun no tienes canjes activos.</h3>
                  <p>Cuando solicites un producto, su estado aparecera aqui.</p>
                </div>
              </article>
            )}
          </div>
          {lastWhatsappUrl && (
            <a className="whatsapp-followup" href={lastWhatsappUrl} target="_blank" rel="noopener noreferrer">
              Enviar WhatsApp del canje
            </a>
          )}
        </section>

        <section className="identity-zone">
          <div>
            <p className="label">ID Nocturne</p>
            <h3>{customer.code}</h3>
            <p>Este codigo conecta tus compras, paquetes escaneados y recompensas dentro del sistema.</p>
          </div>
          <div className="identity-actions">
            <button type="button" onClick={copyId}>
              Copiar ID
            </button>
          </div>
        </section>
      </main>

      <div className={`toast ${toastText ? 'show' : ''}`}>{toastText}</div>
    </>
  )
}
