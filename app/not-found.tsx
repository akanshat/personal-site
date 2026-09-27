import { ButtonLink, Container, Eyebrow } from '@/components/ui';
import { ArrowLeft } from '@/components/icons';

export default function NotFound() {
  return (
    <Container className="grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <Eyebrow>404 · result: unknown</Eyebrow>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          This page has no <span className="font-extrabold text-accent">reading</span>.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          The exporter might be offline, or the link might be wrong. Either way, there&apos;s nothing here.
        </p>
        <ButtonLink href="/" variant="primary" className="mt-8">
          <ArrowLeft className="size-4" />
          Back home
        </ButtonLink>
      </div>
    </Container>
  );
}
