'use client';

import '@charcoal-ui/icons';
import { useEffect } from 'react';

export function IconProvider() {
  useEffect(() => {
    if (!customElements.get('pixiv-icon')) {
      customElements.define('pixiv-icon', class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
        }

        static get observedAttributes() {
          return ['name', 'scale'];
        }

        attributeChangedCallback() {
          this.update();
        }

        update() {
          const name = this.getAttribute('name');
          const scale = this.getAttribute('scale') || '1';
          if (name) {
            import('@charcoal-ui/icons').then(module => {
              const svg = module[name];
              if (svg) {
                this.shadowRoot.innerHTML = `<style>:host { display: inline-block; width: ${24 * Number(scale)}px; height: ${24 * Number(scale)}px; }</style>${svg}`;
              }
            });
          }
        }
      });
    }
  }, []);

  return null;
} 