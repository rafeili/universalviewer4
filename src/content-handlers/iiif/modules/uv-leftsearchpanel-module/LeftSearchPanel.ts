import { BaseConfig } from "../../BaseConfig";
import { IIIFEvents } from "../../IIIFEvents";
import { Events } from "../../../../Events";
import { BaseExpandPanel } from "../uv-shared-module/BaseExpandPanel";
import { Bools } from "@edsilv/utils";

export class LeftSearchPanel<
  T extends BaseConfig["modules"]["leftPanel"]
> extends BaseExpandPanel<T> {
  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    super.create();

    this.$element.width(this.options.panelCollapsedWidth);

    this.extensionHost.subscribe(IIIFEvents.TOGGLE_EXPAND_LEFT_PANEL, () => {
      if (this.isFullyExpanded) {
        this.collapseFull();
      } else {
        this.expandFull();
      }
    });

    this.extensionHost.on(Events.LOAD, async () => {
      this.$main.html('');
      this.setTitle("Search");
      this.$main.append("<p>TEST LeftSearchPanel Content</p>");
    });
  }

  init(): void {
    super.init();

    const shouldOpenPanel: boolean = Bools.getBool(
      this.extension.getSettings().leftPanelOpen,
      this.options.panelOpen
    );

    if (shouldOpenPanel) {
      this.toggle(true);
    }
  }

  getTargetWidth(): number {
    if (this.isFullyExpanded || !this.isExpanded) {
      return this.options.panelExpandedWidth;
    } else {
      return this.options.panelCollapsedWidth;
    }
  }

  getFullTargetWidth(): number {
    return this.$element.parent().width();
  }

  toggleFinish(): void {
    super.toggleFinish();

    if (this.isExpanded) {
      this.extensionHost.publish(IIIFEvents.OPEN_LEFT_PANEL);
    } else {
      this.extensionHost.publish(IIIFEvents.CLOSE_LEFT_PANEL);
    }
    this.extension.updateSettings({ leftPanelOpen: this.isExpanded });
  }

  resize(): void {
    super.resize();

    if (this.isFullyExpanded) {
      this.$element.width(this.$element.parent().width());
    }
  }
}