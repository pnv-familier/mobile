export const getDefaultAvatar = (name?: string) => {
  const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E2'];
  const initial = name?.charAt(0).toUpperCase() || 'U';
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
  return `https://ui-avatars.com/api/?name=${initial}&background=${colors[colorIndex]}&color=fff&size=128`;
};
