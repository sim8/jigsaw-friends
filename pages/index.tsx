import Head from 'next/head';
import {
  Container,
  Main,
  Title,
  Description,
} from '../components/sharedstyles';
import JigsawCanvas from '../components/JigsawCanvas';
import Link from 'next/link';

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

        <JigsawCanvas />
      </Main>
    </Container>
  );
}
