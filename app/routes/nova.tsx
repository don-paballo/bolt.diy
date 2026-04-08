import type { MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { UGCVideo } from '~/components/nova/UGCVideo.client';

export const meta: MetaFunction = () => {
  return [
    { title: 'Nova Voss — UGC Character' },
    { name: 'description', content: 'Nova Voss: photorealistic 3D CGI digital creator. UGC video showcase.' },
  ];
};

export default function NovaPage() {
  return (
    <ClientOnly
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-stone-950 text-stone-400 text-sm">
          Loading...
        </div>
      }
    >
      {() => <UGCVideo />}
    </ClientOnly>
  );
}
