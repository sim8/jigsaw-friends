import Head from 'next/head';
import { Container, Main, Title } from '../../components/sharedstyles';
import dynamic from 'next/dynamic';
import Navigation from '../../components/Navigation';

const NoSSRGameContainer = dynamic(
  () => import('../../components/GameContainer'),
  {
    ssr: false,
  },
);

export default function Play() {
  return (
    <Container>
      <Head>
        <title>Jigsaw Friends</title>
        <meta name="description" content="Jigsaw friends" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <Title>Jigsaw friends</Title>
        <Navigation />

        <NoSSRGameContainer />
      </Main>
    </Container>
  );
}
