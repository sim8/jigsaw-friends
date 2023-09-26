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
import { ref, child, push } from 'firebase/database';

export default function Home() {
  const actuallyPlay = useCallback(() => {
    const db = getFirebase().database;

    const userData = {
      name: 'Sim',
    };

    // Get a key for a new user.
    const newUserKey = push(child(ref(db), 'users'), userData).key;
    console.log(
      '🚀 ~ file: index.tsx:23 ~ actuallyPlay ~ newUserKey:',
      newUserKey,
    );
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
