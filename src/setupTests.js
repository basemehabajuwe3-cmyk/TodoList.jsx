// src/setupTests.js
import '@testing-library/jest-dom/vitest';

// Nettoyage automatique entre chaque test (recommandé)
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});