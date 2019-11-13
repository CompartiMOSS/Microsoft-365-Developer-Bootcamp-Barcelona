import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'TeamContextViewerWebPartStrings';
import TeamContextViewer from './components/TeamContextViewer';
import { ITeamContextViewerProps } from './components/ITeamContextViewerProps';

//Import from SDK
import * as microsoftTeams from '@microsoft/teams-js';

import {IDetailsListCompactItem} from './components/TeamContextViewer'

export interface ITeamContextViewerWebPartProps {
  description: string;
}

export default class TeamContextViewerWebPart extends BaseClientSideWebPart<ITeamContextViewerWebPartProps> {

  //Private variable to store Teams context
  private _teamsContext: microsoftTeams.Context;

  private getFieldsFromContext(): IDetailsListCompactItem[] {
    let result: IDetailsListCompactItem[] = [];
    let keys: string[] = Object.keys(this._teamsContext);
    for (let i: number = 0; i < keys.length; i++) {
      result.push({ key: i, name: keys[i], value: this._teamsContext[keys[i]] });
    }
    return result.sort((a, b) => (a.name > b.name) ? 1 : -1);
  }

  protected onInit(): Promise<any> {
    let retVal: Promise<any> = Promise.resolve();
    if (this.context.microsoftTeams) {
      retVal = new Promise((resolve, reject) => {
        this.context.microsoftTeams.getContext(context => {
          this._teamsContext = context;
          resolve();
        });
      });
    }
    return retVal;
  }

  public render(): void {
    const element: React.ReactElement<ITeamContextViewerProps > = React.createElement(
      TeamContextViewer,
      {
        fields: this.getFieldsFromContext()
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
