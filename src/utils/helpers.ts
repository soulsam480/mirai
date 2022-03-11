import { Role } from '@prisma/client';

export function isInstituteRole(role: 'STUDENT' | 'INSTITUTE' | 'INSTITUTE_MOD' | 'ADMIN') {
  return {
    isMod: role === 'INSTITUTE_MOD',
    isOwner: role === 'INSTITUTE',
    is: ['INSTITUTE', 'INSTITUTE_MOD'].includes(role),
  };
}

export function getUserHome(role: Role) {
  return role === 'ADMIN' ? '/admin' : isInstituteRole(role).is ? '/institute' : '/student';
}

export async function copyToClip(value: string) {
  const isSupported = Boolean(navigator && 'clipboard' in navigator);

  if (!isSupported) return Promise.reject();

  navigator.clipboard.writeText(value).then(() => Promise.resolve());
}

export function defineSidebar(base: string) {
  const stack: Record<'path' | 'label', string>[] = [
    {
      label: 'Home',
      path: base,
    },
  ];
  return {
    stack,
    extend(entries: typeof stack) {
      stack.push(...entries.map((e) => ({ ...e, path: base + e.path })));

      return stack;
    },
  };
}
