# Use column formatting to customize SharePoint

You can use column formatting to customize how fields in SharePoint lists and libraries are displayed. To do this, you construct a JSON object that describes the elements that are displayed when a field is included in a list view, and the styles to be applied to those elements. The column formatting does not change the data in the list item or file; it only changes how it’s displayed to users who browse the list. Anyone who can create and manage views in a list can use column formatting to configure how view fields are displayed.

## Get started with column formatting

1. Open the column formatting pane, open the drop-down menu under a column. Under Column Settings, choose Format this column.

2. To format a column, enter the column formatting JSON in the box.

3. To preview the formatting, select Preview. To commit your changes, select Save.

## Display field values

The simplest column formatting is one that places the value of the field inside a <div /> element. This example works for number, text, choice, and date fields:

``` json
    {
      "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
      "elmType": "div",
      "txtContent": "@currentField"
    }
```

## Apply conditional formatting

This example uses an Excel-style conditional expression (=if) to apply a class to the parent <div /> element when the based on a value in the current field.

``` json
      {
        "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
        "elmType": "div",
        "attributes": {
          "class": "=if(@currentField == 'Excellent', 'sp-field-severity--good', if(@currentField == 'Good', 'sp-field-severity--warning', if(@currentField == 'Bad', 'sp-field-severity--blocked', 'sp-field-severity--blocked'))) + ' ms-fontColor-neutralSecondary'"
        },
        "children": [
          {
            "elmType": "span",
            "style": {
              "display": "inline-block",
              "padding": "0 4px"
            },
            "attributes": {
              "iconName": "=if(@currentField == 'Excellent', 'CheckMark', if(@currentField == 'Good', 'Forward', if(@currentField == 'Bad', 'Warning', 'ErrorBadge')))"
            }
          },
          {
            "elmType": "span",
            "txtContent": "@currentField"
          }
        ]
      }
```

## Add an action button to a field

You can use column formatting to render quick action links next to fields. The following example, intended for a person field, renders two elements inside the parent <div /> element:

A <span /> element that contains the person’s display name.
An <a /> element that opens a mailto: link that creates an email with a subject and body populated dynamically via item metadata.

```json
    {
      "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
      "elmType": "div",
      "style": {
        "display": "flex",
        "justify-content": "space-between"
      },
      "children": [
        {
          "elmType": "span",
          "style": {
            "padding-right": "8px"
          },
          "txtContent": "@currentField.title"
        },
        {
          "elmType": "a",
          "attributes": {
            "iconName": "Mail",
            "class": "sp-field-quickActions",
            "href": {
              "operator": "+",
              "operands": [
                "mailto:",
                "@currentField.email",
                "?subject=Task status&body=Hey, how is your task coming along?.\r\n---\r\n",
                "@currentField.title"
              ]
            }
          }
        }
      ]
    }
```
## Format a number column as a data bar

This example applies sp-field-dataBars class to create a data bar visualization of @currentField, which is a number field. The bars are sized differently for different values based on the way the width attribute is set.

```json
  {
    "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
    "elmType": "div",
    "children": [
      {
        "elmType": "span",
        "txtContent": "@currentField",
        "style": {
          "padding-left": "8px",
          "white-space": "nowrap"
        }
      }
    ],
    "attributes": {
      "class": "sp-field-dataBars"
    },
    "style": {
      "padding": "0",
      "width": "=if(@currentField == 100, '100%', (@currentField) + '%')"
    }
  }
```

More information about column formatting you can find [here](https://docs.microsoft.com/en-us/sharepoint/dev/declarative-customization/column-formatting)

[Here](https://github.com/SharePoint/sp-dev-list-formatting/tree/master/column-samples) you can find more samples
