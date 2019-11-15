# Working with Site Designs in PowerShell

In this lab we will see how we can work with Site Scripts and Site Designs from PowerShell.

## Deploying Site Scripts and Site Designs

1. The first thing we're going to do is connect to the SharePoint administration site, to do so execute the following command replacing \<tenant> by the name of your tenant

``` PoweShell
$adminSiteUrl = "https://<tenant>-admin.sharepoint.com"
$cred = Get-Credential
Connect-SPOService $adminSiteUrl -Credential $cred
```

2. Now let's read the content of our json file that contains the script to put the content to a variable, for it executes where $siteScriptFile is the path of the employees.json file that we have created previously.

``` PoweShell
$siteScriptContent = Get-Content $siteScriptFile -Raw
```

3. With the content of our script we are going to deploy it to SPO with the following command, where $siteScriptTitle is the title that we are going to put to our script

``` PoweShell
$siteScript = Add-SPOSiteScript -Title $siteScriptTitle -Content $siteScriptContent
```

4. Now we have to add our script to our design, but first we are going to create some variables that we will pass as parameter when adding the script to the design. We will execute the following

``` PoweShell
$webTemplate = "68" #CommunicationSite
$siteDesignTitle = "M365 Site Design"
$siteDesignDescription = "M365 Site Design Description"
```

4. Now we have to add our script to our design, for it we run
``` PoweShell
Add-SPOSiteDesign -SiteScripts $siteScript.Id -Title $siteDesignTitle -WebTemplate $webTemplate -Description $siteDesignDescription 
```

## View information about Site Scripts and Site Desings Deployed
1. At this point we're going to check that our design has actually been deployed. Let's run the following command to see all the scripts we have deployed in SPO

``` PoweShell
Get-SPOSiteScript
```

2. To see all the designs we have displayed we execute

``` PoweShell
Get-SPOSiteDesign
```

3. We can always filter this information, for example, if we want to return only the designs with a particular title we run

``` PoweShell
$siteDesign = Get-SPOSiteDesign | Where-Object {$_.Title -eq $siteDesignTitle} 
```

4. We can do the same with the scripts

``` PoweShell
$siteScript = Get-SPOSiteScript | Where-Object {$_.Title -eq $siteScriptTitle} | Select -First 1
```

## Applying Site Designs from PowerShell

1. We can apply site designs from the user interface when creating a site or apply it once created. But sometimes we need to apply it programmatically, we can do this with PowerShell executing the following command

``` PoweShell
$siteUrl = "https://<tenant>.sharepoint.com/sites/<siteUrl>"
$siteDesignId = "<siteDesignId>"

Invoke-SPOSiteDesign -Identity $siteDesignId -WebUrl $siteUrl
``` 

All from powershell example

## Limiting who can use Site Designs

1. Site designs are public and visible all over the world by default, but sometimes we want to limit who can see and use our site designs. These permissions can be given to both groups and users, for example

``` PoweShell
$adminSiteUrl = "https://<tenant>-admin.sharepoint.com"
$siteDesignId = "<siteDesignId>"
$principals = "Security Group Name", "user@<tenant>.onmicrosoft.com"

$cred = Get-Credential
Connect-SPOService $adminSiteUrl -Credential $cred

Grant-SPOSiteDesignRights -Identity $siteDesignId -Principals $principals -Rights View

```

2. We can also see the permissions for a site design by running

``` PoweShell
Get-SPOSiteDesignRights -Identity $siteDesignId
```

## Removing Site Scripts and Site Designs 
1. To remove a site script we will need its id, once we have obtained it we execute the following command

``` PoweShell
Remove-SPOSiteScript -Identity $siteScriptId
```

2. The same happens with the site designs, to eliminate it we will execute the following command

``` PoweShell
Remove-SPOSiteDesign -Identity $siteDesignId
```