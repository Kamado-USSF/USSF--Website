import React from 'react';
import { ShieldCheck, Check, FileCheck, Layers, Gauge, Cpu } from 'lucide-react';

export const MilSpecSpecs: React.FC = () => {
  const specs = [
    {
      code: 'MIL-STD-810H',
      title: 'ENVIRONMENTAL ENGINEERING TESTS',
      method: 'Methods 500.6 through 516.8',
      result: 'PASSED',
      parameter: 'Shock, 2m drop onto concrete, sand/dust, salt fog, ballistic vibration.'
    },
    {
      code: 'ANSI/PLATO FL-1',
      title: 'STANDARDIZED LIGHTING METRICS',
      method: 'Integrating Sphere / Photogoniometer',
      result: 'CERTIFIED',
      parameter: 'Regulated luminous flux (1,200 lm max), 420m beam distance, 46h run time.'
    },
    {
      code: 'IEC 60529 (IPX8)',
      title: 'SUBMERSIBLE INGRESS PROTECTION',
      method: 'Hydrostatic Pressure Chamber',
      result: 'IPX8 (20M)',
      parameter: 'Continuous submersion in water under 20 meters (66 feet) pressure for 4 hours.'
    },
    {
      code: 'NATO STANAG 4609',
      title: 'ELECTRO-OPTICAL SPECTRAL COMPLIANCE',
      method: 'Spectroradiometer 850nm / 625nm',
      result: 'APPROVED',
      parameter: 'Compatible with Gen-2 / Gen-3 Night Vision Goggles; zero bloom signature.'
    }
  ];

  return (
    <section id="mil-specs" className="relative w-full py-16 bg-neutral-950 border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-data uppercase tracking-widest text-amber-400 mb-2">
            <FileCheck className="h-3.5 w-3.5" />
            <span>LABORATORY VERIFICATION</span>
            <span aria-hidden="true" className="text-neutral-600">/</span>
            <span className="text-neutral-400">DEFENSE STANDARDS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-tactical uppercase tracking-tight text-neutral-100">
            MIL-SPEC CERTIFICATION MATRIX
          </h2>

          <p className="mt-2 text-sm text-neutral-400">
            Engineered, machined, and quality-tested in accordance with military and aerospace survivability standards.
          </p>
        </div>

        {/* Technical Data Table with Tabular Numerals */}
        <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-data">
              <thead className="border-b border-neutral-800 bg-neutral-900 text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-bold">STANDARD SPEC</th>
                  <th scope="col" className="px-5 py-3.5 font-bold">TEST DESIGNATION</th>
                  <th scope="col" className="px-5 py-3.5 font-bold">METHODOLOGY</th>
                  <th scope="col" className="px-5 py-3.5 font-bold">VERIFICATION STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                {specs.map((item) => (
                  <tr key={item.code} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="px-5 py-4 font-bold text-amber-400 whitespace-nowrap">
                      {item.code}
                    </td>
                    <td className="px-5 py-4 font-tactical text-neutral-100 font-bold tracking-wide">
                      <div>{item.title}</div>
                      <div className="text-[11px] font-sans text-neutral-400 font-normal mt-0.5 max-w-md">
                        {item.parameter}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-neutral-400 whitespace-nowrap">
                      {item.method}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                        <Check className="h-3.5 w-3.5" />
                        {item.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Metrics Footer */}
          <div className="border-t border-neutral-800 bg-neutral-950 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl font-bold font-data text-amber-400 tabular-nums">7075-T6</div>
              <div className="text-[11px] text-neutral-500 uppercase">Aerospace Alloy</div>
            </div>
            <div>
              <div className="text-xl font-bold font-data text-emerald-400 tabular-nums">100%</div>
              <div className="text-[11px] text-neutral-500 uppercase">QC Pressure Tested</div>
            </div>
            <div>
              <div className="text-xl font-bold font-data text-sky-400 tabular-nums">850nm</div>
              <div className="text-[11px] text-neutral-500 uppercase">IR Optic Cohesion</div>
            </div>
            <div>
              <div className="text-xl font-bold font-data text-neutral-200 tabular-nums">&gt;150,000 hrs</div>
              <div className="text-[11px] text-neutral-500 uppercase">LED Emitter MTBF</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
