
// Type declarations for A-Frame elements
declare namespace JSX {
  interface IntrinsicElements {
    'a-scene': any;
    'a-entity': any;
    'a-camera': any;
    'a-box': any;
    'a-sphere': any;
    'a-cursor': any;
    'a-sky': any;
    'a-plane': any;
    'a-text': any;
    'a-assets': any;
    'a-asset-item': any;
  }
}

// Declare global AR.js and A-Frame variables that might be used
interface Window {
  AFRAME: any;
  THREEx: {
    ArToolkitContext: {
      baseURL: string;
    };
  };
}
