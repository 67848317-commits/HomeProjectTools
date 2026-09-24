import React from 'react';
import type { BillOfMaterialsItem } from '../../types/index.ts';

interface BillOfMaterialsTableProps {
  items: BillOfMaterialsItem[];
}

export const BillOfMaterialsTable: React.FC<BillOfMaterialsTableProps> = ({ items }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-[#e3ded4] pb-2">
        <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1c1917]">
          Bill of Materials (Purchase Takeoff)
        </h3>
        <span className="text-[11px] font-mono text-[#78716c]">
          Commercial Units Only
        </span>
      </div>

      <div className="overflow-x-auto rounded border border-[#e3ded4] bg-[#ffffff]">
        <table className="min-w-full divide-y divide-[#e3ded4] text-left text-xs">
          <thead className="bg-[#f1ede4] font-mono uppercase text-[#57534e]">
            <tr>
              <th scope="col" className="py-2.5 pl-4 pr-3 text-left font-semibold">
                Material Item
              </th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold">
                Net Needed
              </th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold text-[#b8532b]">
                Purchase Order
              </th>
              <th scope="col" className="px-3 py-2.5 text-left font-semibold">
                Packaging Spec
              </th>
              <th scope="col" className="py-2.5 pl-3 pr-4 text-right font-semibold">
                Est. Material Cost
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1ede4] text-[#1c1917]">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-[#faf8f5] transition-colors">
                <td className="py-3 pl-4 pr-3">
                  <div className="font-semibold text-sm text-[#1c1917]">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-[#78716c]">
                    {item.description}
                  </div>
                </td>
                <td className="px-3 py-3 text-right font-mono tabular-nums text-[#57534e]">
                  {item.exactQuantity}{' '}
                  <span className="text-[11px] text-[#78716c]">{item.packageUnit}</span>
                </td>
                <td className="px-3 py-3 text-right font-mono font-bold text-sm text-[#b8532b] tabular-nums">
                  {item.purchaseQuantity}{' '}
                  <span className="text-xs font-medium text-[#1c1917]">{item.packageUnit}</span>
                </td>
                <td className="px-3 py-3 font-mono text-[11px] text-[#57534e]">
                  {item.unitSizeDescription}
                </td>
                <td className="py-3 pl-3 pr-4 text-right font-mono font-semibold tabular-nums text-[#1c1917]">
                  {item.estimatedCost ? (
                    <span>
                      ${item.estimatedCost.typical.toLocaleString()}{' '}
                      <span className="text-[10px] text-[#78716c] font-normal block">
                        (${item.estimatedCost.low.toLocaleString()} – ${item.estimatedCost.high.toLocaleString()})
                      </span>
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-[#78716c] font-mono">
        * Purchase orders round strictly upward to whole commercial packages. Partial or opened boxes cannot be purchased at retail.
      </p>
    </div>
  );
};
