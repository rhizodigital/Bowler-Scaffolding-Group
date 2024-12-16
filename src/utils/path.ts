export const ensureTrailingSlash = (path: string) => {
  if (!path) {
    return "/";
  }

  return path.endsWith("/") ? path : `${path}/`;
};

export const activeLink = (path: string, currentPath: string) => {
  const parts = currentPath.split("/").filter(Boolean);

  if (!isNaN(parts[parts.length - 1] as any)) {
    parts.pop();
  }

  const pathWithoutPagination = `/${parts.join("/")}/`;

  return path === pathWithoutPagination;
};
