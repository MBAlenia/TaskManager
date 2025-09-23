import React, { useState, useEffect, memo } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = memo(({ isOpen, onClose }) => {
  const { translate } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to TaskQuest",
      content: "TaskQuest is a gamified task management application where you can create, assign, and complete tasks to earn points and level up!"
    },
    {
      title: "Creating Tasks",
      content: "Click the 'Create New Task' button to add tasks. Fill in the title, description, points, and level required. Higher level tasks can only be assigned to users with matching levels."
    },
    {
      title: "Task Status",
      content: "Tasks have different statuses: Open (available for assignment), Assigned (taken by a user), Closed (completed), Pending Validation (waiting for admin approval), and more."
    },
    {
      title: "Earning Points & Levels",
      content: "Complete tasks to earn points. As you accumulate points, you'll level up, unlocking access to higher-level tasks and more features."
    },
    {
      title: "Admin Features",
      content: "Admin users can manage categories, users, and validate completed tasks. Access these features through the Admin Dashboard."
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{steps[currentStep].title}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>{steps[currentStep].content}</p>
            <div className="progress mt-3">
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                aria-valuenow={(currentStep + 1) / steps.length * 100}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
            <div className="text-center mt-2">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleSkip}>
              Skip
            </button>
            {currentStep > 0 && (
              <button type="button" className="btn btn-secondary" onClick={handlePrev}>
                Previous
              </button>
            )}
            <button type="button" className="btn btn-primary" onClick={handleNext}>
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default HelpModal;