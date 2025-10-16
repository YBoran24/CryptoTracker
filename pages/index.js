// This is a placeholder file to help Vercel detect the Next.js project
// The actual pages are in the frontend/pages directory
export default function Home() {
  return <div>Redirecting...</div>;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
}