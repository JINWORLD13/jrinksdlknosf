import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferAttribute, CanvasTexture, Color, DoubleSide } from 'three';

// Helper function to convert color, opacity, and brightness to rgba
function colorToRGBA(color, opacity, brightness) {
  if (typeof color === 'string' && color.startsWith('rgba')) {
    return color; // Return as-is if it's already an rgba string
  }
  const tempColor = new Color(color);
  tempColor.multiplyScalar(brightness);
  return `rgba(${Math.round(tempColor.r * 255)}, ${Math.round(
    tempColor.g * 255
  )}, ${Math.round(tempColor.b * 255)}, ${opacity})`;
}

export function BigMagicCircle({
  count = 10,
  speed = 0.5,
  color = 'white',
  radius = 2,
  position = [0.005, 1.25, 0.7],
  orbitRadius = 1,
  visible,
  innerCircleColor = 'skyblue',
  innerCircleOpacity = 0.4,
  innerCircleBrightness = 0, //! 0으로 맞추면 없어짐1
  glowColor = 'skyblue',
  glowOpacity = 0, //! 0으로 맞추면 없어짐2
  glowBrightness = 1,
  glowIntensity = 0.5, //! 0으로 맞추면 없어짐3
  ...props
}) {
  const particlesRef = useRef();
  const magicParticlesRef = useRef();
  const orbitingSparklesRefs = useRef(
    Array(10)
      .fill()
      .map(() => React.createRef())
  );
  const lastUpdateRef = useRef(Date.now()); // throttling용
  const lastRotationUpdateRef = useRef(Date.now()); // rotation throttling용

  // Create initial positions for particles
  const positions = useMemo(() => {
    return new Float32Array(count * 3).map((_, i) => {
      const angle = (i / count) * Math.PI * 200;
      return i % 3 === 1
        ? 0
        : Math.cos(angle) * radius * (i % 3 === 0 ? 1 : -1);
    });
  }, [count, radius]);

  // Create positions for magic circle particles
  const magicPositions = useMemo(() => {
    const points = [];
    const segments = 64;
    const innerRadius = 0.4;
    const outerRadius = 0.6;

    // Outer circle
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(
        Math.cos(theta) * outerRadius,
        Math.sin(theta) * outerRadius,
        0
      );
    }

    // Inner circle
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(
        Math.cos(theta) * innerRadius,
        Math.sin(theta) * innerRadius,
        0
      );
    }

    // Pentagram
    for (let i = 0; i < 5; i++) {
      const theta1 = (i / 5) * Math.PI * 2;
      const theta2 = (((i + 2) % 5) / 5) * Math.PI * 2;
      points.push(
        Math.cos(theta1) * outerRadius,
        Math.sin(theta1) * outerRadius,
        0,
        Math.cos(theta2) * outerRadius,
        Math.sin(theta2) * outerRadius,
        0
      );
    }

    // Add some random points inside for sparkle effect
    for (let i = 0; i < 50; i++) {
      const r = Math.random() * innerRadius;
      const theta = Math.random() * Math.PI * 2;
      points.push(Math.cos(theta) * r, Math.sin(theta) * r, 0);
    }

    return new Float32Array(points);
  }, []);

  useEffect(() => {
    if (particlesRef.current) {
      const positionAttribute = new BufferAttribute(positions, 3);
      particlesRef.current.geometry.setAttribute('position', positionAttribute);
    }
    if (magicParticlesRef.current) {
      const positionAttribute = new BufferAttribute(magicPositions, 3);
      magicParticlesRef.current.geometry.setAttribute(
        'position',
        positionAttribute
      );
    }
    return () => {
      if (particlesRef.current) {
        // Geometry 및 BufferAttribute 해제
        const { geometry, material } = particlesRef.current;
        if (geometry) {
          const attribute = geometry.getAttribute('position');
          if (attribute) {
            attribute.dispose();
          }
          geometry.deleteAttribute('position');
          geometry.dispose();
        }

        // Material 해제
        if (material) {
          if (Array.isArray(material)) {
            material.forEach(mat => mat.dispose());
          } else {
            material.dispose();
          }
        }

        particlesRef.current = null;
      }

      if (magicParticlesRef.current) {
        // Geometry 및 BufferAttribute 해제
        const { geometry, material } = magicParticlesRef.current;
        if (geometry) {
          const attribute = geometry.getAttribute('position');
          if (attribute) {
            attribute.dispose();
          }
          geometry.deleteAttribute('position');
          geometry.dispose();
        }

        // Material 해제
        if (material) {
          if (Array.isArray(material)) {
            material.forEach(mat => mat.dispose());
          } else {
            material.dispose();
          }
        }

        magicParticlesRef.current = null;
      }
    };
  }, [positions, magicPositions]);

  // Animation
  useFrame((state, delta) => {
    // 60fps로 throttling - CPU/GPU 부하 감소

    // time을 한 번만 계산하여 재사용 (렌더링 결과 동일, 성능 개선)
    const time = state.clock.getElapsedTime();

    if (
      particlesRef.current &&
      particlesRef.current.geometry.attributes.position
    ) {
      const positionAttribute =
        particlesRef.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const angle = (i / count) * Math.PI * 2 + time * speed;
        positionAttribute.array[i3] = Math.cos(angle) * radius;
        positionAttribute.array[i3 + 1] = Math.sin(time + i) * 0.2;
        positionAttribute.array[i3 + 2] = Math.sin(angle) * radius;
      }
      positionAttribute.needsUpdate = true;
    }
    if (
      magicParticlesRef.current &&
      magicParticlesRef.current.geometry.attributes.position
    ) {
      const positionAttribute =
        magicParticlesRef.current.geometry.attributes.position;
      for (let i = 0; i < positionAttribute.count; i++) {
        const i3 = i * 3;
        const x = positionAttribute.array[i3];
        const y = positionAttribute.array[i3 + 1];
        const z = positionAttribute.array[i3 + 2];

        positionAttribute.array[i3] = x + Math.sin(time + i) * 0.001;
        positionAttribute.array[i3 + 1] = y + Math.cos(time + i) * 0.001;
        positionAttribute.array[i3 + 2] = z + Math.sin(time * 0.5 + i) * 0.001;
      }
      positionAttribute.needsUpdate = true;
    }
    // Animate orbiting Sparkles
    orbitingSparklesRefs.current.forEach((ref, index) => {
      if (ref.current) {
        // time 재사용 (렌더링 결과 동일, 성능 개선)
        const orbitTime = time * speed + (index * Math.PI * 2) / 10;
        ref.current.position.x = Math.cos(orbitTime) * orbitRadius;
        ref.current.position.y = Math.sin(orbitTime) * orbitRadius * 0.5;
        ref.current.position.z = Math.sin(orbitTime) * orbitRadius;
      }
    });
  });

  const magicCircleRef = useRef();
  useEffect(() => {
    return () => {
      magicCircleRef.current = null;
      if (magicCircleTexture) magicCircleTexture?.dispose();
    };
  }, []);

  // Magic circle texture
  //! 메모리 정리 필요
  const magicCircleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    let finalInnerCircleColor = innerCircleColor;
    let finalGlowColor = glowColor;

    if (!innerCircleColor.startsWith('rgba')) {
      finalInnerCircleColor = colorToRGBA(
        innerCircleColor,
        innerCircleOpacity ?? 0.3,
        innerCircleBrightness
      );
    }
    if (!glowColor.startsWith('rgba')) {
      finalGlowColor = colorToRGBA(
        glowColor,
        glowOpacity ?? 0.5,
        glowBrightness
      );
    }

    drawMagicCircle(
      ctx,
      canvas.width / 2,
      canvas.height / 2,
      0,
      color,
      finalInnerCircleColor,
      finalGlowColor,
      glowIntensity
    );
    return new CanvasTexture(canvas);
  }, [
    color,
    innerCircleColor,
    innerCircleOpacity,
    innerCircleBrightness,
    glowColor,
    glowOpacity,
    glowBrightness,
    glowIntensity,
  ]);

  // Animation
  useFrame((state, delta) => {
    // 60fps로 throttling - 별도의 ref 사용

    if (magicCircleRef.current) {
      magicCircleRef.current.rotation.z += delta * speed;
    }
  });

  // Magic circle drawing function
  function drawMagicCircle(
    ctx,
    centerX,
    centerY,
    time,
    color,
    innerCircleColor,
    glowColor,
    glowIntensity,
    useGlow = true,
    fontWeight = '100'
  ) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    function drawGlowingText(text, x, y, color, size = '12rem', rotation = 0) {
      ctx.save();
      ctx.font = `${fontWeight} ${size} Arial`;
      ctx.translate(x, y);
      ctx.rotate(rotation);
      if (useGlow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = color;
        for (let i = 0; i < 20; i++) {
          ctx.fillText(text, 0, 0);
        }
      }
      ctx.fillStyle = useGlow ? 'rgb(255, 255, 255, 0.9)' : color;
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }

    function drawGlowingLine(drawFunc, color) {
      ctx.save();
      if (useGlow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
          drawFunc();
        }
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        drawFunc();
      }
      ctx.restore();
    }

    // 내부 원 채우기
    ctx.beginPath();
    ctx.arc(centerX, centerY, 200, 0, Math.PI * 2);
    ctx.fillStyle = innerCircleColor;
    ctx.fill();

    // Glow 효과
    if (useGlow) {
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        240
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(0.8, glowColor);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.globalCompositeOperation = 'source-over';
    }

    // Outer circle
    drawGlowingLine(() => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, 240, 0, Math.PI * 2);
      ctx.stroke();
    }, color);

    // Inner circle
    drawGlowingLine(() => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, 200, 0, Math.PI * 2);
      ctx.stroke();
    }, color);

    // Original hexagon
    drawGlowingLine(() => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + time;
        const x = centerX + 220 * Math.cos(angle);
        const y = centerY + 220 * Math.sin(angle);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }, color);

    // Rotated hexagon
    drawGlowingLine(() => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + time + Math.PI / 6;
        const x = centerX + 220 * Math.cos(angle);
        const y = centerY + 220 * Math.sin(angle);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }, color);

    // Connecting outer and inner circles
    drawGlowingLine(() => {
      const segments = 60;
      ctx.beginPath();
      for (let i = 0; i < segments; i++) {
        const angle = ((Math.PI * 2) / segments) * i;
        const xOuter = centerX + 240 * Math.cos(angle);
        const yOuter = centerY + 240 * Math.sin(angle);
        const xInner = centerX + 200 * Math.cos(angle);
        const yInner = centerY + 200 * Math.sin(angle);
        ctx.moveTo(xOuter, yOuter);
        ctx.lineTo(xInner, yInner);
      }
      ctx.stroke();
    }, color);

    // Runic characters or symbols
    drawGlowingText('✧', centerX + 70, centerY - 90, 'blue');
    drawGlowingText(
      '☽',
      centerX - 160,
      centerY + 60,
      'rgb(128, 0, 128)',
      '12rem',
      Math.PI / 1.3
    );
    // Runic characters or symbols (continued)
    drawGlowingText('☉', centerX - 230, centerY - 90, 'red');
    drawGlowingText('✦', centerX + 80, centerY + 220, 'rgb(255, 215, 0)');
  }


  return (
    <>
      <group position={position}>
        <mesh ref={magicCircleRef}>
          <planeGeometry args={[orbitRadius * 2, orbitRadius * 2]} />
          <meshBasicMaterial
            map={magicCircleTexture}
            transparent
            opacity={0.8}
            side={DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </>
  );
}

