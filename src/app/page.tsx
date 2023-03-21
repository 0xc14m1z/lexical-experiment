import { Editor } from "@/components/Editor";

export default function Home() {
  return (
    <main className="container mx-auto px-4 pt-8 pb-24">
      <Editor />

      <section className="mt-8">
        <h2 className="text-normal font-bold">Reference image:</h2>
        <img
          alt="reference"
          src="https://uploads-ssl.webflow.com/5eec7a9c4479b07a3f62c64c/5f4cf46e8b5cc23d3a0d2a37_HomeHero_ModernCommunication.png"
        />
      </section>

      <section className="mt-8">
        <h2 className="text-normal font-bold">Reference Youtube link text:</h2>
        <p>
          This paragraph should show the preview of this
          https://www.youtube.com/watch?v=_7wwj9I_Qw8 video and this other one
          https://www.youtube.com/watch?v=GvyPYZv2EsU as well.
        </p>
      </section>
    </main>
  );
}
