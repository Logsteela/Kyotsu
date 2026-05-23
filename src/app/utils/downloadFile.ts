function getFileNameFromUrl(url: string): string {
  const withoutQuery = url.split('?')[0] ?? url;
  const fileName = withoutQuery.split('/').filter(Boolean).pop();

  return fileName ? decodeURIComponent(fileName) : 'download';
}

function clickDownloadLink(url: string, fileName: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.rel = 'noopener noreferrer';
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function forceBrowserDownload(url: string, fileName?: string) {
  const downloadName = fileName || getFileNameFromUrl(url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    try {
      clickDownloadLink(objectUrl, downloadName);
    } finally {
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
    }
  } catch {
    clickDownloadLink(url, downloadName);
  }
}
