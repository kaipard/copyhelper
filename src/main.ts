import { Plugin, TFile, Menu } from 'obsidian';
import i18next from 'i18next';

export default class CopyHelper extends Plugin {
  private async loadTranslations() {
    const userLang = window.localStorage.getItem('language') || 'en';

    // 动态加载语言文件
    const translations = require(`./locales/${userLang}.json`);

    await i18next.init({
      lng: userLang,
      fallbackLng: 'en',
      resources: {
        [userLang]: {
          translation: translations
        }
      }
    });
  }

  private async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error(i18next.t('Copyfailed'), err);
    }
  }

  async onload() {
    await this.loadTranslations();

    this.registerEvent(
      this.app.workspace.on('file-menu', ((menu: Menu, file: TFile) => {
        menu.addItem((item) => {
          item
            .setTitle(i18next.t('Copyfilename'))
            .setIcon('clipboard')
            .onClick(() => {
              if (file instanceof TFile) {
                const fileName = file.basename;
                this.copyToClipboard(fileName);
              }
            });
        });

        menu.addItem((item) => {
          item
            .setTitle(i18next.t('Copyfilenamewithextension'))
            .setIcon('clipboard')
            .onClick(() => {
              if (file instanceof TFile) {
                const fileName = file.name;
                this.copyToClipboard(fileName);
              }
            });
        });
      }) as any)
    );
  }
} 