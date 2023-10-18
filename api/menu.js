// 获取路由
import { filterRouters } from "@/utils/filterRouters";
export function getMaintainRouters() {
  var menu = [
    {
      name: "System",
      path: "/system",
      hidden: false,
      redirect: "noRedirect",
      component: "Layout",
      alwaysShow: true,
      meta: {
        title: "系统管理",
        icon: "system",
        noCache: false,
        link: null,
      },
      children: [
        {
          name: "restartApp",
          path: "restartApp",
          hidden: false,
          component: "monitor/server/restartApp",
          meta: {
            title: "重启应用",
            icon: "build",
            noCache: false,
            link: null,
          },
        },
        {
          name: "restartSystem",
          path: "restartSystem",
          hidden: false,
          component: "monitor/server/restartSystem",
          meta: {
            title: "重启系统",
            icon: "component",
            noCache: false,
            link: null,
          },
        },
        {
          name: "resetSystem",
          path: "resetSystem",
          hidden: false,
          component: "monitor/server/resetSystem",
          meta: {
            title: "恢复出厂设置",
            icon: "code",
            noCache: false,
            link: null,
          },
        },
        {
          name: "backup",
          path: "backup",
          hidden: false,
          component: "maintain/backup",
          meta: {
            title: "配置备份",
            icon: "form",
            noCache: false,
            link: null,
          },
        },
        {
          name: "upgrade",
          path: "upgrade",
          hidden: false,
          component: "maintain/upgrade",
          meta: {
            title: "软件升级",
            icon: "post",
            noCache: false,
            link: null,
          },
        },
        {
          name: "testTool",
          path: "testTool",
          hidden: false,
          component: "maintain/testTool",
          meta: {
            title: "测试工具",
            icon: "skill",
            noCache: false,
            link: null,
          },
        },
        {
          name: "screenCapture",
          path: "screenCapture",
          hidden: false,
          component: "maintain/screenCapture",
          meta: {
            title: "截屏",
            icon: "eye-open",
            noCache: false,
            link: null,
          },
        },
        {
          name: "Log",
          path: "log",
          hidden: false,
          redirect: "noRedirect",
          component: "ParentView",
          alwaysShow: true,
          meta: {
            title: "日志管理",
            icon: "log",
            noCache: false,
            link: null,
          },
          children: [
            {
              name: "Operlog",
              path: "operlog",
              hidden: false,
              component: "monitor/operlog/index",
              meta: {
                title: "操作日志",
                icon: "form",
                noCache: false,
                link: null,
              },
            },
            {
              name: "logManager",
              path: "logManager",
              hidden: false,
              component: "maintain/index",
              meta: {
                title: "日志配置",
                icon: "form",
                noCache: false,
                link: null,
              },
            },
          ],
        },
      ],
    },
    {
      name: "Monitor",
      path: "/monitor",
      hidden: false,
      redirect: "noRedirect",
      component: "Layout",
      alwaysShow: true,
      meta: {
        title: "系统监控",
        icon: "monitor",
        noCache: false,
        link: null,
      },
      children: [
        {
          name: "Server",
          path: "server",
          hidden: false,
          component: "monitor/server/index",
          meta: {
            title: "服务监控",
            icon: "server",
            noCache: false,
            link: null,
          },
        },
      ],
    },
  ];
  return filterRouters(menu, loadView);
}

function loadView(view) {
  if (process.env.NODE_ENV === "development") {
    return (resolve) => require([`@maintainModule/views/${view}`], resolve);
  } else {
    // 使用 import 实现生产环境的路由懒加载
    return () => import(`@maintainModule/views/${view}`);
  }
}
