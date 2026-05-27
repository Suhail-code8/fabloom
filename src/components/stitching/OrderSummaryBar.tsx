'use client';

import { useStitchingStore } from '@/store/useStitchingStore';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';

export default function OrderSummaryBar({ currentStep, onNext, onBack }: {
    currentStep: 1 | 2 | 3 | 4;
    onNext: () => void;
    onBack: () => void;
}) {
    const store = useStitchingStore();
    const addItem = useCartStore((s) => s.addItem);
    const router = useRouter();

    const fabricCost    = store.fabricCost();
    const stitchingFee  = store.stitchingPrice();
    const total         = store.totalPrice();
    const fabric        = store.selectedFabric;

    const canNext =
        currentStep === 1 ? store.canProceedStep1() :
        currentStep === 2 ? store.canProceedStep2() :
        currentStep === 3 ? store.canProceedStep3() :
        store.canProceedStep4();

    const handleAddToCart = () => {
        const order = store.buildOrderItem();
        if (!order) return;

        // Stitching bundle is its own cart item type (CartPageClient renders it separately).
        const cartItem: any = {
            itemType: 'stitching',
            fabricId: order.fabricId,
            fabricName: order.fabricName,
            fabricImage: order.fabricImage,
            meters: order.meters,
            pricePerMeter: order.pricePerMeter,
            garmentType: order.garmentType,
            stitchingCharge: order.stitchingPrice,
            measurementProfileId: order.measurementProfile._id,
            measurementProfileName: order.measurementProfile.profileName,
            measurementSnapshot: order.measurementProfile.measurements,
            totalPrice: order.totalPrice,
        };

        addItem(cartItem);
        store.reset();
        router.push('/cart');
    };

    return (
        <div
            className="fixed bottom-20 left-0 right-0 z-40 border-t"
            style={{
                backgroundColor: '#0f1035',
                borderColor: 'rgba(255,255,255,0.1)',
                paddingBottom: 'env(safe-area-inset-bottom, 12px)',
            }}
        >
            {/* Price breakdown */}
            {(fabricCost > 0 || stitchingFee > 0) && (
                <div className="px-5 pt-3 pb-1 flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-0.5 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        {fabric && (
                            <span>
                                Fabric: {store.meters}m × ₹{fabric.pricePerMeter} =&nbsp;
                                <strong className="text-white">₹{fabricCost.toLocaleString('en-IN')}</strong>
                            </span>
                        )}
                        {stitchingFee > 0 && (
                            <span>
                                Stitching:&nbsp;
                                <strong className="text-white">₹{stitchingFee.toLocaleString('en-IN')}</strong>
                            </span>
                        )}
                    </div>
                    {total > 0 && (
                        <div className="text-right flex-shrink-0">
                            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Total</p>
                            <p className="text-lg font-extrabold" style={{ color: '#D4A853' }}>
                                ₹{total.toLocaleString('en-IN')}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 px-4 py-3">
                {currentStep > 1 && (
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200 active:scale-90 flex-shrink-0"
                        style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)' }}
                        aria-label="Go back"
                    >
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                )}

                {currentStep < 4 ? (
                    <button
                        onClick={onNext}
                        disabled={!canNext}
                        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl text-sm font-bold transition-all duration-200 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ backgroundColor: canNext ? '#D4A853' : 'rgba(212,168,83,0.4)', color: '#0f1035' }}
                    >
                        {currentStep === 1
                            ? 'Select Meters'
                            : currentStep === 2
                            ? 'Choose Garment'
                            : 'Select Measurements'}
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                ) : (
                    <button
                        onClick={handleAddToCart}
                        disabled={!canNext}
                        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl text-sm font-bold transition-all duration-200 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ backgroundColor: canNext ? '#D4A853' : 'rgba(212,168,83,0.4)', color: '#0f1035' }}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
                        </svg>
                        Add to Cart — ₹{total.toLocaleString('en-IN')}
                    </button>
                )}
            </div>
        </div>
    );
}
