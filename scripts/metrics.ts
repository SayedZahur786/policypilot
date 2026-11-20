import { neon } from '@neondatabase/serverless';
if(!process.env.DATABASE_URL)throw new Error('Set production DATABASE_URL');
const sql=neon(process.env.DATABASE_URL);
const [r]=await sql`SELECT count(*)::int AS generated, count(*) FILTER(WHERE paid)::int AS paid FROM sites WHERE created >= now()-interval '7 days'`;
console.log(JSON.stringify({window:'last 7 days',generated:r.generated,paid:r.paid,conversionPercent:r.generated?Math.round(10000*r.paid/r.generated)/100:0,targets:{generated:50,paid:10,conversionPercent:20}},null,2));
