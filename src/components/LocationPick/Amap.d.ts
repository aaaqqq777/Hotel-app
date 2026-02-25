declare namespace AMap {
  class Map {
    constructor(container: string | HTMLDivElement, opts?: any);
    on(event: string, handler: (e: any) => void): void;
    addControl(control: any): void;
    add(overlay: any): void;
    remove(overlay: any): void;
    setFitView(overlays?: any[]): void;
    destroy(): void;
  }

  class Geolocation {
    constructor(opts?: any);
    getCurrentPosition(callback: (status: string, result: any) => void): void;
  }
  
  class LngLat {
      constructor(lng: number, lat: number);
      getLng(): number;
      getLat(): number;
  }

  class Marker {
      constructor(opts?: any);
  }

  class Pixel {
      constructor(x: number, y: number);
  }

  function plugin(plugins: string[], callback: () => void): void;
}
