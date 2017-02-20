export interface ISiteOptionsTableItem {
  option_name: string;
  option_value: string;
}

export interface ISqlSiteOptions {
    site_url: string;
    home: string;
    admin_email: string;
    blogname: string;
}

export interface ISiteOptions {
    siteUrl: string;
    homeUrl: string;
    blogName: string;
    adminEmail: string;
    totalPostCount: number;
}