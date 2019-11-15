import * as React from 'react';
//import styles from './TeamContextViewer.module.scss';
import { ITeamContextViewerProps } from './ITeamContextViewerProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { DetailsList, DetailsListLayoutMode, SelectionMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';

export interface IDetailsListCompactItem {
  key: number;
  name: string;
  value: string;
}

export default class TeamContextViewer extends React.Component<ITeamContextViewerProps, {}> {

  private _columns: IColumn[];

  constructor(props: ITeamContextViewerProps) {
    super(props);

    this._columns = [
      { key: 'fieldNameColumn', name: 'Context Field', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'fieldValueColumn', name: 'Value', fieldName: 'value', minWidth: 100, maxWidth: 200, isResizable: true }
    ];
  }

  public render(): React.ReactElement<ITeamContextViewerProps> {
    return (
      <DetailsList
        compact={true}
        items={this.props.fields}
        columns={this._columns}
        setKey="set"
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />
    );
  }
}
