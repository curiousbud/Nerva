// Version utility to get current version info
export const VERSION = "1.3.0";
export const VERSION_NAME = "Tool-First";
export const RELEASE_DATE = "2026-06-27";

export function getVersionInfo() {
  return {
    version: VERSION,
    name: VERSION_NAME,
    date: RELEASE_DATE,
    fullName: `v${VERSION} - ${VERSION_NAME}`
  };
}

export function formatVersion() {
  return `v${VERSION}`;
}
