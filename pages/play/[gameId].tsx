import Head from 'next/head';
import {
  Container,
  Main,
  Title,
  Description,
} from '../../components/sharedstyles';
import Link from 'next/link';
import dynamic from 'next/dynamic';

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

        <Description>
          <Link href="https://github.com/sim8/jigsaw-friends">GitHub</Link>
        </Description>

        <NoSSRGameContainer />
      </Main>
    </Container>
  );
}
