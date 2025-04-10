import './bootstrap';
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import MainLayout from './Dashboard/Components/Layout/MainLayout';

createInertiaApp({
    // progress: false,
    resolve: name => {
        const pages = import.meta.glob('./Dashboard/**/*.jsx', { eager: true })
        const page = pages[`./Dashboard/${name}.jsx`]
        page.default.layout = page.default.layout || ((page) => <MainLayout children={page} />)
        return page
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
})