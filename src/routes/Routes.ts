interface IActionSpec {
    SINGLE_POST: any;
    PAGE: any;
    HOME_PAGE: any;
    REST: any;
}

export const Routes:IActionSpec = {
    SINGLE_POST: '/:postName',
    PAGE: '/page/:n',
    HOME_PAGE: '/',
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
