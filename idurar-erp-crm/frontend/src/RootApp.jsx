import './style/app.css';

import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import PageLoader from '@/components/PageLoader';
import Localization from '@/locale/Localization';

const IdurarOs = lazy(() => import('./apps/IdurarOs'));
const CustomerPortalApp = lazy(() => import('./apps/CustomerPortalApp'));

export default function RootApp() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Customer Portal - completely separate */}
            <Route path="/customer-portal/*" element={<Localization><CustomerPortalApp /></Localization>} />
            {/* Admin Panel - everything else */}
            <Route path="/*" element={<IdurarOs />} />
          </Routes>
        </Suspense>
      </Provider>
    </BrowserRouter>
  );
}
