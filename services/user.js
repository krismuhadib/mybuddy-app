import { GetMedia } from './api';

export const GetAvatar = async (medias) => {
    const avatarObject = medias.filter(item => item.section === 'avatar');
    if (avatarObject && avatarObject[avatarObject.length - 1]) {
      return await GetMedia({
        file: avatarObject[avatarObject.length - 1].file,
        section: 'avatar',
        size: 'small'
      });
    }
    return null;
  };