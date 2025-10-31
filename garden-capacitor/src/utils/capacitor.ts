import { Plugins } from '@capacitor/core';

const { Device, Toast } = Plugins;

export const initializeCapacitor = async () => {
  try {
    const info = await Device.getInfo();
    console.log('Device Info:', info);
  } catch (error) {
    console.error('Error getting device info:', error);
  }
};

export const showToast = async (message: string) => {
  try {
    await Toast.show({
      text: message,
      duration: 'short',
    });
  } catch (error) {
    console.error('Error showing toast:', error);
  }
};