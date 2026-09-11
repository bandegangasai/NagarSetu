import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Camera,
  MapPin,
  FileText,
  AlertTriangle,
  Copy,
  ExternalLink,
  Sparkles,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { COMPLAINT_CATEGORIES } from '../../data/categories';
import { INDIAN_CITIES } from '../../data/locations';
import { CategoryIcon } from '../common/CategoryIcon';
import { LocationPickerMap } from '../maps/LocationPickerMap';
import { DuplicateAlertModal } from '../complaints/DuplicateAlertModal';
import { VoiceComplaintInput } from './VoiceComplaintInput';
import { useComplaints } from '../../contexts/ComplaintContext';
import { detectNearbyDuplicates, NearbyComplaintMatch } from '../../services/duplicateDetector';
import { analyzeComplaintText, AiSuggestion } from '../../services/aiAssistantService';
import { Complaint } from '../../types';

export const MultiStepSubmitForm: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { complaints, submitComplaint, supportIssue } = useComplaints();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('c1000000-0000-0000-0000-000000000002');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80');
  const [city, setCity] = useState<string>('Hyderabad');
  const [wardNo, setWardNo] = useState<string>('Ward 92');
  const [latitude, setLatitude] = useState<number>(17.4156);
  const [longitude, setLongitude] = useState<number>(78.4350);
  const [locationAddress, setLocationAddress] = useState<string>('Road No. 10, Banjara Hills, Hyderabad');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  const [nearbyDuplicates, setNearbyDuplicates] = useState<NearbyComplaintMatch[]>([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState<boolean>(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<AiSuggestion | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedCategory = COMPLAINT_CATEGORIES.find((c) => c.id === selectedCategoryId);

  // Pre-fill sample images for testing
  const samplePhotos = [
    { label: 'Pothole', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80' },
    { label: 'Garbage Dump', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80' },
    { label: 'Broken Streetlight', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80' },
    { label: 'Open Manhole', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleUseGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(6));
          const lng = Number(pos.coords.longitude.toFixed(6));
          setLatitude(lat);
          setLongitude(lng);
          setLocationAddress(`GPS Coordinates (${lat}, ${lng}), ${city}`);
        },
        (err) => {
          console.warn('Geolocation failed, keeping selected coords', err);
          alert('Could not retrieve device GPS. Please select location on map.');
        }
      );
    }
  };

  const handleNextFromLocation = () => {
    // Check for nearby duplicates before proceeding to step 5
    const matches = detectNearbyDuplicates(complaints, latitude, longitude, selectedCategoryId, 300);
    if (matches.length > 0) {
      setNearbyDuplicates(matches);
      setShowDuplicateModal(true);
    } else {
      setCurrentStep(5);
    }
  };

  const handleSupportExisting = (existingId: string) => {
    supportIssue(existingId);
    setShowDuplicateModal(false);
    const existing = complaints.find((c) => c.id === existingId);
    if (existing) {
      alert(`Thank you! You added your support (+1) to existing issue #${existing.complaintId}. You will receive status updates as it progresses.`);
      navigate(`/track/${existing.complaintId}`);
    }
  };

  const handleCreateNewAnyway = () => {
    setShowDuplicateModal(false);
    setCurrentStep(5);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out the issue title and detailed description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = submitComplaint({
        title: title.trim(),
        description: description.trim(),
        categoryId: selectedCategoryId,
        locationAddress: locationAddress.trim() || `${city} - ${wardNo}`,
        landmark: landmark.trim() || undefined,
        wardNo,
        city,
        latitude,
        longitude,
        isAnonymous,
        initialPhotoUrl: photoUrl || undefined
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      setSubmittedComplaint(created);
      setCurrentStep(6);
    } catch (err) {
      console.error(err);
      alert('Submission failed. Please check form fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (submittedComplaint) {
      navigator.clipboard.writeText(submittedComplaint.complaintId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Step 6: Success Confirmation Screen
  if (currentStep === 6 && submittedComplaint) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-elevated border border-slate-200 text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('submit.successTitle')}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            {t('submit.successSub')}
          </p>
        </div>

        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 max-w-md mx-auto">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
            {t('submit.yourComplaintId')}
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-xl sm:text-2xl font-black text-civic-700 bg-white px-4 py-2 rounded-xl border border-civic-200 shadow-xs">
              {submittedComplaint.complaintId}
            </span>
            <button
              onClick={handleCopyId}
              className="p-2 text-slate-600 hover:text-civic-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-xs"
              title="Copy Complaint ID"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          {copied && (
            <p className="text-xs font-semibold text-emerald-600">✓ Copied to clipboard!</p>
          )}

          <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 space-y-1 text-left">
            <p><strong>Category:</strong> {submittedComplaint.categoryName}</p>
            <p><strong>Location:</strong> {submittedComplaint.locationAddress}</p>
            <p><strong>Resolution SLA:</strong> {selectedCategory?.slaDays} Days ({selectedCategory?.slaHours} Hours)</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(`/track/${submittedComplaint.complaintId}`)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-civic-600 hover:bg-civic-700 text-white font-bold text-sm rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-98"
          >
            <span>{t('submit.trackProgressBtn')}</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setCurrentStep(1);
              setTitle('');
              setDescription('');
              setSubmittedComplaint(null);
            }}
            className="px-5 py-3 text-slate-600 hover:text-slate-900 font-semibold text-sm rounded-xl hover:bg-slate-100 transition-colors"
          >
            Report Another Issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-elevated overflow-hidden">
      {/* Top Stepper Indicator */}
      <div className="bg-slate-900 text-white p-4 sm:p-6 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg sm:text-xl font-extrabold flex items-center gap-2">
            <FileText className="w-5 h-5 text-civic-400" />
            <span>{t('submit.pageTitle')}</span>
          </h2>
          <span className="text-xs font-semibold text-civic-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Step {currentStep} of 5
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-civic-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-medium">
          <span className={currentStep >= 1 ? 'text-civic-400 font-bold' : ''}>1. Category</span>
          <span className={currentStep >= 2 ? 'text-civic-400 font-bold' : ''}>2. Details</span>
          <span className={currentStep >= 3 ? 'text-civic-400 font-bold' : ''}>3. Photo</span>
          <span className={currentStep >= 4 ? 'text-civic-400 font-bold' : ''}>4. Location</span>
          <span className={currentStep >= 5 ? 'text-civic-400 font-bold' : ''}>5. Review</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 sm:p-8">
        {/* STEP 1: Category Selection */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t('submit.step1Title')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select the type of municipal problem you wish to report.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
              {COMPLAINT_CATEGORIES.map((cat) => {
                const isSelected = cat.id === selectedCategoryId;
                const localizedName =
                  i18n.language === 'te' ? cat.nameTe : i18n.language === 'hi' ? cat.nameHi : cat.name;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-civic-600 bg-civic-50/80 ring-2 ring-civic-500 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-civic-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <CategoryIcon name={cat.iconName} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 leading-tight">
                        {localizedName}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="font-semibold text-civic-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          SLA: {cat.slaDays} {cat.slaDays === 1 ? 'Day' : 'Days'}
                        </span>
                        <span className="capitalize">{cat.defaultPriority} Priority</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedCategory?.emergencyWarning && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{selectedCategory.emergencyWarning}</span>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-civic-600 hover:bg-civic-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
              >
                <span>Continue to Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Description & Title */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t('submit.step2Title')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current Category: <strong>{selectedCategory?.name}</strong>
              </p>
            </div>

            {/* Voice Complaint Submission Option */}
            <VoiceComplaintInput
              onTranscriptComplete={(spokenText) => {
                if (!title) {
                  const words = spokenText.split(' ');
                  setTitle(words.slice(0, 8).join(' ') + (words.length > 8 ? '...' : ''));
                }
                setDescription((prev) => (prev ? `${prev} ${spokenText}` : spokenText));
                const ai = analyzeComplaintText(spokenText);
                setAiSuggestion(ai);
              }}
            />

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {t('submit.titleLabel')} <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (e.target.value.length > 5) {
                      const ai = analyzeComplaintText(`${e.target.value} ${description}`);
                      setAiSuggestion(ai);
                    }
                  }}
                  placeholder={t('submit.titlePlaceholder')}
                  className="w-full p-3 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-civic-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {t('submit.descLabel')} <span className="text-rose-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (e.target.value.length > 8) {
                      const ai = analyzeComplaintText(`${title} ${e.target.value}`);
                      setAiSuggestion(ai);
                    }
                  }}
                  placeholder={t('submit.descPlaceholder')}
                  className="w-full p-3 border border-slate-300 rounded-xl font-normal leading-relaxed focus:ring-2 focus:ring-civic-500 focus:outline-none"
                />
              </div>

              {/* Smart AI Assistant Suggestion Banner */}
              {aiSuggestion && aiSuggestion.confidenceScore > 60 && (
                <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-3.5 space-y-2 animate-in fade-in-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-violet-900 font-bold text-xs">
                      <Bot className="w-4 h-4 text-violet-600" />
                      <span>Smart Assistant Suggestion</span>
                      <span className="text-[10px] bg-violet-100 text-violet-800 px-1.5 py-0.5 rounded font-mono font-normal">
                        {aiSuggestion.confidenceScore}% confidence
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategoryId(aiSuggestion.suggestedCategoryId);
                        alert(`Category automatically updated to: ${aiSuggestion.suggestedCategory.name} (${aiSuggestion.suggestedDepartment.name})`);
                      }}
                      className="px-2.5 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-bold text-[11px] shadow-xs transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Apply Suggestion</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-violet-800 leading-relaxed">
                    💡 <strong>Suggested Category:</strong> {aiSuggestion.suggestedCategory.name} • <strong>Department:</strong> {aiSuggestion.suggestedDepartment.name} • <strong>Priority:</strong> {aiSuggestion.suggestedPriority.toUpperCase()}
                  </p>
                  <p className="text-[11px] text-slate-600 italic">
                    Reason: {aiSuggestion.reasoning}
                  </p>
                </div>
              )}

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {t('submit.landmarkLabel')}
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder={t('submit.landmarkPlaceholder')}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-civic-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <button
                type="button"
                disabled={!title.trim() || !description.trim()}
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-civic-600 hover:bg-civic-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
              >
                <span>Upload Photos</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Photo / Video Upload */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t('submit.step3Title')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('submit.uploadHelp')}
              </p>
            </div>

            <div className="space-y-3">
              {/* Photo Preview Card */}
              {photoUrl ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-civic-500 bg-slate-900 h-56 flex items-center justify-center">
                  <img src={photoUrl} alt="Uploaded evidence" className="h-full w-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-1 rounded">
                    Photo Attached
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 space-y-2">
                  <Camera className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">{t('submit.uploadPrompt')}</p>
                </div>
              )}

              {/* Quick Sample Selector */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                <p className="font-bold text-slate-700">Quick Test Images (Simulated Camera/Gallery):</p>
                <div className="flex flex-wrap gap-2">
                  {samplePhotos.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(p.url)}
                      className={`px-3 py-1 rounded-lg font-medium text-xs border transition-colors ${
                        photoUrl === p.url
                          ? 'bg-civic-600 text-white border-civic-700'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Or Paste Custom Image URL:
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-civic-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-civic-600 hover:bg-civic-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
              >
                <span>Select Location</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Location Selection & Pin Drop */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t('submit.step4Title')}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('submit.locationHelp')}
                </p>
              </div>

              <button
                type="button"
                onClick={handleUseGps}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-civic-600" />
                <span>{t('submit.useGps')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  City:
                </label>
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    const found = INDIAN_CITIES.find((c) => c.city === e.target.value);
                    if (found) {
                      setLatitude(found.defaultLat);
                      setLongitude(found.defaultLng);
                    }
                  }}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-civic-500"
                >
                  {INDIAN_CITIES.map((c) => (
                    <option key={c.city} value={c.city}>
                      {c.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Ward / Zone:
                </label>
                <select
                  value={wardNo}
                  onChange={(e) => {
                    setWardNo(e.target.value);
                    const currCity = INDIAN_CITIES.find((c) => c.city === city);
                    const foundWard = currCity?.wards.find((w) => w.wardNo === e.target.value);
                    if (foundWard) {
                      setLatitude(foundWard.lat);
                      setLongitude(foundWard.lng);
                      setLocationAddress(`${foundWard.name}, ${city}`);
                    }
                  }}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold focus:ring-2 focus:ring-civic-500"
                >
                  {INDIAN_CITIES.find((c) => c.city === city)?.wards.map((w) => (
                    <option key={w.wardNo} value={w.wardNo}>
                      {w.wardNo} - {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Street / Area Address:
              </label>
              <input
                type="text"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                placeholder="e.g. Road No. 10, Banjara Hills"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-civic-500 focus:outline-none"
              />
            </div>

            {/* Interactive Location Picker Map */}
            <LocationPickerMap
              latitude={latitude}
              longitude={longitude}
              onLocationSelect={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <button
                type="button"
                onClick={handleNextFromLocation}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-civic-600 hover:bg-civic-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
              >
                <span>Review & Submit</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Anonymous Checkbox */}
        {currentStep === 5 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t('submit.step5Title')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Please verify your grievance details before submitting to the municipality.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-800">Category:</span>
                <span className="font-semibold text-civic-700">{selectedCategory?.name}</span>
              </div>

              <div>
                <span className="font-bold text-slate-800">Issue Title:</span>
                <p className="text-slate-700 mt-0.5 font-medium">{title}</p>
              </div>

              <div>
                <span className="font-bold text-slate-800">Description:</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">{description}</p>
              </div>

              <div>
                <span className="font-bold text-slate-800">Location:</span>
                <p className="text-slate-600 mt-0.5">{locationAddress} ({city}, {wardNo})</p>
                {landmark && <p className="text-slate-500 italic mt-0.5">Landmark: {landmark}</p>}
              </div>

              {photoUrl && (
                <div>
                  <span className="font-bold text-slate-800">Photo Proof:</span>
                  <img src={photoUrl} alt="Review evidence" className="mt-1 w-full h-32 object-cover rounded-xl border border-slate-300" />
                </div>
              )}
            </div>

            {/* Privacy / Anonymous Checkbox */}
            <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-civic-600 rounded border-slate-300 focus:ring-civic-500"
              />
              <span className="text-xs text-slate-700 leading-relaxed font-medium">
                {t('submit.anonymousCheck')}
              </span>
            </label>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-7 py-3 bg-civic-600 hover:bg-civic-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-civic-600/30 transition-all hover:scale-[1.02] active:scale-98"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{isSubmitting ? t('submit.submitting') : t('submit.submitButton')}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Duplicate Alert Modal */}
      {showDuplicateModal && (
        <DuplicateAlertModal
          duplicates={nearbyDuplicates}
          onSupportExisting={handleSupportExisting}
          onCreateNewAnyway={handleCreateNewAnyway}
          onCancel={() => setShowDuplicateModal(false)}
        />
      )}
    </div>
  );
};
