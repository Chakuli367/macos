import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

type Mode = 'idle' | 'listening' | 'thinking' | 'speaking';

// ── Exact animation clip names from your GLB ──────────────────
const CLIP_NAMES = {
  idle:      'CharacterArmature|CharacterArmature|Idle',
  death:     'CharacterArmature|CharacterArmature|Death',
};

// ── State → visual config ─────────────────────────────────────
const STATE_CONFIG: Record<Mode, {
  clipName:    string;
  timeScale:   number;
  rimColor:    number;
  rimIntensity: number;
  pulseSpeed:  number;
}> = {
  idle: {
    clipName:     CLIP_NAMES.idle,
    timeScale:    0.6,
    rimColor:     0x7c3aed,
    rimIntensity: 0.4,
    pulseSpeed:   1.0,
  },
  listening: {
    clipName:     CLIP_NAMES.idle,
    timeScale:    0.9,
    rimColor:     0x0ea5e9,
    rimIntensity: 0.8,
    pulseSpeed:   1.5,
  },
  thinking: {
    clipName:     CLIP_NAMES.death,
    timeScale:    0.3,   // very slow death = "slumping in thought" look
    rimColor:     0xf59e0b,
    rimIntensity: 0.6,
    pulseSpeed:   0.8,
  },
  speaking: {
    clipName:     CLIP_NAMES.idle,
    timeScale:    1.4,
    rimColor:     0x10b981,
    rimIntensity: 1.0,
    pulseSpeed:   2.0,
  },
};

interface UseThreeAvatarOptions {
  canvasRef:  React.RefObject<HTMLCanvasElement>;
  mode:       Mode;
  orbLevel:   number;  // 1.0 – 1.28 from analyser
}

export function useThreeAvatar({ canvasRef, mode, orbLevel }: UseThreeAvatarOptions) {
  const sceneRef    = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef   = useRef<THREE.PerspectiveCamera | null>(null);
  const mixerRef    = useRef<THREE.AnimationMixer | null>(null);
  const clockRef    = useRef<THREE.Clock>(new THREE.Clock());
  const modelRef    = useRef<THREE.Group | null>(null);
  const clipsRef    = useRef<Record<string, THREE.AnimationClip>>({});
  const currentActionRef = useRef<THREE.AnimationAction | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const frameRef    = useRef<number>(0);
  const modeRef     = useRef<Mode>(mode);
  const orbLevelRef = useRef<number>(orbLevel);

  // Keep refs in sync
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { orbLevelRef.current = orbLevel; }, [orbLevel]);

  // ── Init Three.js scene ──────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias:            true,
      alpha:                true,
      powerPreference:      'high-performance',
      preserveDrawingBuffer: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera — framed to show character from waist up
    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.4, 3.2);
    camera.lookAt(0, 1.0, 0);
    cameraRef.current = camera;

    // ── Lighting ─────────────────────────────────────────────
    // Ambient — soft fill
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    // Key light — slightly warm, from upper left
    const keyLight = new THREE.DirectionalLight(0xf0e6ff, 1.2);
    keyLight.position.set(-2, 4, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Fill light — cool, from right
    const fillLight = new THREE.DirectionalLight(0xc4b5fd, 0.5);
    fillLight.position.set(3, 2, -1);
    scene.add(fillLight);

    // Rim / state light — color changes with mode
    const rimLight = new THREE.PointLight(0x7c3aed, 0.4, 8);
    rimLight.position.set(0, 1.5, -2);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Ground bounce — very subtle
    const bounceLight = new THREE.PointLight(0x4c1d95, 0.3, 5);
    bounceLight.position.set(0, -0.5, 1);
    scene.add(bounceLight);

    // ── Load model ────────────────────────────────────────────
    const loader = new GLTFLoader();
    loader.load(
      '/assets/companion.glb',
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;

        // Center and scale
        const box    = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size   = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale  = 2.0 / maxDim;
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));
        model.position.y += 0.1;

        // Enable shadows on all meshes + apply material tweaks
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow    = true;
            mesh.receiveShadow = true;
            // Slight emissive so character glows faintly
            if ((mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.emissive    = new THREE.Color(0x2d1b4e);
              mat.emissiveIntensity = 0.15;
            }
          }
        });

        scene.add(model);

        // ── Animation mixer ──────────────────────────────────
        const mixer = new THREE.AnimationMixer(model);
        mixerRef.current = mixer;

        // Index all clips by name
        gltf.animations.forEach((clip) => {
          clipsRef.current[clip.name] = clip;
        });

        // Play initial idle
        playClip(CLIP_NAMES.idle, 0.6);
      },
      undefined,
      (err) => console.error('[Avatar] GLB load error:', err)
    );

    // ── Render loop ───────────────────────────────────────────
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();

      // Update mixer
      if (mixerRef.current) mixerRef.current.update(delta);

      // Subtle idle bob on the model
      if (modelRef.current) {
        const t = clockRef.current.getElapsedTime();
        const cfg = STATE_CONFIG[modeRef.current];
        const pulse = Math.sin(t * cfg.pulseSpeed) * 0.008 * orbLevelRef.current;
        modelRef.current.position.y += pulse;
        // Subtle sway
        modelRef.current.rotation.y = Math.sin(t * 0.3) * 0.04;
      }

      // Rim light pulse with orbLevel
      if (rimLightRef.current) {
        const cfg = STATE_CONFIG[modeRef.current];
        const t   = clockRef.current.getElapsedTime();
        const breathe = 0.8 + Math.sin(t * cfg.pulseSpeed) * 0.2;
        rimLightRef.current.intensity = cfg.rimIntensity * breathe * orbLevelRef.current;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ── Pause/resume on visibility change (iOS WebView fix) ──
    const handleVisibility = () => {
      if (document.hidden) {
        renderer.setAnimationLoop(null);
        cancelAnimationFrame(frameRef.current);
      } else {
        clockRef.current = new THREE.Clock();
        animate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // ── Resize ───────────────────────────────────────────────
    const handleResize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []); // eslint-disable-line

  // ── Play a clip by name ──────────────────────────────────────
  const playClip = (clipName: string, timeScale = 1.0) => {
    const mixer = mixerRef.current;
    const clips = clipsRef.current;
    if (!mixer || !clips[clipName]) return;

    const next = mixer.clipAction(clips[clipName]);
    next.timeScale = timeScale;

    if (currentActionRef.current && currentActionRef.current !== next) {
      currentActionRef.current.fadeOut(0.4);
      next.reset().fadeIn(0.4).play();
    } else if (!currentActionRef.current) {
      next.play();
    }
    currentActionRef.current = next;
  };

  // ── React to mode changes ────────────────────────────────────
  useEffect(() => {
    if (!mixerRef.current) return;
    const cfg = STATE_CONFIG[mode];

    // Switch animation clip
    playClip(cfg.clipName, cfg.timeScale);

    // Switch rim light color
    if (rimLightRef.current) {
      rimLightRef.current.color.set(cfg.rimColor);
    }
  }, [mode]); // eslint-disable-line
}