import * as foundry from "../../types/foundry/index";
import { SelectionTranslator } from "./ComprehendLanguagesTranslator";
import { addTranslateButton } from "./lib";
import { ComprehendLanguagesStatic } from "./statics";

declare const game: Game;
export class ComprehendLanguages {
  // static ID = "comprehend-languages";

  // static FLAGS = {
  //   COMPREHENDLANGUAGES: "COMPREHENDLANGUAGES",
  // };

  // static SETTINGS = {
  //   DEEPL_TOKEN: "deepl-token",
  //   TARGET_LANG: "target-language",
  //   SUBSETTINGS_MENU: "subsetting-menu",
  //   ICON_ONLY: "iconOnly",
  //   SEPARATE_FOLDER: "separate-folder",
  //   TRANSLATE_FOLDER_NAME: "translate-folder-name",
  //   TRANSLATE_JOURNAL_NAME: "translate-journal-name",
  // };

  static log(force, ...args) {
    const shouldLog =
      force ||
      //      @ts-ignore
      game.modules.get("_dev-mode")?.api?.getPackageDebugValue(this.ID);

    if (shouldLog) {
      console.log(ComprehendLanguagesStatic.ID, "|", ...args);
    }
  }

  static initialize() {
    game.settings.register(
      ComprehendLanguagesStatic.ID,
      ComprehendLanguagesStatic.SETTINGS.DEEPL_TOKEN,
      {
        name: "comprehend-languages.deepl-token",
        config: true,
        hint: "comprehend-languages.deepl-token_hint",
        type: String,
        default: "",
        scope: "world",
      }
    );

    game.settings.register(
      ComprehendLanguagesStatic.ID,
      ComprehendLanguagesStatic.SETTINGS.TARGET_LANG,
      {
        name: "comprehend-languages.target-language",
        config: true,
        hint: "comprehend-languages.target-language_hint",
        type: String,
        default: "DE",
        choices: {
          BG: "Bulgarian",
          CS: "Czech",
          DA: "Danish",
          DE: "German",
          EL: "Greek",
          EN: "English",
          ES: "Spanish",
          ET: "Estonian",
          FI: "Finnish",
          FR: "French",
          HU: "Hungarian",
          IT: "Italian",
          JA: "Japanese",
          LT: "Lithuanian",
          LV: "Latvian",
          NL: "Dutch",
          PL: "Polish",
          PT: "Portuguese (all Portuguese varieties mixed)",
          RO: "Romanian",
          RU: "Russian",
          SK: "Slovak",
          SL: "Slovenian",
          SV: "Swedish",
          ZH: "Chinese",
        },
        scope: "world",
      }
    );

    /*game.settings.register(
      ComprehendLanguagesStatic.ID,
      ComprehendLanguagesStatic.SETTINGS.PROXYTYPE,
      {
        name: "Proxy",
        config: true,
        hint: "Which proxy to use",
        type: String,
        default: "CorsProxy",
        choices: {
          CorsProxy: "CorsProxy.io",
          DeepLApiProxySTB: "STBs DeepL API Proxy",
          OwnProxy: "Manual entered Proxy"
        },        
        scope: "world",
      }
    );*/

    /*game.settings.register(
      ComprehendLanguagesStatic.ID,
      ComprehendLanguagesStatic.SETTINGS.OWNPROXY,
      {
        name: "Proxy Address",
        config: true,
        hint: "Proxy Address for manual enter Proxy mode",
        type: String,
        default: "",
        scope: "world"
      }
    );*/    

    game.settings.register(
      ComprehendLanguagesStatic.ID,
      ComprehendLanguagesStatic.SETTINGS.FORMALITY,
      {
        name: "comprehend-languages.formality",
        config: true,
        hint: "comprehend-languages.formality_hint",
        type: String,
        default: "prefer_more",
        choices: {
          prefer_more: "Prefer more formal",
          prefer_less: "Prefer less formal",
        },
        scope: "world",
      }
    );
    game.settings.register(
      ComprehendLanguagesStatic.ID,
      ComprehendLanguagesStatic.SETTINGS.ICON_ONLY,
      {
        name: "comprehend-languages.iconOnly",
        config: true,
        hint: "comprehend-languages.iconOnly_hint",
        type: Boolean,
        default: false,
        scope: "world",
      }
    );
    game.settings.register(
      ComprehendLanguagesStatic.ID,
      ComprehendLanguagesStatic.SETTINGS.IN_PLACE,
      {
        name: "comprehend-languages.in-place",
        config: true,
        hint: "comprehend-languages.in-place_hint",
        type: Boolean,
        default: false,
        scope: "world",
      }
    );
    game.settings.register(
      ComprehendLanguagesStatic.ID,
      ComprehendLanguagesStatic.SETTINGS.SEPARATE_FOLDER,
      {
        name: "comprehend-languages.separate-folder",
        config: true,
        hint: "comprehend-languages.separate-folder_hint",
        type: Boolean,
        default: false,
        scope: "world",
      }
    );

    game.settings.register(
      ComprehendLanguagesStatic.ID,
      ComprehendLanguagesStatic.SETTINGS.TRANSLATE_FOLDER_NAME,
      {
        name: "comprehend-languages.translate-folder-name",
        config: true,
        hint: "comprehend-languages.translate-folder-name_hint",
        type: Boolean,
        default: false,
        scope: "world",
      }
    );

    game.settings.register(
      ComprehendLanguagesStatic.ID,
      ComprehendLanguagesStatic.SETTINGS.TRANSLATE_JOURNAL_NAME,
      {
        name: "comprehend-languages.translate-journal-name",
        config: true,
        hint: "comprehend-languages.translate-journal-name_hint",
        type: Boolean,
        default: false,
        scope: "world",
      }
    );

    game.keybindings.register(
      ComprehendLanguagesStatic.ID,
      "translate-highlighted-text",
      {
        name: "Translate highlighted text",
        hint: "Translate the currently selected piece of text and pop it out into a Dialog",
        editable: [{ key: "KeyT", modifiers: ["Alt"] }],
        onDown: () => {
          SelectionTranslator.translateSelectedText();
          return true;
        },
      }
    );
    // We replace the games window registry with a proxy object so we can intercept
    // every new application window creation event.
    const handler = {
      ownKeys: (target) => {
        return Reflect.ownKeys(target).filter((app: any) => {
          const appId = parseInt(app);
          if (!isNaN(appId)) {
            // TODO DO SOMETHING ??
            return false;
          }
          return true;
        });
      },
      set: (
        obj: Record<number, Application>,
        prop: number,
        value: FormApplication
      ) => {
        const result = Reflect.set(obj, prop, value);
        // console.log("Intercept ui-window create", value);
        if (value && value.object) {
          if (
            value.object instanceof JournalEntry ||
            value.object instanceof Item
          ) {
            addTranslateButton(value).catch((err) => console.error(err));
          }
        }
        return result;
      },
    };
    //@ts-ignore
    ui.windows = new Proxy(ui.windows, handler); // eslint-disable-line no-undef
    //@ts-ignore
    console.log("Installed window interceptor", ui.windows); // eslint-disable-line no-undef
  }
}
