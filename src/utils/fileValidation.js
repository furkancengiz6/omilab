import toast from 'react-hot-toast';

export const validateFiles = (files, isPremium = false) => {
  const MAX_FREE_MB = 20;
  const MAX_PREMIUM_MB = 100;
  
  const limitMB = isPremium ? MAX_PREMIUM_MB : MAX_FREE_MB;
  const limitBytes = limitMB * 1024 * 1024;
  
  for (let i = 0; i < files.length; i++) {
    if (files[i].size > limitBytes) {
      toast.error(`Dosya çok büyük: ${files[i].name}. Limit: ${limitMB}MB`);
      return false;
    }
  }
  return true;
};
