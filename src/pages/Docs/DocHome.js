import { useEffect } from "react";

export default function DocHome() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.open(process.env.REACT_APP_DOCS_URL);
      window.location.replace("./");
    }, 10);

    return () => clearTimeout(timeout);
  }, []);

  return <></>;
}
