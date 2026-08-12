declare global {
  interface Window {
    admaxads: Array<{
      admax_id: string;
      type: 'switch' | 'banner';
    }>;
    __admax_tag__?: unknown;
    __admax_render__?: unknown;
  }
}

export {};
