async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function HomePage() {
  await delay(1000); // 5 seconds delay

  return (
    <div>
       Home Page Content
    </div>
  );
}