// Direct /blog route pe redirect kar rhe h
export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/blog',
      permanent: false,
    },
  };
}

export default function Home() {
  return null;
}
