import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import pnp from '@pnp/pnpjs';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './BTaskAppApplicationCustomizer.module.scss';

import * as strings from 'BTaskAppApplicationCustomizerStrings';

const LOG_SOURCE: string = 'BTaskAppApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IBTaskAppApplicationCustomizerProperties {
  // This is an example; replace with your own property
  tasksListTitle: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class BTaskAppApplicationCustomizer
  extends BaseApplicationCustomizer<IBTaskAppApplicationCustomizerProperties> {

    private _dueTasks: any;
    private _viewUrl: string;
    private _topPlaceholder: PlaceholderContent;

  @override
  public onInit(): Promise<void> {
   //Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
   return new Promise<void>((resolve) => {
    if (!this.properties.tasksListTitle) {
      resolve();
      return;
    }

    let batch: any = pnp.sp.createBatch();
    let today: Date = new Date();
    today.setHours(0, 0, 0, 0);

    pnp.setup({
      spfxContext: this.context
    });

    pnp.sp.web.get().then((web: any) => { console.log(web); });

    pnp.sp.web.lists.getByTitle(this.properties.tasksListTitle).views.getByTitle('Tareas retrasadas').inBatch(batch).get().then((view: any) => {
      this._viewUrl = `${view.ServerRelativeUrl}?FilterField1=AssignedTo&FilterValue1=${escape(this.context.pageContext.user.displayName)}`;
    });

    pnp.sp.web.lists.getByTitle(this.properties.tasksListTitle)
      .items.expand('AssignedTo/Id').select('Title, AssignedTo, AssignedTo/Id, DueDate')
      .filter(`AssignedTo/Id eq ${this.context.pageContext.legacyPageContext.userId} and DueDate lt datetime'${today.toISOString()}' and Status ne 'Completed'`)
      .get().then((items: any) => {
        this._dueTasks = items;
      });

    batch.execute().then(() => {
      this._renderPlaceholder();
      resolve();
    });
  });
  }

  @override
  public _renderPlaceholder(): void {

    if (!this._dueTasks || !this._dueTasks.length)
      return;

    // Handling the top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        {
          onDispose: this._onDispose
        });
    }

    if (this._topPlaceholder && this._topPlaceholder.domElement) {
      this._topPlaceholder.domElement.innerHTML = `
                <div class="${styles.app}">
                  <div class="ms-bgColor-themeDark ms-fontColor-white ${styles.header}">
                    <i class="ms-Icon ms-Icon--Info" aria-hidden="true"></i> ${escape(strings.Message)}&nbsp;
                    <a href="${this._viewUrl}" target="_blank">${escape(strings.GoToList)}</a>
                  </div>
                </div>`;
    }
  }

  private _onDispose() {

  }

//?loadSPFX=true&debugManifestsFile=https://localhost:4321/temp/manifests.js&customActions={"fa597c79-4998-42f5-b973-df97e7e5af71":{"location":"ClientSideExtension.ApplicationCustomizer","properties":{"tasksListTitle":"Tasks"}}}

}
