import { useEffect, useState } from 'react';
import { useRouterState } from '@tanstack/react-router';
import ReactGA from 'react-ga4';

export default function Monitor() {
  const { location } = useRouterState();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    ReactGA.initialize('G-MQV8WR3MDE');
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      ReactGA.set({ page: location.pathname });
      ReactGA.send('pageview');
    }
  }, [initialized, location]);

  return <></>;
}
