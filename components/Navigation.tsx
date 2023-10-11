import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';

const NavWrapper = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;

  align-items: center;
  padding: 10px;

  font-size: 1.2rem;
`;

const NavSection = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export default function Navigation() {
  return (
    <NavWrapper>
      <NavSection>{/* TODO anything? */}</NavSection>
      <NavSection>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="https://github.com/sim8/jigsaw-friends">
          <Image
            src="/images/github-mark.svg"
            alt="GitHub"
            width={20}
            height={20}
          />
        </Link>
      </NavSection>
    </NavWrapper>
  );
}
