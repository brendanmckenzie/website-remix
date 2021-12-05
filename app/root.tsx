import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useMatches,
} from "remix";
import type { LinksFunction } from "remix";

import globalStylesUrl from "~/styles/app.css";
import mobileStyles from "~/styles/mobile.css";

export const links: LinksFunction = () => {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com" },
    {
      rel: "stylesheet",
      href: "https://unpkg.com/modern-css-reset@1.4.0/dist/reset.min.css",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter&display=block",
    },
    { rel: "stylesheet", href: globalStylesUrl },
    {
      rel: "stylesheet",
      href: mobileStyles,
      media: "only screen and (max-width: 600px)",
    },
  ];
};

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </Layout>
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const matches = useMatches();

  const includeScripts = matches.some((match) => match.handle?.hydrate);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        {includeScripts && <Scripts />}
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const excludeLayout = matches.some((match) => match.handle?.layout === false);

  if (excludeLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <header>
        <Link to="/" title="Brendan McKenzie">
          <h1>Brendan McKenzie</h1>
        </Link>
        <p>
          Software and technology enthusiast, focussed on pushing the envelope
          with emerging technologies.
        </p>
      </header>

      {children}

      <footer>
        <ul>
          <li>
            &copy; <Link to="/">Brendan McKenzie</Link>
          </li>
          <li>
            Powered by{" "}
            <a
              href="https://www.pokko.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pokko
            </a>
          </li>
        </ul>
      </footer>
    </>
  );
}
