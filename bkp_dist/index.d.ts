declare class Config {
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

declare class Primitive<T> {
    private value;
    constructor(value: T);
    get(): T;
    set(value: T): void;
    static of<T>(value: T): Primitive<T>;
}

declare class Menu {
    private readonly context;
    private readonly config;
    private readonly position;
    private isCollapsed;
    private readonly mCollapsed;
    private readonly mExpanded;
    private readonly featureView;
    private readonly launcherIcon;
    private readonly rootFrame;
    private curCollapse;
    private windowManager;
    private readonly wmParams;
    constructor(context: Java.Wrapper, config?: Config);
    private init;
    attach(): void;
    private collapseMenu;
    private expandMenu;
    private hideMenu;
    private killMenu;
    private addFeature;
    Category(name: string): void;
    SeekBar(featName: string, value: Primitive<number>, min: number, max: number, step?: number): void;
    Switch(featName: string, value: Primitive<boolean>): void;
    TextView(text: string): void;
    WebTextView(html: string): void;
    RadioButton(featName: string, value: Primitive<number>, options: string[]): void;
    ButtonOnOff(featName: string, value: Primitive<boolean>): void;
    ButtonLink(text: string, url: string): void;
    CheckBox(featName: string, value: Primitive<boolean>): void;
    startCollapse(title: string): void;
    endCollapse(): void;
    private Collapse;
    InputNumber(featName: string, value: Primitive<number>): void;
    InputText(featName: string, value: Primitive<string>): void;
    ButtonAction(featName: string, fn: () => void): void;
    private Button;
    private View$OnClickListener;
    private SeekBar$OnSeekBarChangeListener;
    private CompoundButton$OnCheckedChangeListener;
    private View$OnLongClickListener;
    private DialogInterface$OnClickListener;
    private View$OnTouchListener;
    private dp;
    private convertDipToPixels;
}

export { Config, Menu, Primitive };
