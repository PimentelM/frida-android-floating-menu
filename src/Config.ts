// import Java from 'frida-java-bridge'
export interface ConfigInterface {
  MENU_WIDTH: number;
  MENU_HEIGHT: number;
  MENU_COLLAPSED_ALPHA: number;
  MENU_LAUNCHER_ICON_SIZE: number;
  MENU_TITLE_SIZE: number;
  MENU_SUBTITLE_SIZE: number;
  BTN_ON_BG_COLOR: any;
  BTN_OFF_BG_COLOR: any;
  CHECKBOX_COLOR: any;
  MENU_CLOSE_BUTTON_TEXT: any;
  MENU_HIDE_BUTTON_TEXT: any;
  MENU_FEATURE_BG_COLOR: any;
  TEXT_COLOR_PRIMARY: any;
  MENU_CATEGORY_BG_COLOR: any;
  MENU_BG_COLOR: any;
  RADIO_BUTTON_COLOR: any;
  NUMBER_TEXT_COLOR: any;
  MENU_TITLE: any;
  MENU_BUTTON_BG_COLOR: any;
  SEEKBAR_COLOR: any;
  SEEKBAR_PROGRESS_COLOR: any;
  TEXT_COLOR_SECONDARY: any;
  COLLAPSE_BG_COLOR: any;
  MENU_SUBTITLE: any;
  MENU_LAUNCHER_ICON: string;
}

export default (callback: (config: ConfigInterface) => void): void => {
  const Java: any = require('frida-java-bridge');
  console.log('Making config object')
  Java.perform(() => {
    console.log('Inside Java.perform - Config')
    const Html = Java.use('android.text.Html');
    const Color = Java.use('android.graphics.Color');

    /**
     * MenuConfig
     * @class A class that contains all the configuration for the menu.
     */
    class Config implements ConfigInterface {
      public MENU_WIDTH = 290;
      public MENU_HEIGHT = 210;
      public MENU_COLLAPSED_ALPHA = 0.7;
      public MENU_LAUNCHER_ICON_SIZE = 45;
      public MENU_TITLE_SIZE = 18;
      public MENU_SUBTITLE_SIZE = 10;
      public BTN_ON_BG_COLOR = Color.parseColor('#1b5e20');
      public BTN_OFF_BG_COLOR = Color.parseColor('#7f0000');
      public CHECKBOX_COLOR = Color.parseColor('#80CBC4');
      public MENU_CLOSE_BUTTON_TEXT = Html.fromHtml('&#x2715;');
      public MENU_HIDE_BUTTON_TEXT = Html.fromHtml('&#x25B3;');
      public MENU_FEATURE_BG_COLOR = Color.parseColor('#DD141C22');
      public TEXT_COLOR_PRIMARY = Color.parseColor('#82CAFD');
      public MENU_CATEGORY_BG_COLOR = Color.parseColor('#2F3D4C');
      public MENU_BG_COLOR = Color.parseColor('#EE1C2A35');
      public RADIO_BUTTON_COLOR = Color.parseColor('#FFFFFF');
      public NUMBER_TEXT_COLOR = Color.parseColor('#41c300');
      public MENU_TITLE = Html.fromHtml('-');
      public MENU_BUTTON_BG_COLOR = Color.parseColor('#1C262D');
      public SEEKBAR_COLOR = Color.parseColor('#80CBC4');
      public SEEKBAR_PROGRESS_COLOR = Color.parseColor('#80CBC4');
      public TEXT_COLOR_SECONDARY = Color.parseColor('#FFFFFF');
      public COLLAPSE_BG_COLOR = Color.parseColor('#222D38');

      public MENU_SUBTITLE = Html.fromHtml('-');

      /**
       *Base 64 encoded image of the launcher icon.
       */
      public MENU_LAUNCHER_ICON =
        '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';
    }
    console.log(`Returning config object`)
    callback(new Config());
  })
}