## Extensión spfx-appcustomizer


Pre-requisitos : 

    Dentro de vuestro Tenant en un Site Collection de SharePoint crear una Lista de tipo tareas.


A continuación detallamos los pasos para crear la extensión.


a) Para crear la extensión ejecutamos el siguiente comando : 

    yo @microsoft/sharepoint

        
    Let's create a new SharePoint solution.
    ? What is your solution name? spfx-appcustomizer
    ? Which baseline packages do you want to target for your component(s)? SharePoint Online only (latest)
    ? Where do you want to place the files? Create a subfolder with solution name
    Found npm version 6.11.3
    ? Do you want to allow the tenant admin the choice of being able to deploy the solution to all sites immediately without running any feature deployment or adding apps in sites? No
    ? Will the components in the solution require permissions to access web APIs that are unique and not shared with other components in the tenant? No
    ? Which type of client-side component to create? Extension
    ? Which type of client-side extension to create? Application Customizer
    Add new Application Customizer to solution spfx-appcustomizer.
    ? What is your Application Customizer name? spfx-appcustomizer
    ? What is your Application Customizer description? spfx-appcustomizer description


![spfx-appcustomizer-001](../assets/spfx-appcustomizer-001.png)


Para probar la extensión debemos completar la url del navegador lo siguiente : 


Application Customizer
?loadSPFX=true&debugManifestsFile=https://localhost:4321/temp/manifests.js&customActions={"fa597c79-4998-42f5-b973-df97e7e5af71":{"location":"ClientSideExtension.ApplicationCustomizer","properties":{"tasksListTitle":"Tasks"}}}


Los Valores son : 

customAction : 
        Dentro del fichero de la extensión "BTaskAppApplication.Customizer.manifest.json.
        {
        "$schema": "https://developer.microsoft.com/json-schemas/spfx/client-side-extension-manifest.schema.json",

        "id": "fa597c79-4998-42f5-b973-df97e7e5af71",
        "alias": "BTaskAppApplicationCustomizer",
        "componentType": "Extension",
        "extensionType": "ApplicationCustomizer",

        // The "*" signifies that the version should be taken from the package.json
        "version": "*",
        "manifestVersion": 2,

        // If true, the component can only be installed on sites where Custom Script is allowed.
        // Components that allow authors to embed arbitrary script code should set this to true.
        // https://support.office.com/en-us/article/Turn-scripting-capabilities-on-or-off-1f2c515f-5d7e-448a-9fd7-835da935584f
        "requiresCustomScript": false
        }

tasksListTitle : Nombre de la lista creada en el Pre-Requisito.