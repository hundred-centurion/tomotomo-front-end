import '@tanstack/react-router';
import { router } from '@/main.tsx';

declare module '@tanstack/react-router' {
  type Register = {
    router: typeof router;
  };
}
