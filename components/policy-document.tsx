import { policy } from "@/lib/policies";
import { titles, type Intake, type Kind } from "@/lib/schema";
export function PolicyDocument({
  answers,
  kind,
  date,
}: {
  answers: Intake;
  kind: Kind;
  date: string;
}) {
  return (
    <article className="policy">
      <div className="eyebrow">{answers.name}</div>
      <h1>{titles[kind]}</h1>
      <p className="small">Effective date: {date}</p>
      {policy(answers, kind).map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          <p>{s.body}</p>
        </section>
      ))}
    </article>
  );
}
