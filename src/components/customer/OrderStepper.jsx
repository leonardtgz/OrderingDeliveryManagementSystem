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
    <div className="w-full border-b border-border-light bg-background-card px-3 py-5 sm:px-6 sm:py-6">
      <div className="mx-auto w-full max-w-[900px]">
        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-[12.5%] right-[12.5%] top-5 h-0.5 bg-border-light">
            <div
              className="h-full bg-primary-background transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="relative grid grid-cols-4">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;

              return (
                <div
                  key={step.number}
                  className="flex min-w-0 flex-col items-center"
                >
                  <div
                    className={`
                      relative z-10 flex h-10 w-10 items-center justify-center
                      rounded-full border-2 text-[10px] font-bold
                      transition-all duration-300 sm:h-11 sm:w-11 sm:text-xs
                      ${
                        isActive
                          ? "scale-105 border-primary-background bg-primary-background text-white shadow-md"
                          : isCompleted
                            ? "border-primary-background bg-primary-light text-white"
                            : "border-border-light bg-background-card text-text-secondary"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check size={17} strokeWidth={3} />
                    ) : (
                      step.number
                    )}
                  </div>

                  <span
                    className={`
                      mt-2 max-w-[90px] text-center text-[9px] font-bold
                      uppercase leading-4 tracking-[0.3px]
                      sm:max-w-none sm:text-[10px] sm:tracking-[0.5px]
                      ${
                        isActive
                          ? "text-text-accent"
                          : isCompleted
                            ? "text-text-primary"
                            : "text-text-secondary"
                      }
                    `}
                  >
                    {step.label}
                  </span>

                  {isActive && (
                    <span className="mt-1 h-1 w-5 rounded-full bg-primary-background" />
                  )}
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