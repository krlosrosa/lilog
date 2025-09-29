type NavItem = {
  label: string;
  icon: any;
  href?: string;
  permission?: string;
  feature?: string;
  children?: NavItem[];
};