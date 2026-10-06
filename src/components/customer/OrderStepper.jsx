import React from "react";

import { Check } from "lucide-react";

const steps = [
  { number: "01", label: "Edit Order" },
  { number: "02", label: "Delivery Details" },
  { number: "03", label: "Summary" },
  { number: "04", label: "Complete" },
];

function OrderStepper({ currentStep = 1 }) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full">
      {/* Full-width stepper container */}
      <div className="w-full border-b border-[#DDECEF] bg-[#F8FCFD] px-4 py-5 shadow-[0_4px_20px_rgba(8,119,157,0.06)] sm:px-6 sm:py-6">
        <div className="relative mx-auto w-full">
          {/* Connecting track */}
          <div className="absolute left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] top-5 z-0 sm:left-[calc(12.5%+22px)] sm:right-[calc(12.5%+22px)] sm:top-[22px]">
            <div className="relative h-[3px] w-full">
              {/* Base track */}
              <div className="absolute inset-0 rounded-full bg-[#E2E8EA]" />

              {/* Progress track */}
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-primary-background transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-4">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;

              return (
                <div
                  key={step.number}
                  className="flex min-w-0 flex-col items-center"
                >
                  {/* Step node */}
                  <div
                    className={`
                      relative z-20 flex h-10 w-10 items-center justify-center
                      rounded-full border-2 text-[10px] font-bold
                      transition-all duration-300
                      sm:h-11 sm:w-11 sm:text-xs
                      ${
                        isActive
                          ? "scale-105 border-primary-background bg-primary-background text-white shadow-[0_0_0_5px_rgba(8,119,157,0.10),0_4px_12px_rgba(8,119,157,0.22)]"
                          : isCompleted
                            ? "border-primary-background bg-primary-background text-white shadow-[0_2px_8px_rgba(8,119,157,0.16)]"
                            : "border-[#D5DEE1] bg-white text-[#9AA7AB]"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check size={17} strokeWidth={3} />
                    ) : (
                      step.number
                    )}
                  </div>

                  {/* Step label */}
                  <span
                    className={`
                      mt-2.5 max-w-[90px] text-center text-[9px]
                      uppercase leading-4 tracking-[0.3px]
                      transition-colors duration-300
                      sm:max-w-none sm:text-[10px] sm:tracking-[0.5px]
                      ${
                        isActive
                          ? "font-extrabold text-text-accent"
                          : isCompleted
                            ? "font-bold text-text-primary"
                            : "font-semibold text-[#9AA7AB]"
                      }
                    `}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderStepper;