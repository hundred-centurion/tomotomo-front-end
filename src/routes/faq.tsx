import { createFileRoute } from '@tanstack/react-router';
import FAQPage from '@/pages/faq.tsx';

export const Route = createFileRoute('/faq')({
  component: RouteComponent,
});

function RouteComponent() {
  return <FAQPage />;
}
