import { useEffect } from 'react';

export default function DocHome() {
  useEffect(() => {
    const timeout = setTimeout(() => {
     
      window.location.replace('https://comakeit-tic.github.io/');
    }, 10);

    return () => clearTimeout(timeout);
  }, []);

  return <>Redirecting..</>;

}
