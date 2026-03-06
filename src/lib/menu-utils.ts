// 找父级
export function findParentKey(menus: any[], path: string): string | null {
  for (const menu of menus) {
    if (menu.children?.some((child: any) => child.key === path)) {
      return menu.key;
    }
    if (menu.children) {
      const found = findParentKey(menu.children, path);
      if (found) return found;
    }
  }
  return null;
}

// 找完整链条
export function findRouteChain(menus: any[], path: string): { chain: string[], matchedMenus: any[] } {
  const stack: string[] = [];
  const matchedMenus: any[] = [];

  function dfs(items: any[], target: string): boolean {
    for (const item of items) {
      stack.push(item.key);
      matchedMenus.push(item);
      if (item.key === target) return true;
      if (item.children && dfs(item.children, target)) return true;
      stack.pop();
      matchedMenus.pop();
    }
    return false;
  }

  dfs(menus, path);

  return {
    chain: [...stack],         // 比如 ["dashboard", "user", "profile"]
    matchedMenus: [...matchedMenus] // 对应的菜单对象链条
  };
}
