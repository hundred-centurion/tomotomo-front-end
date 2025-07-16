import { createFileRoute } from '@tanstack/react-router';
import IndexLayout from '@/components/layouts/index-layout.tsx';
import TitledContainer from '@/components/titled-container.tsx';
import DateRange from '@/components/date-range.tsx';

const IndexPage = () => {
  return (
    <IndexLayout>
      <TitledContainer title="Home" titleSize="h2" actions={[<DateRange />]}></TitledContainer>
    </IndexLayout>
  );
};

export const Route = createFileRoute('/')({
  component: IndexPage,
});
