export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: "/algorithm",
    name: "algorithm",
    icon: "crown",
    routes: [
      {
        path: "/algorithm/sort",
        name: "sort",
        icon: "smile",
        routes: [
          {
            path: "/algorithm/sort/bubble",
            name: "bubble",
            icon: "smile",
            component: "./algorithm/sort/bubble",
          },
          {
            path: "/algorithm/sort/select",
            name: "select",
            icon: "smile",
            component: "./algorithm/sort/select",
          },
          {
            path: "/algorithm/sort/insert",
            name: "insert",
            icon: "smile",
            component: "./algorithm/sort/insert",
          },
          {
            path: "/algorithm/sort/quick",
            name: "quick",
            icon: "smile",
            component: "./algorithm/sort/quick",
          },
          // {
          //   path: "/algorithm/sort/merge",
          //   name: "merge",
          //   icon: "smile",
          //   component: "./algorithm/sort/merge",
          // },
          // {
          //   path: "/algorithm/sort/heap",
          //   name: "heap",
          //   icon: "smile",
          //   component: "./algorithm/sort/heap",
          // },
        ],
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
