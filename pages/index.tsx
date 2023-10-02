import Head from 'next/head';
import { Container, Main, Title } from '../components/sharedstyles';
import { signInAndCreateGame } from '../lib/actions';
import { useRouter } from 'next/router';
import { getGameLink } from '../utils/urls';
import Navigation from '../components/Navigation';
import Image from 'next/image';
import styled from 'styled-components';

const RotatingImage = styled(Image)`
  margin: 40px 0;

  animation: rotation 8s infinite linear;

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`;

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
        <Navigation />
        <Title>Jigsaw friends</Title>

        <RotatingImage
          src="/images/puzzle_icon.svg"
          alt="puzzle piece"
          width={100}
          height={100}
        />

        <button
          onClick={() => {}}
          style={{ fontSize: '64px', marginBottom: '15px' }}
        >
          Play solo
        </button>
        <button
          onClick={() => {
            signInAndCreateGame().then((gameKey) => {
              if (gameKey) {
                router.push(getGameLink(gameKey));
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
