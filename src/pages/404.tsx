import { Container, Title, Group, Button } from "@mantine/core";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    
      <Container className="mt-8">
      <br/>
        <Title className="text-center">404</Title>
        <br/>
        <Title className="text-center">You have found a secret place.</Title>
        <p className="text-center">
          Unfortunately, this is only a 404 page. You may have mistyped the
          address, or the page has been moved to another URL.
        </p>
        <br/>

        <Group justify="center">
          <Button component={Link} to="/" variant="subtle" size="md">
            Take me back to home page
          </Button>
        </Group>
      </Container>
  );
}
