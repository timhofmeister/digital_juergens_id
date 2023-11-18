

const routes = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { path: 'user/', name: 'user', component: () => import('pages/IndexPage.vue'), meta: {requiresAuth: true}},
            { path: 'verify/', name: 'verify', component: () => import('pages/VerifyPage.vue'), meta: {requiresAuth: true}},
        ]
    },
    { path: '/sign-in/', name: 'sign-in', component: () => import('pages/SignInPage.vue')},

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
