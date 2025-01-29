interface NavbarItems {
  items: NavbarItem[];
}

interface NavbarItem {
  label: string;
  href?: string;
  subitems?: NavbarItem[];
}

export const userAvatarItems: NavbarItems = {
  items: [
    // { label: "Profile", href: "/profile" },
    // { label: "Admin Portal", href: "/admin" },
    { label: "Agent Dashboard", href: "/agent/dashboard" },
    { label: "Logout", href: "/logout" },
  ],
};

export const adminNavbarItem: NavbarItem = {
  label: "Admin",
  subitems: [
    { label: "Users", href: "/admin/users" },
    { label: "Companies", href: "/admin/companies" },
    { label: "Rooms", href: "/admin/rooms" },
    { label: "Stalls", href: "/admin/stalls" },
    { label: "Queues", href: "/admin/queues" },
    { label: "Interviews", href: "/admin/interviews" },
  ],
};

export const publicNavbarItems: NavbarItems = {
  items: [
    { label: "Interview Panels", href: "/panels" },
    { label: "Venue Map", href: "/room-map" },
    { label: "Live Dashboard", href: "/live" },
    // {
    //   label: "Interviews",
    //   subitems: [
    //     { label: "Pre listed", href: "/interviews?pre-listed" },
    //     { label: "Walk in", href: "/interviews?walk-in" },
    //   ],
    // },
  ],
};
