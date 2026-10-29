import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '@/components/Seo';

type Section = { heading: string; body: string };

type Props = {
  title: string;
  path: string;
  updated: string;
  intro: string;
  sections: Section[];
};

export default function LegalPage({ title, path, updated, intro, sections }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <Seo title={`${title} | سي الحرفي`} description={intro} path={path} />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition mb-6 text-sm font-medium"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع للرئيسية</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-sm text-gray-400 mb-6">آخر تحديث: {updated}</p>
          <p className="text-gray-600 leading-relaxed mb-8">{intro}</p>

          <div className="space-y-8">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{s.heading}</h2>
                <p className="text-gray-600 leading-relaxed">{s.body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
