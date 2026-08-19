export interface CoordenadasPais {
  id: string
  lat: number
  lng: number
  zoom: number
}

export const coordenadasPaises: CoordenadasPais[] = [
  { id: 'honduras-001', lat: 14.0723, lng: -87.1921, zoom: 7 },
  { id: 'guatemala-001', lat: 15.7835, lng: -90.2308, zoom: 7 },
  { id: 'el-salvador-001', lat: 13.7942, lng: -88.8965, zoom: 8 },
  { id: 'nicaragua-001', lat: 12.8654, lng: -85.2072, zoom: 7 },
  { id: 'costa-rica-001', lat: 9.7489, lng: -83.7534, zoom: 7 },
  { id: 'panama-001', lat: 8.538, lng: -80.7821, zoom: 7 },
  { id: 'mexico-001', lat: 23.6345, lng: -102.5528, zoom: 5 },
  { id: 'colombia-001', lat: 4.5709, lng: -74.2973, zoom: 5 },
  { id: 'peru-001', lat: -9.19, lng: -75.0152, zoom: 5 },
  { id: 'brasil-001', lat: -14.235, lng: -51.9253, zoom: 4 },
  { id: 'argentina-001', lat: -38.4161, lng: -63.6167, zoom: 4 },
  { id: 'chile-001', lat: -35.6751, lng: -71.543, zoom: 5 },
  { id: 'ecuador-001', lat: -1.8312, lng: -78.1834, zoom: 7 },
  { id: 'bolivia-001', lat: -16.2902, lng: -63.5887, zoom: 5 },
  { id: 'paraguay-001', lat: -23.4425, lng: -58.4438, zoom: 6 },
  { id: 'uruguay-001', lat: -32.5228, lng: -55.7658, zoom: 7 },
  { id: 'venezuela-001', lat: 6.4238, lng: -66.5897, zoom: 5 },
]

export function getCoordenadasPais(paisId: string): CoordenadasPais | undefined {
  return coordenadasPaises.find((c) => c.id === paisId)
}
