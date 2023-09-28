import Head from 'next/head';
import {
  Container,
  Main,
  Title,
  Description,
} from '../components/sharedstyles';
import Link from 'next/link';
import { signInAndCreateGame } from '../lib/actions';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

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

        <button onClick={() => {}} style={{ fontSize: '64px' }}>
          Play solo
        </button>
        <button
          onClick={() => {
            signInAndCreateGame().then((gameKey) => {
              if (gameKey) {
                router.push(`/play/${gameKey}`);
              }
            });
          }}
          style={{ fontSize: '64px' }}
        >
          Play with friends
        </button>
      </Main>
    </Container>
  );
}
