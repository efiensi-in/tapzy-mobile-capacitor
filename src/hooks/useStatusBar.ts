import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

type StatusBarStyle = 'light' | 'dark';

/**
 * Hook untuk mengatur StatusBar secara dinamis
 * - light: icon/text putih (untuk background gelap)
 * - dark: icon/text hitam (untuk background terang)
 */
export function useStatusBar(style: StatusBarStyle = 'light') {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const setStatusBarStyle = async () => {
      try {
        await StatusBar.setStyle({
          style: style === 'light' ? Style.Dark : Style.Light,
        });

        // Disable overlay untuk solid background
        await StatusBar.setOverlaysWebView({ overlay: false });

        // Android: set solid black
        if (Capacitor.getPlatform() === 'android') {
          await StatusBar.setBackgroundColor({ color: '#000000' });
        }
      } catch (error) {
        console.warn('StatusBar error:', error);
      }
    };

    setStatusBarStyle();
  }, [style]);
}

/**
 * Utility function untuk set StatusBar (non-hook)
 */
export async function setStatusBarStyle(style: StatusBarStyle) {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await StatusBar.setStyle({
      style: style === 'light' ? Style.Dark : Style.Light,
    });
  } catch (error) {
    console.warn('StatusBar error:', error);
  }
}

/**
 * Hide status bar (fullscreen)
 */
export async function hideStatusBar() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await StatusBar.hide();
  } catch (error) {
    console.warn('StatusBar error:', error);
  }
}

/**
 * Show status bar
 */
export async function showStatusBar() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await StatusBar.show();
  } catch (error) {
    console.warn('StatusBar error:', error);
  }
}
