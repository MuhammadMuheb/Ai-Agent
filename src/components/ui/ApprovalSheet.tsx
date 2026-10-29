import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, Edit3, XCircle, Send } from 'lucide-react';
import { Button } from './Button.tsx';
import { Badge } from './Badge.tsx';
import { ApprovalItem } from '../../types/index.ts';

interface ApprovalSheetProps {
  item: ApprovalItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRespond: (id: string, action: 'approved' | 'modified' | 'denied', feedback?: string, updatedContent?: string) => void;
}

export const ApprovalSheet: React.FC<ApprovalSheetProps> = ({
  item,
  isOpen,
  onClose,
  onRespond,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState('');

  useEffect(() => {
    if (item) {
      setDraftContent(item.content);
      setIsEditing(false);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleBhejDo = () => {
    if (isEditing && draftContent !== item.content) {
      onRespond(item.id, 'modified', undefined, draftContent);
    } else {
      onRespond(item.id, 'approved');
    }
    onClose();
  };

  const handleBadlo = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    onRespond(item.id, 'denied', 'Muheb bhai ne cancel kar diya');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#0b1118] border-t md:border border-[#1c2a38] md:rounded-t-2xl p-5 md:p-6 shadow-2xl animate-in slide-in-from-bottom-6 duration-300 flex flex-col gap-4 text-[#e6edf3]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1c2a38] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff4d5e]/15 border border-[#ff4d5e]/30 flex items-center justify-center text-[#ff4d5e]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-[#e6edf3]">{item.title}</h3>
                <Badge variant="laal">LAAL DARJA</Badge>
              </div>
              <p className="text-xs text-[#8b9bab]">
                Yeh kaam baghair aap ki manzoori ke aage nahi barh sakta.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8b9bab] hover:text-[#e6edf3] p-1.5 rounded-lg hover:bg-[#111a24] transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Action Details */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs text-[#8b9bab] font-mono">
            <span>RECIPIENT: <strong className="text-[#e6edf3] font-sans">{item.recipient || 'N/A'}</strong></span>
            <span>CHANNEL: <strong className="text-[#27d7e6] font-sans">{item.channel || 'System Tool'}</strong></span>
            <span>WAQT: {item.createdAt}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#8b9bab] uppercase tracking-wider">
              {isEditing ? 'Message Tabdeel Karein (Edit)' : 'Bheja Jane Wala Paighaam:'}
            </label>
            {isEditing ? (
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                rows={4}
                className="w-full bg-[#111a24] border border-[#27d7e6] rounded-lg p-3 text-sm text-[#e6edf3] focus:outline-none focus:ring-1 focus:ring-[#27d7e6] resize-none"
                autoFocus
              />
            ) : (
              <div className="bg-[#111a24] border border-[#1c2a38] rounded-lg p-3.5 text-sm text-[#e6edf3] font-normal leading-relaxed whitespace-pre-wrap">
                {draftContent}
              </div>
            )}
          </div>
        </div>

        {/* The 3 Blueprint Buttons: BHEJ DO, BADLO, CANCEL */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {/* 1. CANCEL */}
          <Button
            variant="danger"
            onClick={handleCancel}
            className="w-full text-xs md:text-sm font-bold tracking-wider"
          >
            <XCircle className="w-4 h-4 mr-1.5" />
            CANCEL
          </Button>

          {/* 2. BADLO */}
          <Button
            variant="secondary"
            onClick={handleBadlo}
            className={`w-full text-xs md:text-sm font-bold tracking-wider ${
              isEditing ? 'border-[#27d7e6] text-[#27d7e6]' : ''
            }`}
          >
            <Edit3 className="w-4 h-4 mr-1.5" />
            BADLO
          </Button>

          {/* 3. BHEJ DO */}
          <Button
            variant="primary"
            onClick={handleBhejDo}
            className="w-full text-xs md:text-sm font-bold tracking-wider bg-[#2ee59d] hover:bg-[#26c485] text-[#05080c]"
          >
            <Send className="w-4 h-4 mr-1.5" />
            BHEJ DO
          </Button>
        </div>
      </div>
    </div>
  );
};
