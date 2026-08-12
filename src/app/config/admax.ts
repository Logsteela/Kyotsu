export type AdMaxType = 'switch' | 'banner';

export const ADMAX = {
  homeQuick: { id: '53bee1e2e9d06ce1542af3ac370e79e0', type: 'switch' as const },
  homeAbout: { id: 'd82a66220e2dca20145362f301b6c670', type: 'switch' as const },
  homeHistory: { id: '90646b34713ea686a613e8bca368daf6', type: 'switch' as const },
  tableBetweenMobile: { id: '63436e63407fb49adb74b5bbf7305ea3', type: 'banner' as const },
  tableBottom: { id: '98e35917e1e23759968d36d4a4700af8', type: 'switch' as const },
  testBottom: { id: '52562c2bfc19b78a4afa2ed5a82fe1b0', type: 'switch' as const },
} as const;
