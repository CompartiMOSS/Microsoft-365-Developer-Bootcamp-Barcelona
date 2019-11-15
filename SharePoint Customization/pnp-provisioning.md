# PnP Provisioning

1. Get PnP Provisioning Schema

``` PoweShell
Connect-PnPOnline -Url <SiteUrl>
Get-PnPProvisioningTemplate -Out template.xml -Force
```
2. Apply PnP Provisioning Schema

``` PoweShell
Connect-PnPOnline -Url <SiteUrl>
Apply-PnPProvisioningTemplate -Path template.xml -ClearNavigation
```

More information about [PnP provisioning](https://docs.microsoft.com/en-us/sharepoint/dev/solution-guidance/introducing-the-pnp-provisioning-engine)

More information about [Pnp Provisioning Schema](https://github.com/SharePoint/PnP-Provisioning-Schema/blob/master/ProvisioningSchema-2019-09.md) 