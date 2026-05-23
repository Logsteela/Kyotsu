function getFileNameFromUrl(url: string): string {
  const withoutQuery = url.split('?')[0] ?? url;
  const fileName = withoutQuery.split('/').filter(Boolean).pop();

  return fileName ? decodeURIComponent(fileName) : 'download';
}

function buildDownloadEndpoint(url: string, fileName: string): string {
  const params = new URLSearchParams();
  params.set('url', url);
  params.set('name', fileName);

  return `/dl?${params.toString()}`;
}

export function forceBrowserDownload(url: string, fileName?: string) {
  const downloadName = fileName || getFileNameFromUrl(url);
  const endpoint = buildDownloadEndpoint(url, downloadName);
  const frame = document.createElement('iframe');

  frame.src = endpoint;
  frame.style.display = 'none';
  frame.setAttribute('aria-hidden', 'true');

  document.body.appendChild(frame);
  window.setTimeout(() => frame.remove(), 60_000);
}
