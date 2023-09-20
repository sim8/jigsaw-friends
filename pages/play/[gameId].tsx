import Head from 'next/head';
import {
  Container,
  Main,
  Title,
  Description,
} from '../../components/sharedstyles';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const NoSSRJigsawCanvas = dynamic(
  () => import('../../components/JigsawCanvas'),
  {
    ssr: false,
  },
);

export default function Home() {
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

        <NoSSRJigsawCanvas />
      </Main>
    </Container>
  );
}
