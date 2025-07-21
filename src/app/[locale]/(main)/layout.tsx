import RootTemplate from '@/templates/RootTemplate';

export default async function MainLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <RootTemplate>
      {props.children}
    </RootTemplate>
  );
}
