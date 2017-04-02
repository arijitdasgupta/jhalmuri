export interface IActionSpec {
    SINGLE_POST: any;
    PAGE: any;
    HOME_PAGE: any;
    BARE_LINKS_HOME_PAGE: any;
    REST: any;
}

export const Routes:IActionSpec = {
    HOME_PAGE: '/',
    BARE_LINKS_HOME_PAGE: '/bare',
    SINGLE_POST: '/:postName',
    PAGE: '/page/:n',
    REST: '*'
};

export const createRoutes = (actionsMap:IActionSpec) => {
    return Object.keys(Routes).map((key) => {
       return {
           path: Routes[key],
           action: (context) => {
               return (...args:any[]) => {
                   args.push(context);
                   actionsMap[key].apply({}, args);
               }
           }
       };
    });
};
