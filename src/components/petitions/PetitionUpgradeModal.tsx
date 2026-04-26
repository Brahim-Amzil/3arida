'use client';

import { useState } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import { PricingTier } from '@/types/petition';
import { filterAvailableTiers, TierOption } from '@/lib/petition-upgrade-utils';
import { Button } from '@/components/ui/button';

interface PetitionUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  petitionId: string;
  currentTier: PricingTier;
  onTierSelect: (selectedTier: PricingTier, upgradePrice: number) => void;
}

export function PetitionUpgradeModal({
  isOpen,
  onClose,
  petitionId,
  currentTier,
  onTierSelect,
}: PetitionUpgradeModalProps) {
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const availableTiers = filterAvailableTiers(currentTier);

  const handleTierSelect = (tier: TierOption) => {
    setSelectedTier(tier.tier);
  };

  const handleConfirm = () => {
    if (!selectedTier) return;
    const tier = availableTiers.find((t) => t.tier === selectedTier);
    if (!tier) return;
    setIsProcessing(true);
    onTierSelect(selectedTier, tier.upgradePrice);
  };

  if (!isOpen) return null;

  const getTierName = (tier: PricingTier) => {
    const names: Record<PricingTier, string> = {
      free: 'الخطة المجانية',
      basic: 'الخطة الأساسية',
      premium: 'الخطة الاحترافية',
      advanced: 'الخطة المتقدمة',
      enterprise: 'الخطة المؤسسية',
    };
    return names[tier];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-right flex-1">ترقية باقة العريضة</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-right">
              الباقة الحالية: <span className="font-semibold text-gray-900">{getTierName(currentTier)}</span>
            </p>
          </div>
          {availableTiers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">أنت بالفعل في أعلى باقة متاحة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableTiers.map((tier) => (
                <div
                  key={tier.tier}
                  onClick={() => handleTierSelect(tier)}
                  className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all ${selectedTier === tier.tier ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300 bg-white'}`}
                >
                  {selectedTier === tier.tier && (
                    <div className="absolute top-4 left-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-right mb-2">{tier.name}</h3>
                  <p className="text-sm text-gray-600 text-right mb-4">
                    حتى {tier.signatureLimit.toLocaleString('ar-MA')} توقيع
                  </p>
                  <div className="mb-4 text-right">
                    <div className="text-3xl font-bold text-green-600">{tier.upgradePrice} درهم</div>
                    <p className="text-xs text-gray-500 mt-1">
                      {currentTier === 'free' ? 'السعر الكامل' : 'الفرق من باقتك الحالية'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 text-right">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {availableTiers.length > 0 && (
            <div className="mt-6 flex gap-3 justify-end">
              <Button onClick={onClose} variant="outline" disabled={isProcessing}>
                إلغاء
              </Button>
              <Button onClick={handleConfirm} disabled={!selectedTier || isProcessing} className="gap-2">
                {isProcessing ? 'جاري المعالجة...' : (
                  <>
                    متابعة إلى الدفع
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
