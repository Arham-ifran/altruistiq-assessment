import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div id="error-page" className="d-flex justify-content-center align-items-center">
      <div className="error-page-content d-flex flex-column align-items-center">
        <h1>Oops!</h1>
        <p>The page you`re looking for does not exist!</p>
        {(error.statusText || error.message)&&
          <div className="error-box">
            <i>{error.statusText || error.message}</i>
          </div>
        }
      </div>
    </div>
  );
}