import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Fog,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  RingGeometry,
  Scene,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from 'three'

import { arena as arenaConfig } from '../../config/experience'

/**
 * ARENA NITEROIENSE
 *
 * One spatial system for the whole page, built from the two forms that make up
 * the crest: the ring that holds the NFC monogram, and the arc of the Museu de
 * Arte Contemporânea underneath it.
 *
 *  - Rings recede into depth and become a tunnel the camera travels through.
 *  - Field lines lie in perspective under them, so the depth reads as a pitch.
 *  - The arc rises at the end of the travel and becomes the stage that the
 *    match object stands on.
 *
 * The scene does not loop decoratively. It is driven by a single normalized
 * progress value written by the scroll timeline, so the space is always saying
 * the same thing the copy is saying.
 */

export interface ArenaHandle {
  setProgress(value: number): void
  resize(): void
  dispose(): void
  /** Pause rendering when the arena is off screen. */
  setActive(active: boolean): void
}

const ITAIPU = new Color('#0f2349')
const AZUL = new Color('#2c65d5')
const BRANCO = new Color('#ffffff')

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** Remap progress into a 0..1 band, so each phase owns a slice of the scroll. */
function phase(progress: number, start: number, end: number) {
  return clamp01((progress - start) / (end - start))
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

export function createArena(canvas: HTMLCanvasElement, isMobile: boolean): ArenaHandle | null {
  let renderer: WebGLRenderer
  try {
    renderer = new WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    })
  } catch {
    return null
  }

  const maxDpr = isMobile ? arenaConfig.maxPixelRatio.mobile : arenaConfig.maxPixelRatio.desktop
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr))
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)

  const scene = new Scene()
  scene.fog = new Fog(ITAIPU.getHex(), 16, 88)

  const camera = new PerspectiveCamera(52, canvas.clientWidth / canvas.clientHeight, 0.1, 200)
  camera.position.set(0, 1.1, 26)

  const world = new Group()
  scene.add(world)

  const disposables: { dispose(): void }[] = []
  const track = <T extends { dispose(): void }>(item: T) => {
    disposables.push(item)
    return item
  }

  // --- The ring tunnel -----------------------------------------------------
  // The crest ring, repeated into depth. Each ring is thin, so the space reads
  // as drawn rather than modelled.
  const ringCount = isMobile ? arenaConfig.rings.mobile : arenaConfig.rings.desktop
  const ringSpacing = 5.5
  const rings: Mesh[] = []
  const ringGeometry = track(new TorusGeometry(6.4, 0.018, 3, 128))

  for (let i = 0; i < ringCount; i++) {
    const material = track(
      new MeshBasicMaterial({
        color: i % 4 === 0 ? BRANCO : AZUL,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      }),
    )
    const ring = new Mesh(ringGeometry, material)
    ring.position.z = -i * ringSpacing
    ring.scale.setScalar(1 + i * 0.028)
    rings.push(ring)
    world.add(ring)
  }

  const fieldDepth = ringCount * ringSpacing

  // --- The MAC arc ---------------------------------------------------------
  // A shallow crown of a ring: the museum curve abstracted into the horizon the
  // camera arrives at. Only the top of the arc is drawn, so the ends never read
  // as two floating slabs; it has to behave like a horizon, not like geometry.
  const arcSpan = Math.PI * 0.62
  const arcStart = Math.PI / 2 - arcSpan / 2
  const arcGeometry = track(new RingGeometry(25.5, 26.4, 160, 1, arcStart, arcSpan))
  const arcMaterial = track(
    new MeshBasicMaterial({ color: BRANCO, transparent: true, opacity: 0, depthWrite: false }),
  )
  const arc = new Mesh(arcGeometry, arcMaterial)
  arc.position.set(0, -31, -fieldDepth * 0.62)
  world.add(arc)

  const arcInnerGeometry = track(new RingGeometry(17.4, 17.7, 160, 1, arcStart, arcSpan * 0.86))
  const arcInnerMaterial = track(
    new MeshBasicMaterial({ color: AZUL, transparent: true, opacity: 0, depthWrite: false }),
  )
  const arcInner = new Mesh(arcInnerGeometry, arcInnerMaterial)
  arcInner.rotation.z = (arcSpan * 0.07)
  arcInner.position.copy(arc.position)
  world.add(arcInner)

  // --- Crowd particles -----------------------------------------------------
  // Sparse and slow. They read as people in a dark bowl, not as stardust.
  const particleCount = isMobile ? arenaConfig.particles.mobile : arenaConfig.particles.desktop
  const positions = new Float32Array(particleCount * 3)
  const drift = new Float32Array(particleCount)
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 7 + Math.random() * 9
    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = -3 + Math.random() * 11
    positions[i * 3 + 2] = 4 - Math.random() * fieldDepth
    drift[i] = 0.3 + Math.random() * 0.9
  }
  const particleGeometry = track(new BufferGeometry())
  particleGeometry.setAttribute('position', new BufferAttribute(positions, 3))
  const particleMaterial = track(
    new PointsMaterial({
      color: AZUL,
      size: isMobile ? 0.07 : 0.055,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: AdditiveBlending,
      sizeAttenuation: true,
    }),
  )
  const crowd = new Points(particleGeometry, particleMaterial)
  world.add(crowd)

  // --- State ---------------------------------------------------------------
  let progress = 0
  let active = true
  let running = false
  let elapsed = 0
  let last = performance.now()
  const cameraTarget = new Vector3(0, 0.4, -10)

  function apply(delta: number) {
    elapsed += delta

    // Phase 1 to 2: the camera leaves the surface and enters the tunnel.
    const entry = easeInOut(phase(progress, 0, 0.45))
    // Phase 3: the competitive numbers arrive, the space tightens around them.
    const focus = easeInOut(phase(progress, 0.34, 0.66))
    // Phase 4 to 5: the arc rises and the tunnel becomes a stage.
    const stage = easeInOut(phase(progress, 0.58, 1))

    camera.position.z = lerp(26, -fieldDepth * 0.44, entry)
    camera.position.y = lerp(1.1, lerp(0.2, 2.4, stage), entry)
    camera.position.x = Math.sin(elapsed * 0.14) * lerp(0.5, 0.12, focus)
    cameraTarget.set(0, lerp(0.4, -0.6, stage), camera.position.z - 12)
    camera.lookAt(cameraTarget)
    camera.fov = lerp(52, lerp(48, 40, stage), entry)
    camera.updateProjectionMatrix()

    // Rings tighten and brighten as the scene focuses, then fade out entirely
    // as the arc rises into a stage, so the fixture stands on the arc alone.
    for (let i = 0; i < rings.length; i++) {
      const ring = rings[i]
      const mesh = ring.material as MeshBasicMaterial
      const depthRatio = i / rings.length
      const wave = Math.sin(elapsed * 0.35 + i * 0.42) * 0.5 + 0.5
      ring.rotation.z = elapsed * 0.035 * (i % 2 === 0 ? 1 : -1) + i * 0.09
      ring.scale.setScalar(lerp(1 + i * 0.028, 0.72 + i * 0.02, focus))
      const base = isMobile ? 0.12 : 0.06
      const lit = isMobile ? 0.4 : 0.3
      mesh.opacity =
        lerp(base + wave * 0.14, lerp(lit, 0, stage), entry) * (1 - depthRatio * 0.35)
    }

    // The arc holds back until the scene is ready to become a stage, then
    // rises just far enough for its crown to sit behind the match object.
    arc.position.y = lerp(-31, -21.5, stage)
    arcInner.position.y = arc.position.y + 5.6
    arc.position.z = camera.position.z - lerp(40, 26, stage)
    arcInner.position.z = arc.position.z + 2.4
    arcMaterial.opacity = stage * 0.82
    arcInnerMaterial.opacity = stage * 0.45
    arc.scale.setScalar(lerp(1.22, 1, stage))
    arcInner.scale.setScalar(lerp(1.28, 1, stage))

    // Crowd drifts upward slowly, wraps, and gains presence near the stage.
    const p = particleGeometry.getAttribute('position') as BufferAttribute
    const arr = p.array as Float32Array
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3 + 1] += delta * 0.22 * drift[i]
      if (arr[i * 3 + 1] > 9) arr[i * 3 + 1] = -3.4
    }
    p.needsUpdate = true
    particleMaterial.opacity = lerp(0.12, lerp(0.42, 0.62, stage), entry)
    crowd.rotation.y = elapsed * 0.012

    // The colour of the void moves from Itaipu toward the brighter blue as the
    // scene approaches the match, so the space itself gets closer to kickoff.
    ;(scene.fog as Fog).color.copy(ITAIPU).lerp(AZUL, stage * 0.22)
    ;(scene.fog as Fog).near = lerp(16, 8, entry)
    ;(scene.fog as Fog).far = lerp(88, 62, stage)
  }

  function frame(now: number) {
    if (!running) return
    const delta = Math.min((now - last) / 1000, 0.05)
    last = now
    apply(delta)
    renderer.render(scene, camera)
  }

  function start() {
    if (running) return
    running = true
    last = performance.now()
    renderer.setAnimationLoop(frame)
  }

  function stop() {
    running = false
    renderer.setAnimationLoop(null)
  }

  function resize() {
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (!width || !height) return
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  // First frame is composed immediately, so the canvas is never blank even if
  // the visitor never scrolls or prefers reduced motion.
  apply(0)
  renderer.render(scene, camera)
  start()

  return {
    setProgress(value: number) {
      progress = clamp01(value)
      if (!running) {
        apply(0)
        renderer.render(scene, camera)
      }
    },
    resize,
    setActive(next: boolean) {
      if (next === active) return
      active = next
      if (active) start()
      else stop()
    },
    dispose() {
      stop()
      for (const item of disposables) item.dispose()
      renderer.dispose()
    },
  }
}
