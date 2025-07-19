import Config from './Config.js';
import { initCounter } from './util.js';
import type Primitive from './Primitive.js';
import Java from 'frida-java-bridge';

const lambdaCounter = initCounter();

const className = 'com.maars.fmenu.Menu';

/**
 * @class Menu
 * @classdesc Floating menu
 */
export default class Menu {
  private readonly _CheckBox = Java.use('android.widget.CheckBox');
  private readonly _ViewGroup = Java.use('android.view.ViewGroup');
  private readonly _JInteger = Java.use('java.lang.Integer');
  private readonly _Point = Java.use('android.graphics.Point');
  private readonly _RelativeLayout = Java.use('android.widget.RelativeLayout');
  private readonly _RelativeLayout$LayoutParams = Java.use('android.widget.RelativeLayout$LayoutParams');
  private readonly _LinearLayout = Java.use('android.widget.LinearLayout');
  private readonly _LinearLayout$LayoutParams = Java.use('android.widget.LinearLayout$LayoutParams');
  private readonly _ImageView = Java.use('android.widget.ImageView');
  private readonly _ImageView$ScaleType = Java.use('android.widget.ImageView$ScaleType');
  private readonly _WindowManager$LayoutParams = Java.use('android.view.WindowManager$LayoutParams');
  private readonly _PixelFormat = Java.use('android.graphics.PixelFormat');
  private readonly _ViewGroup$MarginLayoutParams = Java.use('android.view.ViewGroup$MarginLayoutParams');
  private readonly _ViewGroup$LayoutParams = Java.use('android.view.ViewGroup$LayoutParams');
  private readonly _Gravity = Java.use('android.view.Gravity');
  private readonly _View = Java.use('android.view.View');
  private readonly _FrameLayout = Java.use('android.widget.FrameLayout');
  private readonly _TypedValue = Java.use('android.util.TypedValue');
  private readonly _Base64 = Java.use('android.util.Base64');
  private readonly _TextView = Java.use('android.widget.TextView');
  private readonly _BitmapFactory = Java.use('android.graphics.BitmapFactory');
  private readonly _TextUtils$TruncateAt = Java.use('android.text.TextUtils$TruncateAt');
  private readonly _Typeface = Java.use('android.graphics.Typeface');
  private readonly _ScrollView = Java.use('android.widget.ScrollView');
  private readonly _Button = Java.use('android.widget.Button');
  private readonly _Context = Java.use('android.content.Context');
  private readonly _JString = Java.use('java.lang.String');
  private readonly _AlertDialog$Builder = Java.use('android.app.AlertDialog$Builder');
  private readonly _Toast = Java.use('android.widget.Toast');
  private readonly _MotionEvent = Java.use('android.view.MotionEvent');
  private readonly _Html = Java.use('android.text.Html');
  private readonly _Switch = Java.use('android.widget.Switch');
  private readonly _ColorStateList = Java.use('android.content.res.ColorStateList');
  private readonly _R$attr = Java.use('android.R$attr');
  private readonly _Color = Java.use('android.graphics.Color');
  private readonly _Log = Java.use('android.util.Log');
  private readonly _SeekBar = Java.use('android.widget.SeekBar');
  private readonly _Build$VERSION = Java.use('android.os.Build$VERSION');
  private readonly _Build$VERSION_CODES = Java.use('android.os.Build$VERSION_CODES');
  private readonly _PorterDuff$Mode = Java.use('android.graphics.PorterDuff$Mode');
  private readonly _EditText = Java.use('android.widget.EditText');
  private readonly _InputType = Java.use('android.text.InputType');
  private readonly _TextView$BufferType = Java.use('android.widget.TextView$BufferType');
  private readonly _WebView = Java.use('android.webkit.WebView');
  private readonly _RadioGroup = Java.use('android.widget.RadioGroup');
  private readonly _RadioButton = Java.use('android.widget.RadioButton');
  private readonly _Intent = Java.use('android.content.Intent');
  private readonly _Uri = Java.use('android.net.Uri');

  private readonly config: Config;
  private readonly position: Java.Wrapper;
  private isCollapsed: boolean;
  private readonly mCollapsed: Java.Wrapper;
  private readonly mExpanded: Java.Wrapper;
  private readonly featureView: Java.Wrapper;
  private readonly launcherIcon: Java.Wrapper;
  private readonly rootFrame: Java.Wrapper;
  private curCollapse: Java.Wrapper | null;
  private windowManager!: Java.Wrapper;
  private readonly wmParams: Java.Wrapper;

  /**
   * @param context - Android context
   * @param  config - Configuration
   * @example
   * const menu = new Menu(context);
   * menu.attach()
   *
   * @example
   * const config = new Config();
   * config.MENU_TITLE = "Moded with Frida";
   * const menu = new Menu(context, config);
   * menu.attach()
   */
  constructor(private readonly context: Java.Wrapper, config = new Config()) {
    this.config = config;
    this.isCollapsed = true;
    this.curCollapse = null;
    this.rootFrame = this._FrameLayout.$new(context);
    this.position = this._Point.$new(0, 0);
    this.mCollapsed = this._RelativeLayout.$new(context);
    this.mExpanded = this._LinearLayout.$new(context);
    this.launcherIcon = this._ImageView.$new(context);
    this.featureView = this._LinearLayout.$new(context);
    this.wmParams = this._WindowManager$LayoutParams.$new(
      this._ViewGroup$LayoutParams.WRAP_CONTENT.value,
      this._ViewGroup$LayoutParams.WRAP_CONTENT.value,
      this._WindowManager$LayoutParams.TYPE_APPLICATION.value,
      this._WindowManager$LayoutParams.FLAG_NOT_FOCUSABLE.value |
      this._WindowManager$LayoutParams.FLAG_LAYOUT_IN_OVERSCAN.value |
      this._WindowManager$LayoutParams.FLAG_LAYOUT_IN_SCREEN.value |
      this._WindowManager$LayoutParams.FLAG_SPLIT_TOUCH.value,
      this._PixelFormat.TRANSPARENT.value,
    );

    this.init();
  }

  /** @internal */
  private init(): void {
    this.rootFrame.setOnTouchListener(this.View$OnTouchListener());
    this.rootFrame.setLayoutParams(
      this._ViewGroup$LayoutParams.$new(this._ViewGroup$LayoutParams.WRAP_CONTENT.value, this._ViewGroup$LayoutParams.WRAP_CONTENT.value),
    );

    this.featureView.setOrientation(this._LinearLayout.VERTICAL.value);
    this.wmParams.gravity.value = this._Gravity.TOP.value | this._Gravity.START.value;
    this.wmParams.x.value = this.position.x.value;
    this.wmParams.y.value = this.position.y.value;

    this.mCollapsed.setVisibility(this._View.VISIBLE.value);
    this.mCollapsed.setAlpha(this.config.MENU_COLLAPSED_ALPHA);

    this.mExpanded.setVisibility(this._View.GONE.value);
    this.mExpanded.setBackgroundColor(this.config.MENU_BG_COLOR);
    this.mExpanded.setOrientation(this._LinearLayout.VERTICAL.value);
    this.mExpanded.setLayoutParams(
      this._LinearLayout$LayoutParams.$new(this.dp(this.config.MENU_WIDTH), this._ViewGroup$LayoutParams.WRAP_CONTENT.value),
    );

    this.launcherIcon.setScaleType(this._ImageView$ScaleType.FIT_XY.value);
    this.launcherIcon.setLayoutParams(
      this._RelativeLayout$LayoutParams.$new(
        this._ViewGroup$LayoutParams.WRAP_CONTENT.value,
        this._ViewGroup$LayoutParams.WRAP_CONTENT.value,
      ),
    );
    const launcherIconSize = this.dp(this.config.MENU_LAUNCHER_ICON_SIZE);
    const launcherIconLayoutParams = this.launcherIcon.getLayoutParams();
    launcherIconLayoutParams.width.value = launcherIconSize;
    launcherIconLayoutParams.height.value = launcherIconSize;
    const launcherIconDecodedImg = this._Base64.decode(this.config.MENU_LAUNCHER_ICON, this._Base64.DEFAULT.value);
    this.launcherIcon.setImageBitmap(
      this._BitmapFactory.decodeByteArray(launcherIconDecodedImg, 0, launcherIconDecodedImg.length),
    );
    Java.cast(launcherIconLayoutParams, this._ViewGroup$MarginLayoutParams).topMargin.value = this.convertDipToPixels(10);
    this.launcherIcon.setOnTouchListener(this.View$OnTouchListener());
    this.launcherIcon.setOnClickListener(this.View$OnClickListener(() => this.expandMenu()));

    const mHeader = this._RelativeLayout.$new(this.context);
    mHeader.setPadding(10, 5, 10, 5);
    mHeader.setVerticalGravity(this._Gravity.CENTER_VERTICAL.value);

    const title = this._TextView.$new(this.context);
    title.setText(this.config.MENU_TITLE);
    title.setTextColor(this.config.TEXT_COLOR_PRIMARY);
    title.setTypeface(null, this._Typeface.BOLD.value);
    title.setTextSize(this.config.MENU_TITLE_SIZE);
    title.setGravity(this._Gravity.CENTER.value);
    const titleLayoutParams = this._RelativeLayout$LayoutParams.$new(
      this._ViewGroup$LayoutParams.WRAP_CONTENT.value,
      this._ViewGroup$LayoutParams.WRAP_CONTENT.value,
    );
    titleLayoutParams.addRule(this._RelativeLayout.CENTER_HORIZONTAL.value);
    title.setLayoutParams(titleLayoutParams);

    const subTitle = this._TextView.$new(this.context);
    subTitle.setText(this.config.MENU_SUBTITLE);
    subTitle.setEllipsize(this._TextUtils$TruncateAt.MARQUEE.value);
    subTitle.setMarqueeRepeatLimit(-1);
    subTitle.setSingleLine(true);
    subTitle.setSelected(true);
    subTitle.setTextColor(this.config.TEXT_COLOR_PRIMARY);
    subTitle.setTextSize(this.config.MENU_SUBTITLE_SIZE);
    subTitle.setGravity(this._Gravity.CENTER.value);
    subTitle.setPadding(0, 0, 0, 5);

    const scrollView = this._ScrollView.$new(this.context);
    scrollView.setBackgroundColor(this.config.MENU_FEATURE_BG_COLOR);
    scrollView.setLayoutParams(
      this._LinearLayout$LayoutParams.$new(this._ViewGroup$LayoutParams.MATCH_PARENT.value, this.dp(this.config.MENU_HEIGHT)),
    );

    const mFooter = this._RelativeLayout.$new(this.context);
    mFooter.setPadding(10, 3, 10, 3);
    mFooter.setVerticalGravity(this._Gravity.CENTER.value);

    const hideBtnLayoutParams = this._RelativeLayout$LayoutParams.$new(
      this._ViewGroup$LayoutParams.WRAP_CONTENT.value,
      this._ViewGroup$LayoutParams.WRAP_CONTENT.value,
    );
    hideBtnLayoutParams.addRule(this._RelativeLayout.ALIGN_PARENT_LEFT.value);

    const hideBtn = this._Button.$new(this.context);
    hideBtn.setText(this.config.MENU_HIDE_BUTTON_TEXT);
    hideBtn.setTextColor(this.config.TEXT_COLOR_PRIMARY);
    hideBtn.setLayoutParams(hideBtnLayoutParams);
    hideBtn.setBackgroundColor(this._Color.TRANSPARENT.value);
    hideBtn.setOnClickListener(
      this.View$OnClickListener((view) => {
        const builder = this._AlertDialog$Builder.$new(this.context);
        builder.setTitle(this._JString.$new('Are you sure you want to hide the menu?'));
        builder.setMessage(
          this._JString.$new('You can always show it again by clicking on the icon. Remember the hidden icon position.'),
        );
        builder.setPositiveButton(
          this._JString.$new('Yes'),
          this.DialogInterface$OnClickListener((dialog, which) => {
            this.hideMenu();
            this._Toast.makeText(this.context, this._JString.$new('Menu hidden'), this._Toast.LENGTH_SHORT.value).show();
          }),
        );

        builder.setNegativeButton(
          this._JString.$new('No'),
          this.DialogInterface$OnClickListener((dialog, which) => {
            // Do nothing
          }),
        );

        const dialog = builder.create();
        dialog.show();
      }),
    );

    const closeBtnLayoutParams = this._RelativeLayout$LayoutParams.$new(
      this._ViewGroup$LayoutParams.WRAP_CONTENT.value,
      this._ViewGroup$LayoutParams.WRAP_CONTENT.value,
    );
    closeBtnLayoutParams.addRule(this._RelativeLayout.ALIGN_PARENT_RIGHT.value);

    const closeBtn = this._Button.$new(this.context);
    closeBtn.setText(this.config.MENU_CLOSE_BUTTON_TEXT);
    closeBtn.setTextColor(this.config.TEXT_COLOR_PRIMARY);
    closeBtn.setLayoutParams(closeBtnLayoutParams);
    closeBtn.setBackgroundColor(this._Color.TRANSPARENT.value);
    closeBtn.setOnClickListener(
      this.View$OnClickListener((view) => {
        this.collapseMenu();
        this._Toast.makeText(this.context, this._JString.$new('Menu closed'), this._Toast.LENGTH_SHORT.value).show();
      }),
    );

    mHeader.addView(title);
    scrollView.addView(this.featureView);

    mFooter.addView(hideBtn);
    mFooter.addView(closeBtn);

    this.mExpanded.addView(mHeader);
    this.mExpanded.addView(subTitle);
    this.mExpanded.addView(scrollView);
    this.mExpanded.addView(mFooter);

    this.mCollapsed.addView(this.launcherIcon);

    this.rootFrame.addView(this.mCollapsed);
    this.rootFrame.addView(this.mExpanded);
  }

  /**
   * Attaches the menu to the screen.
   */
  public attach(): void {
    Java.scheduleOnMainThread(() => {
      this.windowManager = Java.cast(
        this.context.getSystemService(this._Context.WINDOW_SERVICE.value),
        this._ViewGroup,
      );
      this.windowManager.addView(this.rootFrame, this.wmParams);
    });
  }

  /** @internal */
  private collapseMenu(): void {
    this.isCollapsed = true;
    this.mExpanded.setVisibility(this._View.GONE.value);
    this.mCollapsed.setVisibility(this._View.VISIBLE.value);
    this.mCollapsed.setAlpha(this.config.MENU_COLLAPSED_ALPHA);
  }

  /** @internal */
  private expandMenu(): void {
    this.isCollapsed = false;
    this.mCollapsed.setVisibility(this._View.GONE.value);
    this.mExpanded.setVisibility(this._View.VISIBLE.value);
  }

  /** @internal */
  private hideMenu(): void {
    this.isCollapsed = true;
    this.mCollapsed.setVisibility(this._View.VISIBLE.value);
    this.mCollapsed.setAlpha(0);
    this.mExpanded.setVisibility(this._View.GONE.value);
  }

  /** @internal */
  private killMenu(): void {
    this.windowManager.removeView(this.rootFrame);
  }

  /** @internal */
  private addFeature(view: Java.Wrapper): void {
    const currCollapse = this.curCollapse;
    const featureView = this.featureView;
    Java.scheduleOnMainThread(() => {
      if (currCollapse === null) featureView.addView(view);
      else currCollapse.addView(view);
    });
  }

  /**
   * Add a category section to the menu.
   * @param name The name of the category.
   * @example
   * menu.Category('Player');
   */
  public Category(name: string): void {
    const textView = this._TextView.$new(this.context);
    textView.setBackgroundColor(this.config.MENU_CATEGORY_BG_COLOR);
    textView.setText(this._Html.fromHtml(name));
    textView.setTextColor(this.config.TEXT_COLOR_SECONDARY);
    textView.setGravity(this._Gravity.CENTER.value);
    textView.setTypeface(null, this._Typeface.BOLD.value);
    textView.setPadding(0, 5, 0, 5);

    this.addFeature(textView);
  }

  /**
   * Add a slider to the menu.
   * @param featName The name of the feature.
   * @param value The pointer to the value of the feature.
   * @param min The minimum value slider can be set to.
   * @param max The maximum value slider can be set to.
   * @param step The step size of the slider.
   * @throws Error if value is not between min and max.
   * @throws Error if step is less than 1.
   * @throws Error if step is not a divisor of (max - min).
   * @throws Error if min is greater than max.
   * @example
   * const speed = Primitive.of(50);
   * menu.SeekBar('Speed', speed, 0, 100);
   * menu.SeekBar('Speed', speed, 0, 100, 5);
   */
  public SeekBar(featName: string, value: Primitive<number>, min: number, max: number, step = 1): void {
    if (value.get() < min || value.get() > max) throw new Error('Value must be between min and max');
    if (step < 1) throw new Error('Step must be greater than 0');
    if ((max - min) % step != 0) throw new Error('Step must be a divisor of (max - min)');
    if (min > max) throw new Error('Min must be less than max');

    const linearLayout = this._LinearLayout.$new(this.context);
    linearLayout.setPadding(0, 5, 0, 5);
    linearLayout.setOrientation(this._LinearLayout.VERTICAL.value);
    linearLayout.setGravity(this._Gravity.CENTER.value);

    const textView = this._TextView.$new(this.context);
    textView.setText(
      this._Html.fromHtml(featName + ": <font color='" + this.config.NUMBER_TEXT_COLOR + "'>" + value.get() + '</font>'),
    );
    textView.setTextColor(this.config.TEXT_COLOR_SECONDARY);
    textView.setHighlightColor(this.config.TEXT_COLOR_SECONDARY);
    textView.setHintTextColor(this.config.TEXT_COLOR_SECONDARY);

    const seekBar = this._SeekBar.$new(this.context);
    seekBar.setMax((max - min) / step);
    if (this._Build$VERSION.SDK_INT.value >= this._Build$VERSION_CODES.O.value) seekBar.setMin(0);
    seekBar.setPadding(35, 10, 35, 10);
    seekBar.setProgress(value.get());
    seekBar.getThumb().setColorFilter(this.config.SEEKBAR_COLOR, this._PorterDuff$Mode.SRC_ATOP.value);
    seekBar.getProgressDrawable().setColorFilter(this.config.SEEKBAR_PROGRESS_COLOR, this._PorterDuff$Mode.SRC_ATOP.value);

    seekBar.setOnSeekBarChangeListener(
      this.SeekBar$OnSeekBarChangeListener({
        onProgressChanged: (seekBar, progress, fromUser) => {
          value.set(progress * step + min);
          textView.setText(
            this._Html.fromHtml(
              featName + ": <font color='" + this.config.NUMBER_TEXT_COLOR + "'>" + value.get() + '</font>',
            ),
          );
        },
      }),
    );

    linearLayout.addView(textView);
    linearLayout.addView(seekBar);

    this.addFeature(linearLayout);
  }

  /**
   * Add a switch to the menu.
   * @param featName The name of the feature.
   * @param value The pointer to the value of the feature.
   * @example
   * const isGodmode = Primitive.of(false);
   * menu.Switch('Godmode', isGodmode);
   */
  public Switch(featName: string, value: Primitive<boolean>): void {
    const colorStateList = this._ColorStateList.$new(
      [[-this._R$attr.state_enabled.value], [this._R$attr.state_checked.value], []],
      [this._Color.BLUE.value, this._Color.GREEN.value, this._Color.RED.value],
    );

    const switchView = this._Switch.$new(this.context);
    switchView.setText(this._Html.fromHtml(featName));
    switchView.setTextColor(this.config.TEXT_COLOR_SECONDARY);
    switchView.setPadding(10, 5, 0, 5);
    try {
      switchView.setChecked(value.get());
    } catch (e) {
    }

    try {
      switchView.getThumbDrawable().setTintList(colorStateList);
      switchView.getTrackDrawable().setTintList(colorStateList);
    } catch (e) {
      this._Log.e('Error setting tint list for switch', e);
      console.error(e);
      switchView.setTrackResource(0x7f0800a0);
      switchView.setThumbResource(0x7f0800a1);
    }

    switchView.setOnCheckedChangeListener(
      this.CompoundButton$OnCheckedChangeListener((buttonView, isChecked) => {
        value.set(isChecked);
      }),
    );

    this.addFeature(switchView);
  }

  /**
   * Add a text view to the menu.
   * note: this does not fully support html. Use {@link menu.WebTextView}
   * @param text The text to display.
   * @example
   * menu.TextView('Hello world!');
   * menu.TextView('Hello <b>world</b>!');
   * menu.TextView('Hello <font color="#ff0000">world</font>!');
   */
  public TextView(text: string): void {
    const textView = this._TextView.$new(this.context);
    textView.setText(this._Html.fromHtml(text));
    textView.setTextColor(this.config.TEXT_COLOR_SECONDARY);
    textView.setPadding(10, 5, 10, 5);

    this.addFeature(textView);
  }

  /**
   * Add a web text view with full html support to the menu.
   * @param html The html to display.
   * @example
   * menu.WebTextView('<b>Hello world!</b>');
   * menu.WebTextView('<font color="#ff0000">Hello world!</font>');
   * menu.WebTextView('<font size="20">Hello world!</font>');
   */
  public WebTextView(html: string): void {
    Java.scheduleOnMainThread(() => {
      const webView = this._WebView.$new(this.context);
      webView.loadData(html, 'text/html', 'UTF-8');
      webView.setBackgroundColor(this._Color.TRANSPARENT.value);
      webView.setPadding(0, 5, 0, 5);
      webView.getSettings().setDatabaseEnabled(false);

      this.addFeature(webView);
    });
  }

  /**
   * Add a RadioGroup to the menu.
   * @param featName The name of the feature.
   * @param value The pointer to the value of the feature.
   * @param options The options to display.
   * @example
   * const value = Primitive.of(0);
   * const options = ['Option 1', 'Option 2', 'Option 3'];
   * menu.RadioButton('Options', value, options);
   */
  public RadioButton(featName: string, value: Primitive<number>, options: string[]): void {
    if (options.length < 2) throw new Error('Options must be at least 2');
    if (value.get() < 0 || value.get() >= options.length) {
      throw new Error('Value must be between 0 and options.length');
    }

    const textView = this._TextView.$new(this.context);
    textView.setText(
      this._Html.fromHtml(
        featName + ": <font color='" + this.config.NUMBER_TEXT_COLOR + "'>" + options[value.get()] + '</font>',
      ),
    );
    textView.setTextColor(this.config.TEXT_COLOR_SECONDARY);

    const radioGroup = this._RadioGroup.$new(this.context);
    radioGroup.setPadding(10, 5, 10, 5);
    radioGroup.setOrientation(this._LinearLayout.VERTICAL.value);
    Java.cast(radioGroup, this._ViewGroup).addView(textView);

    for (let i = 0; i < options.length; i++) {
      const radioButton = this._RadioButton.$new(this.context);
      radioButton.setText(this._JString.$new(options[i]));
      radioButton.setTextColor(this._Color.LTGRAY.value);
      // @ts-ignore
      radioButton.setButtonTintList(this._ColorStateList.valueOf(this.config.RADIO_BUTTON_COLOR));
      radioButton.setId(i);
      Java.cast(radioGroup, this._ViewGroup).addView(radioButton);

      radioButton.setOnCheckedChangeListener(
        this.CompoundButton$OnCheckedChangeListener((buttonView, isChecked) => {
          if (isChecked) {
            value.set(buttonView.getId());
            textView.setText(
              this._Html.fromHtml(
                featName + ": <font color='" + this.config.NUMBER_TEXT_COLOR + "'>" + options[value.get()] + '</font>',
              ),
            );
          }
        }),
      );

      if (i === value.get()) radioButton.setChecked(true);
    }

    this.addFeature(radioGroup);
  }

  /**
   * Add a on/off button to the menu.
   * @param featName The name of the feature.
   * @param value The pointer to the value of the feature.
   * @example
   * const isGodMode = Primitive.of(false);
   * menu.ButtonOnOff('Feature', isGodMode);
   */
  public ButtonOnOff(featName: string, value: Primitive<boolean>) {
    const btn = this.Button(featName);
    btn.setText(this._Html.fromHtml(featName + ': ' + (value.get() ? 'ON' : 'OFF')));
    btn.setBackgroundColor(value.get() ? this.config.BTN_ON_BG_COLOR : this.config.BTN_OFF_BG_COLOR);

    btn.setOnClickListener(
      this.View$OnClickListener(() => {
        value.set(!value.get());
        btn.setText(this._Html.fromHtml(featName + ': ' + (value.get() ? 'ON' : 'OFF')));
        btn.setBackgroundColor(value.get() ? this.config.BTN_ON_BG_COLOR : this.config.BTN_OFF_BG_COLOR);
      }),
    );

    this.addFeature(btn);
  }

  /**
   * Add a button that opens a url to the menu.
   * @param text The text to display.
   * @param url The url to open.
   * @example
   * menu.ButtonLink('Discord', 'https://discord.gg/abc123');
   * menu.ButtonLink('Website', 'https://example.com');
   */
  public ButtonLink(text: string, url: string): void {
    const button = this.Button(text);
    button.setOnClickListener(
      this.View$OnClickListener(() => {
        const intent = this._Intent.$new(this._Intent.ACTION_VIEW.value, this._Uri.parse(url));
        this.context.startActivity(intent);
      }),
    );

    this.addFeature(button);
  }

  /**
   * Add a CheckBox to the menu.
   * @param featName The name of the feature.
   * @param value The pointer to the value of the feature.
   * @example
   * const isGodMode = Primitive.of(false);
   * menu.CheckBox('God Mode', isGodMode);
   */
  public CheckBox(featName: string, value: Primitive<boolean>): void {
    const checkbox = this._CheckBox.$new(this.context);
    checkbox.setText(this._Html.fromHtml(featName));
    checkbox.setTextColor(this.config.TEXT_COLOR_SECONDARY);
    // @ts-ignore
    checkbox.setButtonTintList(this._ColorStateList.valueOf(this.config.CHECKBOX_COLOR));
    checkbox.setOnCheckedChangeListener(
      this.CompoundButton$OnCheckedChangeListener((buttonView, isChecked) => {
        value.set(isChecked);
      }),
    );

    this.addFeature(checkbox);
  }

  /**
   * Starts a new collapse
   * Every feature added after this will be added to the collapse until endCollapse is called
   * @param title The title of the collapse
   * @throws If there is already a collapse active
   **/
  public startCollapse(title: string) {
    if (this.curCollapse !== null) throw new Error('Cannot start a collapse while another is active');
    this.curCollapse = this.Collapse(title);
  }

  /**
   * Ends the current collapse and adds it to the menu
   * @throws {Error} If there is no collapse active
   **/
  public endCollapse() {
    if (this.curCollapse === null) throw new Error('You must start a collapse before ending it');
    // this.featureView.addView(this.curCollapse);
    this.curCollapse = null;
  }

  /** @internal */
  private Collapse(title: string) {
    const layoutParams = this._LinearLayout$LayoutParams.$new(
      this._ViewGroup$LayoutParams.MATCH_PARENT.value,
      this._ViewGroup$LayoutParams.MATCH_PARENT.value,
    );
    layoutParams.setMargins(0, 5, 0, 5);

    const collapse = this._LinearLayout.$new(this.context);
    collapse.setLayoutParams(layoutParams);
    collapse.setVerticalGravity(this._Gravity.CENTER.value);
    collapse.setOrientation(this._LinearLayout.VERTICAL.value);

    const collapseSub = this._LinearLayout.$new(this.context);
    collapseSub.setVerticalGravity(this._Gravity.CENTER.value);
    collapseSub.setPadding(0, 5, 0, 5);
    collapseSub.setOrientation(this._LinearLayout.VERTICAL.value);
    collapseSub.setBackgroundColor(this.config.COLLAPSE_BG_COLOR);
    collapseSub.setVisibility(this._View.GONE.value);

    const textView = this._TextView.$new(this.context);
    textView.setBackgroundColor(this.config.MENU_CATEGORY_BG_COLOR);
    textView.setText(this._Html.fromHtml('▽ ' + title + ' ▽'));
    textView.setGravity(this._Gravity.CENTER.value);
    textView.setTextColor(this.config.TEXT_COLOR_SECONDARY);
    textView.setTypeface(null, this._Typeface.BOLD.value);
    textView.setPadding(0, 20, 0, 20);

    textView.setOnClickListener(
      this.View$OnClickListener((view) => {
        if (collapseSub.getVisibility() == this._View.GONE.value) {
          collapseSub.setVisibility(this._View.VISIBLE.value);
          textView.setText(this._Html.fromHtml('△ ' + title + ' △'));
        } else {
          collapseSub.setVisibility(this._View.GONE.value);
          textView.setText(this._Html.fromHtml('▽ ' + title + ' ▽'));
        }
      }),
    );

    collapse.addView(textView);
    collapse.addView(collapseSub);
    this.featureView.addView(collapse);

    return collapseSub;
  }

  /**
   * Add a feature to the menu.
   * @param featName The name of the feature.
   * @param value The pointer to the value of the feature.
   * @example
   * const coins = Primitive.of(0);
   * menu.InputNumber('Coins', coins);
   */
  public InputNumber(featName: string, value: Primitive<number>) {
    const layoutParams = this._LinearLayout$LayoutParams.$new(
      this._ViewGroup$LayoutParams.MATCH_PARENT.value,
      this._ViewGroup$LayoutParams.MATCH_PARENT.value,
    );
    layoutParams.setMargins(7, 5, 7, 5);

    const linearLayout = this._LinearLayout.$new(this.context);

    const button = this._Button.$new(this.context);
    button.setText(
      this._Html.fromHtml(featName + ": <font color='" + this.config.NUMBER_TEXT_COLOR + "'>" + value.get() + '</font>'),
    );
    button.setAllCaps(false);
    button.setLayoutParams(layoutParams);
    button.setBackgroundColor(this.config.MENU_BUTTON_BG_COLOR);
    button.setTextColor(this.config.TEXT_COLOR_SECONDARY);

    button.setOnClickListener(
      this.View$OnClickListener((view) => {
        const builder = this._AlertDialog$Builder.$new(this.context);
        builder.setTitle(this._JString.$new(featName));

        const input = this._EditText.$new(this.context);
        input.setInputType(this._InputType.TYPE_CLASS_NUMBER.value);
        input.setText(this._JString.$new(value.get().toString()), this._TextView$BufferType.EDITABLE.value);
        builder.setView(input);

        builder.setPositiveButton(
          this._JString.$new('OK'),
          this.DialogInterface$OnClickListener((dialog, which) => {
            try {
              const chars = Java.cast(input.getText(), this._JString);
              value.set(this._JInteger.parseInt(chars.toString()));
              button.setText(
                this._Html.fromHtml(
                  featName + ": <font color='" + this.config.NUMBER_TEXT_COLOR + "'>" + value.get() + '</font>',
                ),
              );
            } catch (e) {
              this._Toast.makeText(this.context, this._JString.$new('Invalid number'), this._Toast.LENGTH_SHORT.value).show();
            }
          }),
        );
        builder.setNegativeButton(
          this._JString.$new('Cancel'),
          this.DialogInterface$OnClickListener((dialog, which) => {
            dialog.cancel();
          }),
        );

        builder.show();
      }),
    );

    linearLayout.addView(button);
    this.addFeature(linearLayout);
  }

  /**
   * Add a feature to the menu.
   * @param featName The name of the feature.
   * @param value The pointer to the value of the feature.
   * @example
   * const playerName = Primitive.of('My Player');
   * menu.InputText('Player Name', playerName);
   */
  public InputText(featName: string, value: Primitive<string>) {
    const layoutParams = this._LinearLayout$LayoutParams.$new(
      this._ViewGroup$LayoutParams.MATCH_PARENT.value,
      this._ViewGroup$LayoutParams.MATCH_PARENT.value,
    );
    layoutParams.setMargins(7, 5, 7, 5);

    const linearLayout = this._LinearLayout.$new(this.context);

    const button = this._Button.$new(this.context);
    button.setText(
      this._Html.fromHtml(featName + ": <font color='" + this.config.NUMBER_TEXT_COLOR + "'>" + value.get() + '</font>'),
    );
    button.setAllCaps(false);
    button.setLayoutParams(layoutParams);
    button.setBackgroundColor(this.config.MENU_BUTTON_BG_COLOR);
    button.setTextColor(this.config.TEXT_COLOR_SECONDARY);

    button.setOnClickListener(
      this.View$OnClickListener((view) => {
        const builder = this._AlertDialog$Builder.$new(this.context);
        builder.setTitle(this._JString.$new(featName));

        const input = this._EditText.$new(this.context);
        input.setInputType(this._InputType.TYPE_CLASS_TEXT.value);
        input.setText(this._JString.$new(value.get()), this._TextView$BufferType.EDITABLE.value);
        builder.setView(input);

        builder.setPositiveButton(
          this._JString.$new('OK'),
          this.DialogInterface$OnClickListener((dialog, which) => {
            const chars = Java.cast(input.getText(), this._JString);
            value.set(chars.toString());
            button.setText(
              this._Html.fromHtml(
                featName + ": <font color='" + this.config.NUMBER_TEXT_COLOR + "'>" + value.get() + '</font>',
              ),
            );
          }),
        );
        builder.setNegativeButton(
          this._JString.$new('Cancel'),
          this.DialogInterface$OnClickListener((dialog, which) => {
            dialog.cancel();
          }),
        );

        builder.show();
      }),
    );

    linearLayout.addView(button);
    this.addFeature(linearLayout);
  }

  /**
   * Add a feature to the menu.
   * @param featName The name of the feature.
   * @param fn The function to be called when the button is pressed.
   * @example
   * menu.ButtonAction('Kill All', () => {
   *  // Kill all players
   * });
   */
  public ButtonAction(featName: string, fn: () => void): void {
    const btn = this.Button(featName);
    btn.setOnClickListener(
      this.View$OnClickListener((view) => {
        fn();
      }),
    );
    this.addFeature(btn);
  }

  /** @internal */
  private Button(featName: string): Java.Wrapper {
    const layoutParams = this._LinearLayout$LayoutParams.$new(
      this._ViewGroup$LayoutParams.MATCH_PARENT.value,
      this._ViewGroup$LayoutParams.MATCH_PARENT.value,
    );
    layoutParams.setMargins(7, 5, 7, 5);

    const btn = this._Button.$new(this.context);
    btn.setLayoutParams(layoutParams);
    btn.setText(this._Html.fromHtml(featName));
    btn.setAllCaps(false);
    btn.setBackgroundColor(this.config.MENU_BUTTON_BG_COLOR);
    btn.setTextColor(this.config.TEXT_COLOR_SECONDARY);
    btn.setHintTextColor(this.config.TEXT_COLOR_SECONDARY);
    btn.setHighlightColor(this.config.TEXT_COLOR_SECONDARY);

    return btn;
  }

  private View$OnClickListener(fn: (view: Java.Wrapper) => void): Java.Wrapper {
    return Java.registerClass({
      name: `${className}_OnClickListener$${lambdaCounter()}`,
      implements: [Java.use('android.view.View$OnClickListener')],
      methods: { onClick: fn },
    }).$new();
  }

  private SeekBar$OnSeekBarChangeListener({
    onProgressChanged = (seekBar, progress, fromUser) => { },
    onStartTrackingTouch = (seekBar) => { },
    onStopTrackingTouch = (seekBar) => { },
  }: {
    onProgressChanged?: (seekBar: Java.Wrapper, progress: number, fromUser: boolean) => void;
    onStartTrackingTouch?: (seekBar: Java.Wrapper) => void;
    onStopTrackingTouch?: (seekBar: Java.Wrapper) => void;
  }): Java.Wrapper {
    return Java.registerClass({
      name: `${className}_OnSeekBarChangeListener$${lambdaCounter()}`,
      implements: [Java.use('android.widget.SeekBar$OnSeekBarChangeListener')],
      methods: {
        onProgressChanged,
        onStartTrackingTouch,
        onStopTrackingTouch,
      },
    }).$new();
  }

  /** @internal */
  private CompoundButton$OnCheckedChangeListener(
    fn: (buttonView: Java.Wrapper, isChecked: boolean) => void,
  ): Java.Wrapper {
    return Java.registerClass({
      name: `${className}_OnCheckedChangeListener$${lambdaCounter()}`,
      implements: [Java.use('android.widget.CompoundButton$OnCheckedChangeListener')],
      methods: { onCheckedChanged: fn },
    }).$new();
  }

  /** @internal */
  private DialogInterface$OnClickListener(fn: (dialog: Java.Wrapper, which: number) => void): Java.Wrapper {
    return Java.registerClass({
      name: `${className}_OnClickListener$${lambdaCounter()}`,
      implements: [Java.use('android.content.DialogInterface$OnClickListener')],
      methods: { onClick: fn },
    }).$new();
  }

  /** @internal */
  private View$OnTouchListener(): Java.Wrapper {
    const menu = this;
    const initialTouch = this._Point.$new(0, 0);
    const initialPosition = this._Point.$new(0, 0);

    return Java.registerClass({
      name: `${className}_OnTouchListener$${lambdaCounter()}`,
      implements: [Java.use('android.view.View$OnTouchListener')],
      methods: {
        onTouch(view: Java.Wrapper, motionEvent: Java.Wrapper): boolean {
          switch (motionEvent.getAction()) {
            case this._MotionEvent.ACTION_DOWN.value:
              initialTouch.x.value = Math.round(motionEvent.getRawX());
              initialTouch.y.value = Math.round(motionEvent.getRawY());
              initialPosition.x.value = menu.position.x.value;
              initialPosition.y.value = menu.position.y.value;

              break;
            case this._MotionEvent.ACTION_MOVE.value:
              menu.rootFrame.setAlpha(0.5);
              const x = initialPosition.x.value + Math.round(motionEvent.getRawX() - initialTouch.x.value);
              const y = initialPosition.y.value + Math.round(motionEvent.getRawY() - initialTouch.y.value);
              menu.position.x.value = x;
              menu.position.y.value = y;
              const params = Java.cast(menu.rootFrame.getLayoutParams(), this._WindowManager$LayoutParams);
              params.x.value = x;
              params.y.value = y;
              menu.windowManager.updateViewLayout(menu.rootFrame, params);

              break;
            case this._MotionEvent.ACTION_UP.value:
              menu.rootFrame.setAlpha(1);
              const rawX = Math.round(motionEvent.getRawX() - initialTouch.x.value);
              const rawY = Math.round(motionEvent.getRawY() - initialTouch.y.value);
              if (rawX < 5 && rawY < 5 && menu.isCollapsed) menu.expandMenu();

              break;
            default:
              return false;
          }

          return true;
        },
      },
    }).$new();
  }

  /** @internal */
  private dp(i: number): number {
    const displayMetrics = this.context.getResources().getDisplayMetrics();
    const result = this._TypedValue.applyDimension(this._TypedValue.COMPLEX_UNIT_DIP.value, i, displayMetrics);
    return Math.round(result);
  }

  /** @internal */
  private convertDipToPixels(i: number): number {
    const displayMetrics = this.context.getResources().getDisplayMetrics();
    const result = i * displayMetrics.density.value + 0.5;
    return Math.round(result);
  }
}
