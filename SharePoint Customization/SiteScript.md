# Creating a site script

The first thing we will do is to create a folder where to include the files that contain the site scripts.

For this lab we need SharePoint Online Management Shell and PnP PowerShell modules

``` PowerShell
Install-Module -Name Microsoft.Online.SharePoint.PowerShell
Install-Module SharePointPnPPowerShellOnline
```

## Creating lists, content types, and site columns

1. In the folder we have created we add a new file called employees.json
2. Open the file with any text editor and add
``` json
    {
        "$schema": "schema.json",
        "actions": [

        ],
        "bindata": {},
        "version": 1
    }
``` 
With this we already have the basis of our site script, what we will do now is add actions to our script

3. We are going to add a new column of site to store the post, for it inside actions we add the following action with the verb createSiteColumn

``` json
    {
      "verb": "createSiteColumn",
      "fieldType": "Text",
      "internalName": "Position",
      "displayName": "Position",
      "isRequired": true
    }
```

4. Now we will add another site column to include the biography of the employee, after the previous action we add

``` json
    ,
    {
      "verb": "createSiteColumn",
      "fieldType": "Note",
      "internalName": "Bio",
      "displayName": "Bio",
      "isRequired": false
    }
```

Note that each action we add is an element within an array, and these elements must be separated by a comma ",".

5. Now we are going to create the type of Employee content that will contain the two columns of site that we have created, for it we have to create an action using the verb createContentType that is what will create the type of content and within it we will create 2 subactions to add to the type of content the columns of site that we have created previously, as follows

``` json
    {
      "verb": "createContentType",
      "name": "Employee",
      "id": "0x0100B609FEFDEFAA484299C6DE254182E666",
      "description": "Employees list content type",
      "parentId": "0x01",
      "hidden": false,
      "subactions": [
        {
          "verb": "addSiteColumn",
          "internalName": "Position"
        },
        {
          "verb": "addSiteColumn",
          "internalName": "Bio"
        }
      ]
    }
```

6. Let's Create our Employees list.

``` json
  {
    "verb": "createSPList",
    "listName": "Employees",
    "templateType": 100,
    "subactions": [
      {
        "verb": "addContentType",
        "name": "Employee"
      }
    ]
  }
```

## Create a theme and display it in SPO

1. Let's create a custom theme and upload it to SPO. Create a file and call it deployTheme.ps1.
2. We open the file with any text editor or with Powershell's ISE and create a variable that will contain the theme's color palette.
3. To generate custom theme you can use [Theme Designer](https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/index.html)

``` json
    $themepalette = @{
    "themePrimary" = "#da3b01";
    "themeLighterAlt" = "#fdf6f3";
    "themeLighter" = "#f9dcd1";
    "themeLight" = "#f4beaa";
    "themeTertiary" = "#e8825d";
    "themeSecondary" = "#dd4f1b";
    "themeDarkAlt" = "#c33400";
    "themeDark" = "#a52c00";
    "themeDarker" = "#792000";
    "neutralLighterAlt" = "#f8f8f8";
    "neutralLighter" = "#f4f4f4";
    "neutralLight" = "#eaeaea";
    "neutralQuaternaryAlt" = "#dadada";
    "neutralQuaternary" = "#d0d0d0";
    "neutralTertiaryAlt" = "#c8c8c8";
    "neutralTertiary" = "#bab8b7";
    "neutralSecondary" = "#a3a2a0";
    "neutralPrimaryAlt" = "#8d8b8a";
    "neutralPrimary" = "#323130";
    "neutralDark" = "#605e5d";
    "black" = "#494847";
    "white" = "#ffffff";
    }
``` 
4. Connect to the SharePoint administration site. Replace \<tenant\> with the name of your tenant

``` PoweShell
$adminSiteUrl = "https://<tenant>-admin.sharepoint.com"
$cred = Get-Credential
Connect-SPOService $adminSiteUrl -Credential $cred
```

4. And add the theme in SPO

``` PoweShell
Add-SPOTheme -Identity "M365Theme" -Palette $themepalette -IsInverted $false
```

5. Run the file ps1

6. Execute the Get-SPOTheme command to return all displayed themes and check that the one we just created is found.

## Customize the site

1. We are going to modify our script so that it applies the theme that we have unfolded in the previous step, for it we are going to add a new action with the following content

``` json
    {
      "verb": "applyTheme",
      "themeName": "M365Theme"
    }
```

2. On our site we want the navigation menu to contain a new link, so we're going to add it by including the following action in our script

``` json
    {
       "verb": "addNavLink",
       "url": "https://developer.microsoft.com/en-us/office/blogs/2019-global-microsoft-365-developer-bootcamps/",
       "displayName": "Microsoft 365 Developer Bootcamp"
    }
```

3. We can also remove options from the navigation menu, for example, we will remove the link to Pages by adding the following action
``` json
    {
        "verb": "removeNavLink",
        "displayName": "Pages",
        "isWebRelative": true
    }
``` 
## Manage external users

1. On our site we will not allow sharing with external users, so we will disable it from our script

2. To do this we will add a new action in our script with the following content

``` json
    {
      "verb": "setSiteExternalSharingCapability",
      "capability": "Disabled"
    }

```

## Link the site to a hub

1. The last step we're going to take is to link the site to which we apply the design to a hub. The first thing we're going to do is create a site and register it as a hub.

2. This step could be done through the user interface, but let's do it with PowerShell. Opens a PowerShell window

3. Run the following command to connect to SharePoint administration

``` PoweShell
$adminSiteUrl = "https://<tenant>-admin.sharepoint.com"
$cred = Get-Credential
Connect-SPOService $adminSiteUrl -Credential $cred
```

4. Execute the following command to create a new communication site, modifying \<tenant> by the name of your tenant and \<owner> by the user owner of the site

``` PoweShell
New-SPOSite -Url https://<tenant>.sharepoint.com/sites/SPSEvents -Title "SPS Events" -Owner <owner> -StorageQuota 1000 -Template "SITEPAGEPUBLISHING#0"
```

5. Execute the following command to register the site as a hub site, replacing \<hubSiteUrl> with the url of the site we created in the previous step and \<owner> by the owner user of the hub
``` PoweShell
Register-SPOHubSite -Site <hubSiteUrl> -Principals <owner>
```

6. When executing the previous command, information of the hub we have created is shown on the screen. Copy the ID that shows that we will need to include it in our script.

7. We open the file that contains our script and add a new action to include the site in the hub we have created, the content of this action will be as follows. You have to replace \<hubSiteID> with the ID we copied in the previous step

``` json
    {
      "verb": "joinHubSite",
      "hubSiteId": "<hubSiteID>"
    }

``` 

8. We save the file with our script. In the following lab we will see how to deploy this script and work with scripts and site designs with PowerShell