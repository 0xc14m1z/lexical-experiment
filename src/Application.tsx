import { Editor } from "./Editor/Editor";

export function Application() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Editor />

      <section className="mt-8">
        <h2 className="text-normal font-bold">Reference image:</h2>
        <img src="https://uploads-ssl.webflow.com/5eec7a9c4479b07a3f62c64c/5f4cf46e8b5cc23d3a0d2a37_HomeHero_ModernCommunication.png" />
      </section>
    </main>
  );
}
