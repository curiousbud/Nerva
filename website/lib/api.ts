// API utilities for GitHub Pages deployment

export const getBasePath = () => {
  return process.env.NODE_ENV === 'production' ? '/Nerva' : '';
};

export const getApiUrl = (path: string) => {
  const basePath = getBasePath();
  return `${basePath}${path}`;
};

export async function fetchScriptsData() {
  try {
    const response = await fetch(getApiUrl('/data/scripts.json'));
    if (!response.ok) {
      throw new Error(`Failed to load scripts data: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading scripts:', error);
    throw error;
  }
}
