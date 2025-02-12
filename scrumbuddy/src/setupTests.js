import '@testing-library/jest-dom';

// src/setupTests.js
import { ReadableStream } from "stream/web"; // Node 18+ built-in polyfill

// Set the global polyfill
if (typeof global.ReadableStream === "undefined") {
  global.ReadableStream = ReadableStream;
}

// Other global setup (if needed)
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
