# spfx avanzado - Invocando una Azure Function securizada por Azure AD desde spfx

En este lab, vamos a ver como podemos crear una __Azure Function__, y securizarla con __Azure Active Directory__ (AAD) fácilmente, usando el asistente del propio portal de Azure, para luego consumir dicha función desde un webpart de _spfx_. Además, también veremos como hacer un "segundo salto", y desde la Función de Azure, consumir la __MS Graph API__ con el contexto del usuario logado en SharePoint. Para esto último, haremos uso del "On Behalf Of" flow de oAuth2, y nos ayudará la librería _MSAL_ (Microsoft Authentication Library).

Para facilitar la consecución del lab, partiremos de un proyecto base, donde ya tenemos preparadas algunas cosas básicas de "scaffolding", y otros puntos que no aportan mucho a la temática del lab.

Para este lab son necesarios los siguiente pre-requisitos:
- Cliente de Git instalado
- Disponer de una tenant de Office 365. Puedes conseguir una tenant de desarrollo desde el siguiente enlace: [https://developer.microsoft.com/en-us/office/dev-program#Subscription](https://developer.microsoft.com/en-us/office/dev-program#Subscription)
- Disponer de una Subscripción de Azure. Puedes conseguir una subscripción de 30 días gratis en el siguiente enlace: [https://azure.microsoft.com/en-us/free/](https://azure.microsoft.com/en-us/free/)
- Idealmente, la subscripción de Azure debe estar vinculada a la tenant de Office 365. Si partes de cero, primero obtén tu Tenant de desarrollo de Office 365, y luego puedes seguir los pasos de este enlace para obtener la subscripción de Azure vinculada a la tenant de Office 365: [https://docs.microsoft.com/en-us/azure/billing/billing-use-existing-office-365-account-azure-subscription](https://docs.microsoft.com/en-us/azure/billing/billing-use-existing-office-365-account-azure-subscription)
- Si ya tienes una tenant y una subscripción por separado, puedes seguir los pasos de este video para vincularlas: [https://channel9.msdn.com/Series/Microsoft-Azure-Tutorials/Associate-an-Office-365-tenant-with-an-Azure-subscription](https://channel9.msdn.com/Series/Microsoft-Azure-Tutorials/Associate-an-Office-365-tenant-with-an-Azure-subscription)
- Si todavía no has desarrollado con Spfx, o acabas de crear tu Tenant de Office 365, asegúrate de que has seguido todos los pasos de este artículo: [https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment)

Estos son los puntos principales del lab:
- Clonar el proyecto base
- Publicar la Azure Function en la subscripción Azure
- Añadir varias App Settings a la Function
- Securizar la Function con AAD usando el asistente del propio portal
- Habilitar CORS en nuestra Function
- Configurar un _service principal_ en SharePoint
- Completar algunos métodos del webpart spfx
- Actualizar el código de la Function para consumir MS Graph API
- Test de todo usando el Workbench de SharePoint Online

Si todo ha ido bien, en el _workbench_ de SPO podremos añadir un par de webparts, el primero, llamado _MarvelHeroes_, cargará un listado de varios super héroes (los datos vienen de la Azure Function, y están securizados usando AAD):

![Marvel Heroes WebPart](./assets/marvel-heroes-webpart.png)

El segundo webpart disponible, llamado _FunctionFlowsToGraphTester_, mostrará información del usuario logado, obtenida de la MS Graph API (a través del ME endpoint: https://graph.microsoft.com/v1.0/me):

![Function calling Graph WebPart](./assets/function-graph-webpart.png)

## Clonar proyecto base

Tenéis todos los laboratorios del evento en el siguiente repositorio de GitHub

```ps
git clone https://github.com/CompartiMOSS/Microsoft-365-Developer-Bootcamp-Barcelona.git
```

Este lab lo podéis encontrar en la ruta:

__...SPFX/SPfx-Advanced/funcionsecurizada/__

![GitHub folder](./assets/github-folder.png)

En dicho folder hay 2 carpetas principales:
- Azure Function: Esta Function se comporta como una API, y expone un método que nos va a devolver un listado de super-héroes, y otro método que llamará a MS Graph API para obtener información del usuario logado.
- spfx webparts project: este proyecto contiene dos webparts que harán uso de la Function
