import Link from "next/link";
export const metadata = { title: "Privacy policy for a Next.js app" };
export default function Guide() {
  return (
    <article className="policy">
      <div className="eyebrow">The founder’s launch notes</div>
      <h1>A privacy policy for your Next.js app.</h1>
      <p>
        Your framework does not decide your privacy practices. Your
        authentication, database, hosting, analytics and payment providers do.
      </p>
      <h2>Start with the data flow</h2>
      <p>
        List what users submit, why you need it, who processes it and where it
        is stored. Include server logs and support messages, not just form
        fields.
      </p>
      <h2>Name the actual providers</h2>
      <p>
        If you use Vercel, Neon or Stripe, check their current contracts and
        processing regions. Do not assume your database and application run in
        the same region.
      </p>
      <h2>Make your words match your code</h2>
      <p>
        A promise to delete data in 30 days needs an implemented deletion
        process. A consent clause does not stop an analytics script. Review both
        before launch.
      </p>
      <h2>Generate, review, then publish</h2>
      <p>
        PolicyPilot turns ten grouped answers into three drafts with India, US
        and EU variants. It does not provide legal advice or guarantee that your
        app meets every requirement.
      </p>
      <Link className="btn" href="/create">
        Draft my app’s policies
      </Link>
    </article>
  );
}
