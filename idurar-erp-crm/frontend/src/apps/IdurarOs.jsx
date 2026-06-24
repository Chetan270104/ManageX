import { lazy, Suspense, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';
import { logout } from '@/redux/auth/actions';
import { AppContextProvider } from '@/context/appContext';
import PageLoader from '@/components/PageLoader';
import AuthRouter from '@/router/AuthRouter';
import Localization from '@/locale/Localization';

const ErpApp = lazy(() => import('./ErpApp'));

const DefaultApp = () => (
  <Localization>
    <AppContextProvider>
      <Suspense fallback={<PageLoader />}>
        <ErpApp />
      </Suspense>
    </AppContextProvider>
  </Localization>
);

export default function IdurarOs() {
  const { isLoggedIn } = useSelector(selectAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleAuthExpire = () => dispatch(logout());
    window.addEventListener('auth-expire', handleAuthExpire);
    return () => window.removeEventListener('auth-expire', handleAuthExpire);
  }, [dispatch]);

  if (!isLoggedIn)
    return (
      <Localization>
        <AuthRouter />
      </Localization>
    );
  else return <DefaultApp />;
}
