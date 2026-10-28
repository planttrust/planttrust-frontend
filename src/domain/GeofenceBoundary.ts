export interface LatLng {
  lat: number;
  lng: number;
}

export class GeofenceBoundary {
  constructor(
    public readonly name: string,
    public readonly coordinates: [number, number][]
  ) {
    if (coordinates.length < 3) {
      throw new Error('A valid geofence boundary requires at least 3 coordinate points');
    }
  }

  /**
   * Ray-casting point-in-polygon containment test
   */
  public containsPoint(lat: number, lng: number): boolean {
    let inside = false;
    const coords = this.coordinates;

    for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
      const xi = coords[i][0];
      const yi = coords[i][1];
      const xj = coords[j][0];
      const yj = coords[j][1];

      const intersect = yi > lng !== yj > lng && lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  public getCentroid(): [number, number] {
    let sumLat = 0;
    let sumLng = 0;
    for (const [lat, lng] of this.coordinates) {
      sumLat += lat;
      sumLng += lng;
    }
    return [sumLat / this.coordinates.length, sumLng / this.coordinates.length];
  }

  public getBounds(): [[number, number], [number, number]] {
    let minLat = Infinity,
      maxLat = -Infinity;
    let minLng = Infinity,
      maxLng = -Infinity;

    for (const [lat, lng] of this.coordinates) {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    }

    return [
      [minLat, minLng],
      [maxLat, maxLng],
    ];
  }

  public toJSON() {
    return {
      name: this.name,
      coordinates: this.coordinates,
      centroid: this.getCentroid(),
    };
  }

  public static fromJSON(data: any): GeofenceBoundary {
    return new GeofenceBoundary(data.name || 'Boundary', data.coordinates || []);
  }
}
