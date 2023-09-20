import Head from 'next/head';
import {
  Container,
  Main,
  Title,
  Description,
} from '../components/sharedstyles';
import Link from 'next/link';
import { useCallback } from 'react';
import { getFirebase } from '../firebase/clientApp';

export default function Home() {
  const actuallyPlay = useCallback(() => {
    console.log('working? ', !!getFirebase().app);
  }, []);
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

        <Link href="/play/123" style={{ fontSize: '64px' }}>
          Play
        </Link>
        <button style={{ fontSize: '64px' }} onClick={() => actuallyPlay()}>
          Actually play
        </button>
      </Main>
    </Container>
  );
}
