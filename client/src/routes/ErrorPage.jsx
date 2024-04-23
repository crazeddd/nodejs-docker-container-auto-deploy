import { useRouteError } from "react-router-dom";

//NOT FULLY MY CODE, EDITED FROM REACT ROUTER DOCS
export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="center widget column error-page">
      <h1 class="gradient-text">Uh Oh</h1>
      <br />
      <h5>Sorry, an unexpected error has occurred:</h5>
      <br />
      <p className="muted">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
