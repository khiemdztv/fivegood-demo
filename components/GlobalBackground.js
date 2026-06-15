'use client';
import React from 'react';

export default function GlobalBackground() {
  return (
    <div className="global-bg-container" aria-hidden="true">
      {/* Layer 1: Animated Aurora Gradient */}
      <div className="global-bg-aurora" />

      {/* Layer 2: Subtle Grid Pattern */}
      <div className="global-bg-grid" />

      {/* Layer 3: Floating Glow Orbs (5 distinct floating blur orbs) */}
      <div className="global-bg-orb global-bg-orb--1" />
      <div className="global-bg-orb global-bg-orb--2" />
      <div className="global-bg-orb global-bg-orb--3" />
      <div className="global-bg-orb global-bg-orb--4" />
      <div className="global-bg-orb global-bg-orb--5" />

      {/* Layer 4: Noise Texture */}
      <div className="global-bg-noise" />
    </div>
  );
}
