export const getDefaultAvatar = (name?: string): string => {
  if (!name) {
    return 'https://ui-avatars.com/api/?name=User&background=D69E66&color=fff';
  }
  
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=D69E66&color=fff`;
};
