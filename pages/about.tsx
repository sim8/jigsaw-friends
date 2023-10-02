import Link from 'next/link';
import {
  Container,
  Main,
  Title,
  Description,
} from '../components/sharedstyles';
import Navigation from '../components/Navigation';

export default function About() {
  return (
    <Container>
      <Main>
        <Navigation />
        <Title>Jigsaw friends</Title>
        <Description>
          Jigsaw friends is a game made by{' '}
          <Link href="https://simeonlees.com">Simeon Lees</Link>.
          <br />
          It&apos;s built using Firebase and React.
          <Link href="/">
            <br />
            <br />
            &larr; Back
          </Link>
        </Description>
      </Main>
    </Container>
  );
}
